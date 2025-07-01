# Frontend Dockerfile for Vite development
FROM node:18-alpine

# Set working directory
WORKDIR /var/www/html

# Copy package files
COPY frontend/web/package*.json ./

# Install dependencies
RUN npm install

# Copy frontend source code
COPY frontend/web/ ./

# Expose Vite dev server port
EXPOSE 5173

# Start Vite development server
CMD ["npm", "run", "dev"]