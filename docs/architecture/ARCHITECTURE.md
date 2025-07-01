# Attendance System Architecture

## Overview
School Attendance System dengan arsitektur microservices yang menggunakan Laravel sebagai backend API dan FastAPI enterprise untuk face recognition service.

## Struktur Direktori

```
attendance-system/
├── backend/                           # Laravel 12 Backend
│   ├── app/
│   │   ├── Http/Controllers/
│   │   │   ├── Api/                   # API Controllers
│   │   │   └── Web/                   # Web Controllers  
│   │   ├── Models/                    # Eloquent Models
│   │   ├── Services/                  # Business Logic
│   │   └── Providers/                 # Service Providers
│   ├── routes/
│   │   ├── api.php                    # API Routes (RESTful)
│   │   └── web.php                    # Web Routes (Blade)
│   └── database/
│       ├── migrations/                # Database Schema
│       └── seeders/                   # Sample Data
│
├── services/
│   └── face-recognition/              # Enterprise FastAPI Service
│       ├── app/
│       │   ├── api/                   # API Endpoints
│       │   │   ├── face_detection.py  # Face Detection API
│       │   │   └── health.py          # Health Check API
│       │   ├── core/                  # Core Configuration
│       │   │   ├── config.py          # Settings Management
│       │   │   ├── database.py        # Database Connection
│       │   │   └── logging.py         # Structured Logging
│       │   ├── services/              # Business Logic
│       │   │   ├── face_detection.py  # Face Recognition Logic
│       │   │   ├── gesture_detection.py # Gesture Detection
│       │   │   └── liveness_detection.py # Anti-Spoofing
│       │   ├── models/                # Database Models
│       │   │   └── face_encoding.py   # Face Encoding Model
│       │   └── utils/                 # Utilities
│       │       └── metrics.py         # Performance Metrics
│       ├── storage/                   # File Storage
│       │   ├── encodings/             # Face Encodings (JSON)
│       │   └── photos/                # Employee Photos
│       └── requirements.txt           # Python Dependencies
│
├── frontend/                          # Frontend Assets
│   ├── resources/
│   │   ├── views/                     # Blade Templates
│   │   │   ├── components/            # Reusable Components
│   │   │   ├── layouts/               # Layout Templates
│   │   │   └── pages/                 # Page Templates
│   │   └── js/                        # JavaScript/Vue Components
│   │       └── components/            # Vue.js Components
│   └── public/                        # Static Assets
│
├── docker/                            # Docker Configuration
│   ├── apache-minimal.conf            # Apache Configuration
│   ├── entrypoint-dev.sh             # Development Entrypoint
│   └── init-db.sql                   # Database Initialization
│
├── storage/                           # Persistent Storage
│   ├── face_encodings/                # Face Recognition Data
│   └── employee_photos/               # Employee Photos
│
└── docker-compose.dev.yml             # Development Environment
```

## Services Architecture

### 1. Laravel Backend (Port 8000)
**Technology**: Laravel 12 + PostgreSQL + Apache
**Responsibilities**:
- User authentication & authorization
- Employee management
- Attendance recording & reporting
- Schedule management
- Payroll processing
- Web interface (Blade templates)
- RESTful API for mobile/external apps

**Key Features**:
- Role-based permissions (Admin, HR, Manager, Employee)
- GPS-based attendance validation
- Real-time dashboard
- PDF report generation
- Excel import/export
- Activity logging

### 2. Face Recognition Service (Port 8001)
**Technology**: FastAPI + MediaPipe + face_recognition + PostgreSQL
**Responsibilities**:
- Face detection and recognition
- Gesture detection (smile, blink, nod, shake)
- Liveness detection (anti-spoofing)
- Face encoding management
- Performance metrics and monitoring

**Key Features**:
- **Enterprise-grade**: Structured logging, metrics, rate limiting
- **Anti-spoofing**: Texture analysis, 3D structure detection, motion analysis
- **Gesture Detection**: Head movements, facial expressions for security
- **Database Integration**: PostgreSQL for face encodings storage
- **RESTful API**: Complete CRUD operations for face management
- **Health Monitoring**: Health checks and performance metrics

### 3. Development Tools
**Vite (Port 5173)**: Hot reload for frontend assets
**PostgreSQL (Port 5432)**: Primary database

## API Endpoints

### Laravel Backend API (Port 8000)
```
# Authentication
POST /api/v1/auth/login
POST /api/v1/auth/logout
GET  /api/v1/auth/user

# Employees
GET    /api/v1/employees
POST   /api/v1/employees
PUT    /api/v1/employees/{id}
DELETE /api/v1/employees/{id}

# Attendance
GET  /api/v1/attendance/today
POST /api/v1/attendance/check-in
POST /api/v1/attendance/check-out
GET  /api/v1/attendance/history
```

### Face Recognition Service API (Port 8001)
```
# Face Management
POST /api/v1/enroll-face          # Register new face
POST /api/v1/verify-face          # Verify face against database
POST /api/v1/detect-face          # Detect faces in image

# Advanced Features
POST /api/v1/detect-gestures      # Detect facial gestures
POST /api/v1/liveness-check       # Anti-spoofing verification

# System
GET  /health                      # Service health check
GET  /                           # Service information
```

## Technology Stack

### Backend
- **Laravel 12**: PHP framework for web application
- **PostgreSQL 16**: Primary database
- **Apache 2.4**: Web server
- **Spatie Packages**: Permissions, activity log
- **Composer**: PHP dependency management

### Face Recognition Service
- **FastAPI**: Modern Python web framework
- **MediaPipe**: Google's ML framework for gesture detection
- **face_recognition**: Face recognition library
- **OpenCV**: Computer vision library
- **SQLAlchemy**: Python ORM
- **Pydantic**: Data validation
- **Uvicorn**: ASGI server

