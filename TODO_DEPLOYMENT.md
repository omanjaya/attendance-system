# To-Do List for Deploying Attendance System on Hostinger VPS

## 1. Hostinger VPS Setup ⚙️

### Purchase and Configure VPS
- [ ] Purchase Hostinger VPS plan (minimum 4GB RAM, 2 vCPU, 40GB SSD)
- [ ] Choose Ubuntu 20.04 LTS or 22.04 LTS as operating system
- [ ] Note down your VPS IP address
- [ ] Set up root password or SSH key access

### Initial Server Access
- [ ] Download SSH client (PuTTY for Windows, or use Terminal for Mac/Linux)
- [ ] SSH into your VPS: `ssh root@your-vps-ip`
- [ ] Create a non-root user for security:
  ```bash
  adduser yourusername
  usermod -aG sudo yourusername
  ```

## 2. Domain Configuration 🌐

### Domain Setup
- [ ] Purchase domain name (if not already owned)
- [ ] In Hostinger panel, go to DNS Zone Editor
- [ ] Add A record pointing to your VPS IP:
  - Type: A
  - Name: @ (for root domain)
  - Points to: your-vps-ip
  - TTL: 14400
- [ ] Add www subdomain (optional):
  - Type: A  
  - Name: www
  - Points to: your-vps-ip
  - TTL: 14400
- [ ] Wait for DNS propagation (5-30 minutes)

## 3. Server Preparation 🖥️

### Basic Server Setup
- [ ] Update system packages:
  ```bash
  sudo apt update && sudo apt upgrade -y
  ```
- [ ] Install essential tools:
  ```bash
  sudo apt install -y git curl wget nano
  ```
- [ ] Configure firewall:
  ```bash
  sudo ufw allow OpenSSH
  sudo ufw allow 80/tcp
  sudo ufw allow 443/tcp
  sudo ufw enable
  ```

## 4. Project Deployment 🚀

### Clone and Deploy
- [ ] Clone the repository:
  ```bash
  cd ~
  git clone https://github.com/yourusername/attendance-system.git
  cd attendance-system
  ```
- [ ] Make deployment script executable:
  ```bash
  chmod +x scripts/deployment/deploy-hostinger.sh
  ```
- [ ] Run deployment script:
  ```bash
  ./scripts/deployment/deploy-hostinger.sh your-domain.com
  ```

## 5. SSL Certificate Setup 🔒

### Let's Encrypt SSL
- [ ] After deployment, install SSL certificate:
  ```bash
  sudo certbot certonly --standalone -d your-domain.com -d www.your-domain.com
  ```
- [ ] Update SSL paths in nginx configuration:
  - Edit `docker/nginx-hostinger.conf`
  - Update certificate paths to Let's Encrypt locations
- [ ] Restart nginx container:
  ```bash
  docker compose -f docker-compose.hostinger.yml restart nginx
  ```

## 6. Environment Configuration 📝

### Update Production Settings
- [ ] Edit backend environment file:
  ```bash
  nano backend/.env
  ```
- [ ] Update these critical settings:
  - [ ] `APP_URL` - Set to your domain
  - [ ] `DB_PASSWORD` - Use strong password
  - [ ] `MAIL_HOST` - Configure SMTP settings
  - [ ] `MAIL_USERNAME` - Your email username
  - [ ] `MAIL_PASSWORD` - Your email password
  - [ ] `MAIL_FROM_ADDRESS` - Sender email address

### Configure Face Recognition
- [ ] Edit face recognition environment:
  ```bash
  nano services/face-recognition-service/.env
  ```
- [ ] Verify database connection string matches backend

## 7. Database Setup 🗄️

### Initialize Database
- [ ] Run database migrations:
  ```bash
  docker compose -f docker-compose.hostinger.yml exec backend php artisan migrate
  ```
- [ ] Create admin user:
  ```bash
  docker compose -f docker-compose.hostinger.yml exec backend php artisan tinker
  ```
  Then in tinker:
  ```php
  $user = new App\Models\User;
  $user->name = 'Admin';
  $user->email = 'admin@yourdomain.com';
  $user->password = bcrypt('your-secure-password');
  $user->save();
  $user->assignRole('admin');
  exit
  ```

## 8. Storage Setup 📁

### Configure Storage
- [ ] Create storage symlink:
  ```bash
  docker compose -f docker-compose.hostinger.yml exec backend php artisan storage:link
  ```
