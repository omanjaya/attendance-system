# VPS Deployment Guide

## Prerequisites

### Server Requirements
- Ubuntu 20.04 LTS or later
- Minimum 2GB RAM, 2 CPU cores
- 20GB+ storage space
- Root/sudo access

### Install Required Software

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
sudo usermod -aG docker $USER

# Install Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# Install Git and other tools
sudo apt install -y git curl openssl

# Logout and login to apply docker group changes
```

## Deployment Steps

### 1. Clone Repository

```bash
cd /home/$USER
git clone <your-repository-url> attendance-system
cd attendance-system
```

### 2. Configure Environment

#### Backend Configuration
```bash
# Copy and edit production environment
cp backend/.env.production backend/.env

# Generate application key
docker run --rm -v $(pwd)/backend:/app composer:latest composer install --working-dir=/app
docker run --rm -v $(pwd)/backend:/app php:8.2-cli php /app/artisan key:generate --show
```

#### Frontend Configuration
```bash
# Edit frontend production environment
nano frontend/web/.env.production
```

### 3. SSL Certificate Setup

#### Option A: Let's Encrypt (Recommended for Production)
```bash
# Install Certbot
sudo apt install -y certbot

# Generate certificate
sudo certbot certonly --standalone -d your-domain.com

# Copy certificates
sudo cp /etc/letsencrypt/live/your-domain.com/fullchain.pem /home/$USER/ssl/your-domain.crt
sudo cp /etc/letsencrypt/live/your-domain.com/privkey.pem /home/$USER/ssl/your-domain.key
sudo chown $USER:$USER /home/$USER/ssl/*
```

#### Option B: Self-Signed (Development/Testing)
```bash
# The deploy script will generate self-signed certificates automatically
```

### 4. Run Deployment Script

```bash
# Make script executable (if not already)
chmod +x deploy.sh

# Deploy with your domain
./deploy.sh production your-domain.com
```

### 5. Verify Deployment

```bash
# Check running containers
docker-compose -f docker-compose.prod.yml ps

# Check logs
docker-compose -f docker-compose.prod.yml logs

# Test endpoints
curl -k https://your-domain.com/api/health
curl -k https://your-domain.com
```

## Post-Deployment Configuration

### 1. Firewall Setup

```bash
# Install UFW
sudo apt install -y ufw

# Configure firewall
sudo ufw default deny incoming
sudo ufw default allow outgoing
sudo ufw allow ssh
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp

# Enable firewall
sudo ufw enable
```

### 2. SSL Certificate Auto-Renewal

```bash
# Add cron job for certificate renewal
echo "0 12 * * * /usr/bin/certbot renew --quiet && docker-compose -f /home/$USER/attendance-system/docker-compose.prod.yml restart nginx" | sudo crontab -
```

### 3. Monitoring Setup

```bash
# Install monitoring tools
sudo apt install -y htop iotop

# Check system resources
htop
docker stats
```

### 4. Backup Configuration

The deployment script automatically sets up:
- Daily database backups at 2 AM
- 7-day backup retention
- Docker system cleanup

Manual backup:
```bash
# Database backup
docker exec attendance_postgres_prod pg_dump -U attendance_user attendance_system > backup_$(date +%Y%m%d).sql

# Full system backup
tar -czf attendance_backup_$(date +%Y%m%d).tar.gz /home/$USER/attendance-system
```

## Maintenance Commands

### Container Management
```bash
# View running containers
docker-compose -f docker-compose.prod.yml ps

# View logs
docker-compose -f docker-compose.prod.yml logs -f [service_name]

# Restart services
docker-compose -f docker-compose.prod.yml restart [service_name]

# Update containers
git pull
docker-compose -f docker-compose.prod.yml build --no-cache
docker-compose -f docker-compose.prod.yml up -d
```

### Database Operations
```bash
# Run migrations
docker-compose -f docker-compose.prod.yml exec backend php artisan migrate

# Access database
docker exec -it attendance_postgres_prod psql -U attendance_user -d attendance_system

# Reset database (DANGER!)
docker-compose -f docker-compose.prod.yml exec backend php artisan migrate:fresh --seed
```

### Performance Monitoring
```bash
# Monitor resource usage
docker stats

# Check disk usage
df -h

# Monitor logs
tail -f /var/log/nginx/access.log
```

## Troubleshooting

### Common Issues

#### 1. Containers Won't Start
```bash
# Check logs
docker-compose -f docker-compose.prod.yml logs

# Check system resources
free -h
df -h
```

#### 2. Database Connection Issues
```bash
# Check database container
docker-compose -f docker-compose.prod.yml exec postgres pg_isready

# Check environment variables
docker-compose -f docker-compose.prod.yml exec backend env | grep DB_
```

#### 3. SSL Certificate Issues
```bash
# Check certificate files
ls -la /home/$USER/ssl/

# Test SSL
openssl s_client -connect your-domain.com:443
```

#### 4. Permission Issues
```bash
# Fix file permissions
sudo chown -R $USER:$USER /home/$USER/attendance-system
chmod +x deploy.sh
```

### Log Locations
- Nginx logs: `/var/log/nginx/`
- Application logs: `docker-compose logs`
- System logs: `/var/log/syslog`

## Security Recommendations

1. **Regular Updates**
   ```bash
   sudo apt update && sudo apt upgrade -y
   docker-compose -f docker-compose.prod.yml pull
   ```

2. **Fail2Ban Setup**
   ```bash
   sudo apt install -y fail2ban
   sudo systemctl enable fail2ban
   ```

3. **Database Security**
   - Use strong passwords
   - Regular backups
   - Monitor access logs

4. **Application Security**
   - Keep dependencies updated
   - Monitor for vulnerabilities
   - Regular security audits

## Support

For issues and questions:
1. Check application logs
2. Review this deployment guide
3. Check Docker and system resources
4. Consult Laravel and Vue.js documentation