### Frontend
- **Blade Templates**: Server-side rendering
- **Vue.js**: Reactive components
- **Tabler**: UI framework
- **Vite**: Build tool and dev server

### DevOps
- **Docker**: Containerization
- **Docker Compose**: Multi-container orchestration
- **PostgreSQL**: Database service

## Key Improvements from Simple to Enterprise

### 1. Face Recognition Service Upgrade
**Before (Simple)**:
- Single file implementation
- File-based storage (pickle files)
- Basic error handling
- No monitoring or metrics

**After (Enterprise)**:
- Modular architecture with separation of concerns
- Database integration with PostgreSQL
- Comprehensive error handling and logging
- Performance metrics and monitoring
- Rate limiting and security features
- Health checks and service discovery
- Advanced anti-spoofing algorithms
- Gesture detection with confidence scoring

### 2. Database Integration
- **Centralized Database**: Both Laravel and FastAPI use same PostgreSQL instance
- **Data Consistency**: Face encodings stored in database with metadata
- **Backup & Recovery**: Database-based storage allows proper backup strategies
- **Scalability**: Database can be scaled independently

### 3. Production-Ready Features
- **Structured Logging**: JSON-formatted logs with contextual information
- **Metrics Collection**: Performance monitoring and alerting
- **Health Checks**: Service availability monitoring
- **Rate Limiting**: API protection against abuse
- **Security**: Authentication, input validation, error sanitization

## Development Workflow

### Starting Development Environment
```bash
# Start all services
docker-compose -f docker-compose.dev.yml up -d

# Check service status
docker-compose -f docker-compose.dev.yml ps

# View logs
docker-compose -f docker-compose.dev.yml logs -f face_service
```

### Accessing Services
- **Laravel Application**: http://localhost:8000
- **Face Recognition API**: http://localhost:8001
- **API Documentation**: http://localhost:8001/docs
- **Vite Dev Server**: http://localhost:5173

### Database Access
```bash
# Connect to PostgreSQL
docker exec -it attendance_postgres_dev psql -U attendance_user -d attendance_system
```

## Security Features

### Face Recognition Security
1. **Liveness Detection**: Prevents photo/video spoofing
2. **Gesture Requirements**: Multiple gestures required for verification
3. **Quality Scoring**: Face image quality validation
4. **Rate Limiting**: API abuse prevention
5. **Input Validation**: Comprehensive data validation

### Application Security
1. **Role-based Access Control**: Granular permissions
2. **CSRF Protection**: Laravel's built-in protection
3. **SQL Injection Prevention**: Eloquent ORM protection
4. **XSS Protection**: Blade template escaping
5. **GPS Validation**: Location-based attendance verification

## Performance Optimizations

### Face Recognition Service
- **Optimized Libraries**: Pre-compiled face_recognition wheels
- **Efficient Algorithms**: MediaPipe for real-time processing
- **Database Indexing**: Optimized queries for face matching
- **Caching**: Redis integration ready for face encoding cache

### Laravel Application
- **Database Optimization**: Indexed queries and relationships
- **Asset Optimization**: Vite for modern asset bundling
- **OPCache**: PHP opcache enabled in production
- **Session Optimization**: File-based sessions for development

## Monitoring & Observability

### Health Checks
- **Service Health**: Each service exposes health endpoints
- **Database Connectivity**: Automatic database connection testing
- **Dependency Checks**: External service availability monitoring

### Metrics Collection
- **Request Metrics**: Response times, status codes, throughput
- **Business Metrics**: Face detection success rates, gesture completion
- **System Metrics**: CPU, memory, disk usage
- **Error Tracking**: Structured error logging with context

## Summary of Implemented Separations

### ✅ 1. API and Web Routes Separation
- **API Routes** (`backend/routes/api.php`): Pure REST API endpoints with `/api/v1` prefix
- **Web Routes** (`backend/routes/web.php`): Traditional web interface routes
- **Controllers**: Separated into `Api/` and main controller directories
- **Middleware**: Different middleware stacks for API vs Web

### ✅ 2. Microservice Architecture - Face Recognition Independence  
- **Service Client** (`backend/app/Services/FaceRecognitionService.php`): HTTP client for communication
- **Configuration** (`backend/config/services.php`): Face recognition service settings
- **Independent Service**: FastAPI service on port 8001 with complete independence
- **Fault Tolerance**: Error handling and fallback mechanisms

### ✅ 3. Frontend Separation and Modernization
- **Vue.js 3 SPA** (`frontend/web/src/`): Complete single-page application
- **Component Structure**: Pages, layouts, components separation
- **State Management**: Pinia stores for authentication and app state  
- **Routing**: Vue Router with authentication guards and permissions
- **Build System**: Vite with optimized configuration for microservices

### ✅ 4. Updated Configurations
- **Docker Configuration**: Separate containers for each service
- **Vite Configuration**: Proxy setup for API communication
- **Service Discovery**: Environment-based service URLs
- **CORS Configuration**: Proper cross-origin setup

## Future Enhancements

### Planned Features
1. **Mobile Application**: React Native app for mobile attendance
2. **Real-time Notifications**: WebSocket-based real-time updates
3. **Advanced Analytics**: Machine learning insights on attendance patterns
4. **Multi-tenant Support**: Multiple school/organization support
5. **API Gateway**: Centralized API management and routing

### Scalability Considerations
1. **Horizontal Scaling**: Load balancer ready architecture
2. **Database Sharding**: Face encodings can be distributed
3. **Microservices**: Additional services can be added easily
4. **Cloud Deployment**: Kubernetes deployment configurations
5. **CDN Integration**: Static asset delivery optimization