- [ ] Set proper permissions:
  ```bash
  docker compose -f docker-compose.hostinger.yml exec backend chown -R www-data:www-data storage bootstrap/cache
  ```

## 9. Testing & Verification ✅

### Basic Functionality Tests
- [ ] Access your domain: `https://your-domain.com`
- [ ] Test login with admin credentials
- [ ] Check API health: `https://your-domain.com/api/health`
- [ ] Test face recognition: `https://your-domain.com/face-api/health`
- [ ] Create test employee
- [ ] Test attendance clock-in with face recognition
- [ ] Verify GPS location features work
- [ ] Generate a test report
- [ ] Check email notifications (if configured)

### Performance Checks
- [ ] Monitor resource usage: `docker stats`
- [ ] Check application logs:
  ```bash
  docker compose -f docker-compose.hostinger.yml logs -f
  ```
- [ ] Verify all containers are running:
  ```bash
  docker compose -f docker-compose.hostinger.yml ps
  ```

## 10. Backup Configuration 💾

### Set Up Automated Backups
- [ ] Verify backup script is created at `~/attendance-system/backup.sh`
- [ ] Test backup script manually:
  ```bash
  ./backup.sh
  ```
- [ ] Check if cron job is set:
  ```bash
  crontab -l
  ```
- [ ] Verify backups are stored in `~/backups`

## 11. Monitoring Setup 📊

### Configure Monitoring
- [ ] Set up uptime monitoring service (UptimeRobot, Pingdom, etc.)
- [ ] Configure health check URL: `https://your-domain.com/health`
- [ ] Set up email alerts for downtime
- [ ] Monitor server resources:
  ```bash
  htop  # Install with: sudo apt install htop
  ```

## 12. Security Hardening 🛡️

### Additional Security Steps
- [ ] Change default SSH port (optional):
  ```bash
  sudo nano /etc/ssh/sshd_config
  # Change Port 22 to Port 2222 (or another port)
  sudo systemctl restart sshd
  ```
- [ ] Install fail2ban:
  ```bash
  sudo apt install fail2ban
  sudo systemctl enable fail2ban
  ```
- [ ] Review and update application passwords
- [ ] Enable 2FA for admin accounts (if available)

## 13. Documentation 📚

### Create Documentation
- [ ] Document server access credentials securely
- [ ] Note down all configured services and ports
- [ ] Create runbook for common operations
- [ ] Document backup and restore procedures
- [ ] Save all environment configurations

## 14. Go Live Checklist ✨

### Final Checks Before Launch
- [ ] All tests passing
- [ ] SSL certificate working (padlock in browser)
- [ ] Emails sending correctly
- [ ] Backups running automatically
- [ ] Monitoring alerts configured
- [ ] Admin users created
- [ ] Employee data imported (if migrating)
- [ ] Company settings configured
- [ ] Work schedules set up
- [ ] Attendance rules configured

## 15. Post-Deployment Tasks 🎯

### After Going Live
- [ ] Monitor logs for first 24-48 hours
- [ ] Train users on the system
- [ ] Set up regular maintenance schedule
- [ ] Plan for updates and patches
- [ ] Monitor disk space usage
- [ ] Review backup integrity weekly

## Common Commands Reference 📋

```bash
# View logs
docker compose -f docker-compose.hostinger.yml logs -f

# Restart services
docker compose -f docker-compose.hostinger.yml restart

# Clear cache
docker compose -f docker-compose.hostinger.yml exec backend php artisan cache:clear

# Database backup
docker compose -f docker-compose.hostinger.yml exec postgres pg_dump -U attendance_user attendance_system > backup.sql

# Update application
git pull origin main
docker compose -f docker-compose.hostinger.yml build
docker compose -f docker-compose.hostinger.yml up -d
```

## Troubleshooting Tips 🔧

1. **If deployment script fails**: Check Docker installation and disk space
2. **If SSL fails**: Ensure domain is pointing to server and ports 80/443 are open
3. **If face recognition doesn't work**: Check Python service logs and dependencies
4. **If emails don't send**: Verify SMTP settings and firewall rules
5. **If site is slow**: Check server resources and enable caching

## Support Contacts 📞

- Hostinger Support: [Via Hostinger Panel]
- Project Issues: [Your GitHub Issues]
- Emergency Contact: [Your Phone/Email]

---

**Remember**: Take backups before any major changes and test in a staging environment if possible!