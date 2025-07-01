"""Main FastAPI application for Face Recognition Service"""

import cv2
import face_recognition
import numpy as np
import mediapipe as mp
import pickle
import os
import base64
from io import BytesIO
from PIL import Image
from typing import List, Dict, Optional
import asyncio
import aiofiles
import uvicorn
from fastapi import FastAPI, File, UploadFile, HTTPException, Form
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pydantic import BaseModel
import logging
from datetime import datetime

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Initialize FastAPI app
app = FastAPI(
    title="School Attendance Face Detection API",
    description="Face recognition and gesture detection for attendance system",
    version="1.0.0"
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:8000", "http://127.0.0.1:8000", "*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize MediaPipe
mp_face_mesh = mp.solutions.face_mesh
mp_drawing = mp.solutions.drawing_utils
mp_face_detection = mp.solutions.face_detection

# Global variables
face_mesh = mp_face_mesh.FaceMesh(
    max_num_faces=1,
    refine_landmarks=True,
    min_detection_confidence=0.5,
    min_tracking_confidence=0.5
)

face_detection = mp_face_detection.FaceDetection(
    model_selection=0,
    min_detection_confidence=0.5
)

# Storage paths
ENCODINGS_PATH = "storage/encodings"
EMPLOYEE_PHOTOS_PATH = "storage/photos"

# Create directories if they don't exist
os.makedirs(ENCODINGS_PATH, exist_ok=True)
os.makedirs(EMPLOYEE_PHOTOS_PATH, exist_ok=True)

# Pydantic models
class FaceRegisterRequest(BaseModel):
    employee_id: str
    employee_name: str

class FaceVerifyRequest(BaseModel):
    image_data: str  # Base64 encoded image
    require_gestures: bool = True

class GestureDetectionResult(BaseModel):
    head_shake: bool
    head_nod: bool
    smile: bool
    blink: bool
    confidence: float

class AttendanceResponse(BaseModel):
    success: bool
    employee_id: Optional[str]
    employee_name: Optional[str]
    confidence: float
    gestures: Optional[GestureDetectionResult]
    message: str
    timestamp: datetime

def load_employee_encodings():
    """Load all employee face encodings from disk"""
    encodings = {}
    encoding_files = [f for f in os.listdir(ENCODINGS_PATH) if f.endswith('.pkl')]
    
    for file in encoding_files:
        employee_id = file.replace('.pkl', '')
        try:
            with open(os.path.join(ENCODINGS_PATH, file), 'rb') as f:
                data = pickle.load(f)
                encodings[employee_id] = {
                    'encoding': data['encoding'],
                    'name': data['name']
                }
            logger.info(f"Loaded encoding for employee {employee_id}")
        except Exception as e:
            logger.error(f"Error loading encoding for {employee_id}: {e}")
    
    return encodings

def base64_to_image(base64_string):
    """Convert base64 string to OpenCV image"""
    try:
        # Remove data URL prefix if present
        if 'data:image' in base64_string:
            base64_string = base64_string.split(',')[1]
        
        # Decode base64
        image_data = base64.b64decode(base64_string)
        image = Image.open(BytesIO(image_data))
        
        # Convert to OpenCV format
        opencv_image = cv2.cvtColor(np.array(image), cv2.COLOR_RGB2BGR)
        return opencv_image
    except Exception as e:
        logger.error(f"Error converting base64 to image: {e}")
        return None

@app.get("/")
async def root():
    """Health check endpoint"""
    return {"message": "Face Detection API is running", "status": "healthy"}

@app.get("/health")
async def health_check():
    """Detailed health check"""
    return {
        "status": "healthy",
        "services": {
            "face_recognition": "operational",
            "gesture_detection": "operational",
            "mediapipe": "operational"
        },
        "timestamp": datetime.now()
    }

@app.post("/api/v1/register-face")
async def register_face(
    employee_id: str = Form(...),
    employee_name: str = Form(...),
    file: UploadFile = File(...)
):
    """Register a new employee's face for recognition"""
    try:
        # Validate file type
        if not file.content_type.startswith('image/'):
            raise HTTPException(status_code=400, detail="File must be an image")
        
        # Read and process image
        image_data = await file.read()
        image = Image.open(BytesIO(image_data))
        image_array = np.array(image)
        
        # Convert to RGB if necessary
        if len(image_array.shape) == 3 and image_array.shape[2] == 4:
            image_array = cv2.cvtColor(image_array, cv2.COLOR_RGBA2RGB)
        elif len(image_array.shape) == 3 and image_array.shape[2] == 3:
            image_array = cv2.cvtColor(image_array, cv2.COLOR_BGR2RGB)
        
        # Detect faces
        face_locations = face_recognition.face_locations(image_array)
        
        if len(face_locations) == 0:
            raise HTTPException(status_code=400, detail="No face detected in the image")
        
        if len(face_locations) > 1:
            raise HTTPException(status_code=400, detail="Multiple faces detected. Please use an image with only one face")
        
        # Generate face encoding
        face_encodings = face_recognition.face_encodings(image_array, face_locations)
        
        if len(face_encodings) == 0:
            raise HTTPException(status_code=400, detail="Could not generate face encoding")
        
        face_encoding = face_encodings[0]
        
        # Save encoding to disk
        encoding_data = {
            'encoding': face_encoding,
            'name': employee_name,
            'employee_id': employee_id,
            'registered_at': datetime.now().isoformat()
        }
        
        encoding_file = os.path.join(ENCODINGS_PATH, f"{employee_id}.pkl")
        with open(encoding_file, 'wb') as f:
            pickle.dump(encoding_data, f)
        
        # Save original photo
        photo_file = os.path.join(EMPLOYEE_PHOTOS_PATH, f"{employee_id}.jpg")
        async with aiofiles.open(photo_file, 'wb') as f:
            await f.write(image_data)
        
        logger.info(f"Successfully registered face for employee {employee_id} - {employee_name}")
        
        return {
            "success": True,
            "message": f"Face registered successfully for {employee_name}",
            "employee_id": employee_id,
            "employee_name": employee_name
        }
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error registering face: {e}")
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")

@app.post("/api/v1/verify-face")
async def verify_face(request: FaceVerifyRequest):
    """Verify face against registered employees"""
    try:
        # Convert base64 to image
        image = base64_to_image(request.image_data)
        if image is None:
            raise HTTPException(status_code=400, detail="Invalid image data")
        
        # Load all employee encodings
        employee_encodings = load_employee_encodings()
        
        if not employee_encodings:
            raise HTTPException(status_code=404, detail="No registered employees found")
        
        # Convert to RGB for face_recognition
        rgb_image = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)
        
        # Detect faces
        face_locations = face_recognition.face_locations(rgb_image)
        
        if len(face_locations) == 0:
            return AttendanceResponse(
                success=False,
                employee_id=None,
                employee_name=None,
                confidence=0.0,
                gestures=None,
                message="No face detected in the image",
                timestamp=datetime.now()
            )
        
        # Generate encodings for detected faces
        face_encodings = face_recognition.face_encodings(rgb_image, face_locations)
        
        if len(face_encodings) == 0:
            return AttendanceResponse(
                success=False,
                employee_id=None,
                employee_name=None,
                confidence=0.0,
                gestures=None,
                message="Could not generate face encoding",
                timestamp=datetime.now()
            )
        
        # Compare with registered employees
        best_match = None
        best_confidence = 0.0
        
        for employee_id, data in employee_encodings.items():
            # Calculate face distance (lower is better)
            distances = face_recognition.face_distance([data['encoding']], face_encodings[0])
            confidence = 1 - distances[0]  # Convert distance to confidence
            
            if confidence > best_confidence and confidence > 0.6:  # Threshold for recognition
                best_confidence = confidence
                best_match = {
                    'employee_id': employee_id,
                    'employee_name': data['name'],
                    'confidence': confidence
                }
        
        if best_match:
            return AttendanceResponse(
                success=True,
                employee_id=best_match['employee_id'],
                employee_name=best_match['employee_name'],
                confidence=best_confidence,
                gestures=None,
                message="Face verified successfully",
                timestamp=datetime.now()
            )
        else:
            return AttendanceResponse(
                success=False,
                employee_id=None,
                employee_name=None,
                confidence=0.0,
                gestures=None,
                message="Face not recognized. Please register first or try again",
                timestamp=datetime.now()
            )
            
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error verifying face: {e}")
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")

