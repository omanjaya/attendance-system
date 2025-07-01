# 📊 Attendance System

A comprehensive web-based attendance management system built with Laravel, Vue.js, and Python face recognition service.

<p align="center">
<a href="https://github.com/omanjaya/attendance-system/actions"><img src="https://img.shields.io/github/actions/workflow/status/omanjaya/attendance-system/deploy.yml?branch=main" alt="Build Status"></a>
<a href="https://github.com/omanjaya/attendance-system"><img src="https://img.shields.io/github/v/release/omanjaya/attendance-system" alt="Latest Release"></a>
<a href="https://github.com/omanjaya/attendance-system/blob/main/LICENSE"><img src="https://img.shields.io/github/license/omanjaya/attendance-system" alt="License"></a>
</p>

## 🚀 Features

### Core Functionality
- **👥 Employee Management** - Complete CRUD operations with role-based access
- **⏰ Attendance Tracking** - Real-time clock in/out with GPS validation
- **🎯 Face Recognition** - AI-powered facial recognition for secure authentication
- **📅 Schedule Management** - Flexible scheduling with period management
- **📊 Reporting & Analytics** - Comprehensive attendance reports and dashboards
- **💰 Payroll Integration** - Automated payroll calculations based on attendance
- **🔒 Security** - Role-based permissions, audit logging, and security monitoring

### Technical Features
- **📱 Responsive Design** - Mobile-first approach with PWA capabilities
- **🔄 Real-time Updates** - WebSocket integration for live notifications
- **🐳 Docker Support** - Complete containerization for easy deployment
- **🔧 CI/CD Pipeline** - Automated testing and deployment via GitHub Actions
- **🌐 Multi-environment** - Development, staging, and production configurations

## 🏗️ Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Vue.js SPA    │    │  Laravel API    │    │ Face Recognition│
│   (Frontend)    │◄──►│   (Backend)     │◄──►│    Service      │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         ▼                       ▼                       ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│     Nginx       │    │   PostgreSQL    │    │     Redis       │
│  (Web Server)   │    │   (Database)    │    │     (Cache)     │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## 📁 Project Structure

```
attendance-system/
├── 📂 backend/                 # Laravel API backend
│   ├── app/                   # Application logic
│   ├── database/              # Migrations, seeds, factories
│   ├── routes/                # API routes
│   └── tests/                 # Backend tests
├── 📂 frontend/web/           # Vue.js frontend
│   ├── src/                   # Source code
│   ├── public/                # Static assets
│   └── tests/                 # Frontend tests
├── 📂 services/               # Microservices
│   └── face-recognition-service/  # Python face recognition
├── 📂 docker/                 # Docker configurations
├── 📂 scripts/                # Deployment and utility scripts
│   ├── deployment/            # Deployment scripts
│   ├── testing/               # Test scripts
│   └── development/           # Development tools
├── 📂 docs/                   # Documentation
│   ├── architecture/          # Architecture docs
│   ├── deployment/            # Deployment guides
│   ├── setup/                 # Setup instructions
│   └── testing/               # Test reports
└── 📂 storage-backup/         # Backup directories
```

## 🚀 Quick Start

### Development Setup

1. **Clone Repository**
   ```bash
   git clone https://github.com/omanjaya/attendance-system.git
   cd attendance-system
   ```

2. **Start with Docker**
   ```bash
   # Development environment
   docker-compose up -d
   
   # Access the application
   # Frontend: http://localhost:5173
   # Backend API: http://localhost:8000
   # Face Recognition: http://localhost:8001
   ```

3. **Manual Setup**
   ```bash
   # Backend
   cd backend
   composer install
   cp .env.example .env
   php artisan key:generate
   php artisan migrate --seed
   
   # Frontend
   cd frontend/web
   npm install
   npm run dev
   
   # Face Recognition Service
   cd services/face-recognition-service
   pip install -r requirements.txt
   python app/main.py
   ```

### Production Deployment

1. **VPS Deployment (Automated)**
   ```bash
   # Run the automated setup script
   chmod +x scripts/deployment/setup-cicd.sh
   ./scripts/deployment/setup-cicd.sh your-domain.com
   ```

