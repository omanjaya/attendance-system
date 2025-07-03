# Hostinger VPS Deployment Checklist

## Pre-Deployment Requirements

### VPS Requirements

-   [ ] **Minimum VPS Specs:**
    -   CPU: 2 vCPUs minimum (4 vCPUs recommended)
    -   RAM: 4GB minimum (8GB recommended)
    -   Storage: 40GB SSD minimum
    -   OS: Ubuntu 20.04 LTS or higher
    -   Network: Stable internet with public IP

### Domain & DNS

-   [absensi.manufac.id] Domain registered and pointing to VPS IP
-   [done] DNS A record configured for main domain
-   [done] DNS A record configured for www subdomain (if needed)
-   [ ] SSL certificate ready (Let's Encrypt recommended)

## Deployment Steps

### 1. Initial Server Setup

-   [ ] SSH into your Hostinger VPS
-   [ ] Update system packages: `sudo apt update && sudo apt upgrade -y`
-   [ ] Create non-root user if needed
-   [ ] Configure SSH key authentication
-   [ ] Disable root login and password authentication in SSH

### 2. Clone Project

```bash
git clone https://github.com/omanjaya/attendance-system.git ~/attendance-system
cd ~/attendance-system
```

### 3. Run Deployment Script

```bash
chmod +x scripts/deployment/deploy-hostinger.sh
./scripts/deployment/deploy-hostinger.sh your-domain.com
```

### 4. Environment Configuration

-   [ ] Update `backend/.env` with production values:
    -   [ ] Set strong database password
    -   [ ] Configure mail settings (SMTP)
    -   [ ] Set proper APP_URL
    -   [ ] Configure face recognition settings
    -   [ ] Set Redis password (optional but recommended)

### 5. SSL Certificate Setup

-   [ ] Install Let's Encrypt certificate:

```bash
sudo certbot certonly --standalone -d your-domain.com -d www.your-domain.com
```

-   [ ] Update nginx configuration with certificate paths:
    -   Certificate: `/etc/letsencrypt/live/your-domain.com/fullchain.pem`
    -   Key: `/etc/letsencrypt/live/your-domain.com/privkey.pem`

### 6. Database Setup

-   [ ] Verify PostgreSQL is running
-   [ ] Run migrations: `docker compose -f docker-compose.hostinger.yml exec backend php artisan migrate`
-   [ ] Seed initial admin user (if needed): `docker compose -f docker-compose.hostinger.yml exec backend php artisan db:seed`

### 7. Storage Configuration

-   [ ] Create storage symlink: `docker compose -f docker-compose.hostinger.yml exec backend php artisan storage:link`
-   [ ] Set proper permissions for storage directories
-   [ ] Verify file upload functionality

### 8. Performance Optimization

-   [ ] Enable OPcache in PHP configuration
-   [ ] Configure Redis for caching and sessions
-   [ ] Enable Gzip compression in nginx
-   [ ] Set up CDN for static assets (optional)

### 9. Security Configuration

-   [ ] Configure firewall (UFW):

```bash
sudo ufw allow 22/tcp    # SSH
sudo ufw allow 80/tcp    # HTTP
sudo ufw allow 443/tcp   # HTTPS
sudo ufw enable
```

-   [ ] Set up fail2ban for SSH protection
-   [ ] Configure application security headers
-   [ ] Review and update CORS settings
-   [ ] Enable rate limiting

### 10. Monitoring Setup

-   [ ] Configure health check endpoints
-   [ ] Set up log rotation
-   [ ] Configure backup automation
-   [ ] Set up uptime monitoring (external service)
-   [ ] Configure error alerting

## Post-Deployment Verification

### Application Testing

-   [ ] Access frontend: `https://your-domain.com`
-   [ ] Test login functionality
-   [ ] Verify API endpoints: `https://your-domain.com/api/health`
-   [ ] Test face recognition service: `https://your-domain.com/face-api/health`
-   [ ] Check attendance clock-in/out
-   [ ] Verify GPS location features
-   [ ] Test report generation
-   [ ] Verify email notifications

### Performance Testing

-   [ ] Run load test on API endpoints
-   [ ] Check page load times
-   [ ] Monitor resource usage (CPU, RAM, Disk)
-   [ ] Verify caching is working

### Security Testing

-   [ ] SSL certificate validation
-   [ ] Check security headers
-   [ ] Verify HTTPS redirect
-   [ ] Test rate limiting
-   [ ] Check for exposed sensitive files

## Maintenance Tasks

### Daily

-   [ ] Monitor application logs
-   [ ] Check disk usage
-   [ ] Verify backup completion

### Weekly

-   [ ] Review error logs
-   [ ] Check for security updates
-   [ ] Monitor performance metrics
-   [ ] Test backup restoration

### Monthly

-   [ ] Update dependencies
-   [ ] Review and rotate logs
-   [ ] Security audit
-   [ ] Performance optimization review

## Troubleshooting Commands

### View Logs

```bash
# All containers
docker compose -f docker-compose.hostinger.yml logs -f

# Specific service
docker compose -f docker-compose.hostinger.yml logs -f backend
docker compose -f docker-compose.hostinger.yml logs -f face_service
```

### Container Management

```bash
# Restart all services
docker compose -f docker-compose.hostinger.yml restart

# Restart specific service
docker compose -f docker-compose.hostinger.yml restart backend

# View running containers
docker compose -f docker-compose.hostinger.yml ps
```

### Database Access

```bash
# Access PostgreSQL
docker compose -f docker-compose.hostinger.yml exec postgres psql -U attendance_user -d attendance_system

# Backup database
docker compose -f docker-compose.hostinger.yml exec postgres pg_dump -U attendance_user attendance_system > backup.sql
```

### Clear Cache

```bash
docker compose -f docker-compose.hostinger.yml exec backend php artisan cache:clear
docker compose -f docker-compose.hostinger.yml exec backend php artisan config:clear
docker compose -f docker-compose.hostinger.yml exec backend php artisan route:clear
```

## Emergency Contacts

-   Hostinger Support: [Your support ticket system]
-   System Admin: [Contact information]
-   Development Team: [Contact information]

## Important URLs

-   Production Site: `https://your-domain.com`
-   API Documentation: `https://your-domain.com/api/documentation`
-   Health Check: `https://your-domain.com/health`
-   Admin Panel: `https://your-domain.com/admin`

## Notes

1. Always test changes in a staging environment first
2. Keep backups before making major changes
3. Document any custom configurations
4. Monitor resource usage regularly
5. Keep all software updated for security