@app.delete("/api/v1/remove-face/{employee_id}")
async def remove_face(employee_id: str):
    """Remove employee's face registration"""
    try:
        encoding_file = os.path.join(ENCODINGS_PATH, f"{employee_id}.pkl")
        photo_file = os.path.join(EMPLOYEE_PHOTOS_PATH, f"{employee_id}.jpg")
        
        files_removed = []
        
        if os.path.exists(encoding_file):
            os.remove(encoding_file)
            files_removed.append("encoding")
        
        if os.path.exists(photo_file):
            os.remove(photo_file)
            files_removed.append("photo")
        
        if not files_removed:
            raise HTTPException(status_code=404, detail="Employee face data not found")
        
        logger.info(f"Removed face data for employee {employee_id}")
        
        return {
            "success": True,
            "message": f"Face data removed successfully for employee {employee_id}",
            "files_removed": files_removed
        }
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error removing face data: {e}")
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")

@app.get("/api/v1/employees")
async def list_registered_employees():
    """List all registered employees"""
    try:
        employee_encodings = load_employee_encodings()
        
        employees = []
        for employee_id, data in employee_encodings.items():
            employees.append({
                "employee_id": employee_id,
                "employee_name": data['name'],
                "has_photo": os.path.exists(os.path.join(EMPLOYEE_PHOTOS_PATH, f"{employee_id}.jpg"))
            })
        
        return {
            "success": True,
            "count": len(employees),
            "employees": employees
        }
        
    except Exception as e:
        logger.error(f"Error listing employees: {e}")
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")

if __name__ == "__main__":
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8001,
        reload=True,
        log_level="info"
    )