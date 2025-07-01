# CI/CD Automation Setup Guide

## Overview
This guide sets up automated deployment from your Git repository to VPS using GitHub Actions and webhooks.

## Architecture
```
GitHub Repository → GitHub Actions → VPS Webhook Server → Deployment Script → Application
```

## Quick Setup

### 1. Run Automated Setup
```bash
# Clone repository to VPS
git clone <your-repo-url> /var/www/attendance-system
cd /var/www/attendance-system

# Run setup script
chmod +x setup-cicd.sh
./setup-cicd.sh your-domain.com https://github.com/username/attendance-system.git
```

### 2. Configure GitHub Repository

#### A. Add SSH Key
1. Copy the SSH public key displayed by the setup script
2. Go to GitHub Repository → Settings → Deploy keys → Add deploy key
3. Paste the key and check "Allow write access"

#### B. Add Webhook
1. Go to Repository → Settings → Webhooks → Add webhook
2. Configure:
   - **Payload URL**: `http://your-domain.com/webhook`
   - **Content type**: `application/json`
   - **Secret**: Copy from setup script output
   - **Events**: Select "Just the push event"

#### C. Add Actions Secrets
Go to Repository → Settings → Secrets and variables → Actions

Add these secrets:
- `VPS_HOST`: Your VPS IP address
- `VPS_USERNAME`: Your VPS username
- `VPS_SSH_KEY`: Contents of `~/.ssh/id_rsa` from VPS
- `VPS_PORT`: SSH port (usually 22)

## Manual Setup (Alternative)

### 1. VPS Prerequisites
```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install required packages
sudo apt install -y git nginx nodejs npm python3 python3-pip curl

# Install PM2 for process management
sudo npm install -g pm2

# Install Docker (if not already installed)
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
sudo usermod -aG docker $USER
```

### 2. SSH Key Setup
```bash
# Generate SSH key
ssh-keygen -t rsa -b 4096 -C "deployment@your-domain.com"

# Display public key
cat ~/.ssh/id_rsa.pub
```

### 3. Clone Repository
```bash
# Create project directory
sudo mkdir -p /var/www/attendance-system
sudo chown -R $USER:$USER /var/www/attendance-system

# Clone repository
git clone git@github.com:username/attendance-system.git /var/www/attendance-system
cd /var/www/attendance-system
```

### 4. Install Webhook Server
```bash
# Install dependencies
npm install

# Create environment file
cat > .env.webhook << EOF
WEBHOOK_PORT=3000
WEBHOOK_SECRET=$(openssl rand -base64 32)
PROJECT_PATH=/var/www/attendance-system
NODE_ENV=production
EOF

# Start webhook server
pm2 start webhook-server.js --name attendance-webhook
pm2 save
pm2 startup
```

### 5. Configure Nginx
```bash
# Create Nginx configuration
sudo nano /etc/nginx/sites-available/attendance-system
```

Add configuration:
```nginx
server {
    listen 80;
    server_name your-domain.com;
    
    location /webhook {
        proxy_pass http://localhost:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }
    
    location /health {
        proxy_pass http://localhost:3000;
        proxy_set_header Host $host;
    }
    
    location / {
        proxy_pass http://localhost:8000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }
}
```

Enable site:
```bash
sudo ln -s /etc/nginx/sites-available/attendance-system /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

## How It Works

### 1. GitHub Actions Pipeline
- **Trigger**: Push to main/master branch
- **Steps**:
  1. Run tests (frontend & backend)
  2. Build production assets
  3. Deploy to VPS via SSH
  4. Run health checks
  5. Send notifications

### 2. Webhook Server
- **Listens**: for GitHub push events
- **Verifies**: webhook signature for security
- **Executes**: deployment script automatically
- **Logs**: all activities for debugging

### 3. Deployment Process
1. Backup current version
2. Pull latest code from Git
3. Install/update dependencies
4. Build frontend assets
5. Run database migrations
6. Restart Docker containers
7. Perform health checks
8. Rollback if deployment fails

## Testing

### Test Webhook Server
```bash
# Test locally
node test-webhook.js

# Test health endpoint
curl http://your-domain.com/health

# Test manual deployment
curl -X POST \
  -H "Authorization: Bearer YOUR_WEBHOOK_SECRET" \
  -H "Content-Type: application/json" \
  -d '{"branch": "main"}' \
  http://your-domain.com/deploy
```

### Test GitHub Actions
1. Make a commit to main branch
2. Check Actions tab in GitHub repository
3. Monitor VPS logs: `pm2 logs attendance-webhook`

## Monitoring & Maintenance

### View Logs
```bash
# Webhook server logs
pm2 logs attendance-webhook

# Nginx logs
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log

# Application logs
tail -f /var/www/attendance-system/logs/webhook.log
```

### Restart Services
```bash
# Restart webhook server
pm2 restart attendance-webhook

# Restart Nginx
sudo systemctl restart nginx

# Restart application containers
cd /var/www/attendance-system
docker-compose -f docker-compose.prod.yml restart
```

### Update Webhook Server
```bash
cd /var/www/attendance-system
git pull origin main
npm install
pm2 restart attendance-webhook
```

## Security Best Practices

### 1. Firewall Configuration
```bash
sudo ufw allow ssh
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw enable
```

### 2. SSL/HTTPS Setup
```bash
# Install Let's Encrypt
sudo apt install certbot python3-certbot-nginx

# Get SSL certificate
sudo certbot --nginx -d your-domain.com

# Auto-renewal
sudo crontab -e
# Add: 0 12 * * * /usr/bin/certbot renew --quiet
```

### 3. Environment Security
- Use strong webhook secrets
- Rotate SSH keys regularly
- Keep system packages updated
- Monitor access logs

## Troubleshooting

### Common Issues

#### 1. Webhook Not Triggering
```bash
# Check webhook server status
pm2 status

# Check logs
pm2 logs attendance-webhook

# Test webhook manually
curl -X POST http://your-domain.com/webhook
```

#### 2. Deployment Fails
```bash
# Check deployment logs
tail -f /var/www/attendance-system/logs/webhook.log

# Run deployment manually
cd /var/www/attendance-system
bash deploy-auto.sh
```

#### 3. Permission Issues
```bash
# Fix ownership
sudo chown -R $USER:$USER /var/www/attendance-system

# Fix permissions
chmod +x /var/www/attendance-system/deploy-auto.sh
```

#### 4. GitHub Actions Fails
1. Check Actions tab in repository
2. Verify secrets are correctly set
3. Check SSH connectivity: `ssh user@vps-ip`

### Debug Commands
```bash
# Test SSH connection
ssh -T git@github.com

# Check webhook signature
node -e "console.log(require('crypto').createHmac('sha256', 'secret').update('payload').digest('hex'))"

# Check nginx configuration
sudo nginx -t

# Check PM2 processes
pm2 list
pm2 monit
```

## Advanced Configuration

### Custom Deployment Script
Edit `/var/www/attendance-system/deploy-auto.sh`:
```bash
#!/bin/bash
# Add custom deployment steps here
# Example: database seeds, cache clearing, etc.
```

### Slack Notifications
Add to webhook server:
```javascript
// Send Slack notification
const slack = require('slack-webhook');
slack.send({
    text: 'Deployment completed successfully!',
    channel: '#deployments'
});
```

### Multi-Environment Setup
```bash
# Create staging webhook
cp webhook-server.js webhook-staging.js
# Modify ports and paths
pm2 start webhook-staging.js --name attendance-webhook-staging
```

## Support

For issues and questions:
1. Check webhook server logs
2. Review GitHub Actions logs
3. Test components individually
4. Check system resources and permissions