2. **Manual Deployment**
   ```bash
   # Deploy to production
   chmod +x scripts/deployment/deploy.sh
   ./scripts/deployment/deploy.sh production your-domain.com
   ```

## 📖 Documentation

- **🏗️ [Architecture Overview](docs/architecture/ARCHITECTURE.md)** - System design and components
- **🚀 [VPS Deployment Guide](docs/deployment/VPS-DEPLOYMENT.md)** - Production deployment
- **🔄 [CI/CD Setup](docs/deployment/CI-CD-SETUP.md)** - Automated deployment
- **⚙️ [Development Setup](docs/setup/CLAUDE_DEVELOPMENT_PROMPT.md)** - Development environment
- **🗄️ [Database Schema](docs/architecture/DATABASE.md)** - Database structure
- **🧪 [Testing Guide](docs/testing/)** - Testing procedures

## 🛠️ Technology Stack

### Frontend
- **Vue.js 3** - Progressive JavaScript framework
- **Pinia** - State management
- **Vue Router** - Client-side routing
- **Tabler UI** - Bootstrap-based UI framework
- **Vite** - Build tool and dev server

### Backend
- **Laravel 11** - PHP framework
- **Laravel Sanctum** - API authentication
- **Spatie Permissions** - Role-based access control
- **Laravel Telescope** - Debugging and monitoring

### Database & Cache
- **PostgreSQL** - Primary database
- **Redis** - Caching and sessions
- **Laravel Eloquent** - ORM

### Services
- **Python FastAPI** - Face recognition microservice
- **OpenCV** - Computer vision library
- **MediaPipe** - Face detection and landmarks

### DevOps
- **Docker & Docker Compose** - Containerization
- **Nginx** - Web server and reverse proxy
- **GitHub Actions** - CI/CD pipeline
- **PM2** - Process management

## 🔧 Configuration

### Environment Variables

**Backend (.env)**
```env
APP_NAME="Attendance System"
APP_ENV=production
APP_URL=https://your-domain.com
DB_CONNECTION=pgsql
DB_HOST=postgres
DB_DATABASE=attendance_system
REDIS_HOST=redis
```

**Frontend (.env.production)**
```env
VITE_API_URL=https://your-domain.com/api
VITE_FACE_API_URL=https://your-domain.com:8001
VITE_LOG_LEVEL=WARN
```

## 🧪 Testing

```bash
# Backend tests
cd backend
php artisan test

# Frontend tests
cd frontend/web
npm run test

# Integration tests
npm run test:e2e

# All tests
./scripts/testing/run-all-tests.sh
```

## 📊 Monitoring

- **Health Checks**: `/api/health`
- **Performance Monitoring**: Built-in performance tracking
- **Error Logging**: Comprehensive error logging
- **Security Auditing**: Request/response logging

## 🔒 Security Features

- **CSRF Protection** - Laravel Sanctum integration
- **SQL Injection Prevention** - Parameterized queries
- **XSS Protection** - Input sanitization
- **Rate Limiting** - API request throttling
- **Audit Logging** - Security event tracking
- **Role-based Access** - Granular permissions

## 🚀 Deployment Options

### 1. One-Click VPS Deployment
```bash
./scripts/deployment/setup-cicd.sh your-domain.com
```

### 2. Docker Deployment
```bash
docker-compose -f docker-compose.prod.yml up -d
```

### 3. GitHub Actions CI/CD
- Automatic testing on pull requests
- Automated deployment on main branch push
- Environment-specific deployments

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests
5. Submit a pull request

## 📝 License

This project is licensed under the MIT License.

## 📞 Support

- **Documentation**: Check the `docs/` directory
- **Issues**: [GitHub Issues](https://github.com/omanjaya/attendance-system/issues)
- **Discussions**: [GitHub Discussions](https://github.com/omanjaya/attendance-system/discussions)

## 🙏 Acknowledgments

- Built with modern web technologies
- Inspired by enterprise attendance management needs
- Community contributions welcome

---

**🚀 Ready to deploy?** Check out our [VPS Deployment Guide](docs/deployment/VPS-DEPLOYMENT.md) for step-by-step instructions!
