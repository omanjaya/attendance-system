#!/usr/bin/env node

/**
 * GitHub Webhook Server for Automated Deployment
 * Listens for push events and triggers deployment script
 */

const express = require('express');
const crypto = require('crypto');
const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.WEBHOOK_PORT || 3000;
const SECRET = process.env.WEBHOOK_SECRET || 'your-webhook-secret-change-this';
const PROJECT_PATH = process.env.PROJECT_PATH || '/var/www/attendance-system';
const LOG_FILE = path.join(PROJECT_PATH, 'logs', 'webhook.log');

// Middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.raw({ type: 'application/json' }));

// Logging function
function log(message, level = 'INFO') {
    const timestamp = new Date().toISOString();
    const logMessage = `[${timestamp}] [${level}] ${message}\n`;
    
    console.log(logMessage.trim());
    
    // Write to log file
    fs.appendFileSync(LOG_FILE, logMessage, (err) => {
        if (err) console.error('Failed to write to log file:', err);
    });
}

// Verify GitHub webhook signature
function verifySignature(payload, signature) {
    if (!signature) {
        return false;
    }

    const sigHashAlg = 'sha256';
    const sigHashAndHash = signature.split('=');

    if (sigHashAndHash.length !== 2) {
        return false;
    }

    const sigHash = sigHashAndHash[1];
    const expectedHash = crypto.createHmac(sigHashAlg, SECRET)
                              .update(payload, 'utf8')
                              .digest('hex');

    return crypto.timingSafeEqual(Buffer.from(sigHash, 'hex'), Buffer.from(expectedHash, 'hex'));
}

// Execute deployment script
function deployApplication(branch = 'main') {
    return new Promise((resolve, reject) => {
        const deployScript = path.join(PROJECT_PATH, 'deploy.sh');
        const command = `cd ${PROJECT_PATH} && bash ${deployScript} production`;

        log(`Starting deployment from branch: ${branch}`);
        
        exec(command, { timeout: 600000 }, (error, stdout, stderr) => {
            if (error) {
                log(`Deployment failed: ${error.message}`, 'ERROR');
                log(`stderr: ${stderr}`, 'ERROR');
                reject(error);
                return;
            }

            log(`Deployment successful: ${stdout}`);
            if (stderr) {
                log(`stderr: ${stderr}`, 'WARN');
            }
            resolve(stdout);
        });
    });
}

// Health check endpoint
app.get('/health', (req, res) => {
    res.status(200).json({
        status: 'healthy',
        timestamp: new Date().toISOString(),
        uptime: process.uptime()
    });
});

// Webhook endpoint
app.post('/webhook', async (req, res) => {
    try {
        const signature = req.headers['x-hub-signature-256'];
        const payload = JSON.stringify(req.body);
        
        // Verify signature
        if (!verifySignature(payload, signature)) {
            log('Invalid webhook signature', 'WARN');
            return res.status(401).json({ error: 'Unauthorized' });
        }

        const event = req.headers['x-github-event'];
        const body = req.body;

        log(`Received ${event} event from ${body.repository?.full_name}`);

        // Only process push events to main/master branch
        if (event === 'push') {
            const branch = body.ref?.replace('refs/heads/', '');
            
            if (branch === 'main' || branch === 'master') {
                log(`Processing push to ${branch} branch`);
                
                // Run deployment in background
                deployApplication(branch)
                    .then((output) => {
                        log('Deployment completed successfully');
                    })
                    .catch((error) => {
                        log(`Deployment failed: ${error.message}`, 'ERROR');
                    });

                res.status(200).json({ 
                    message: 'Deployment started',
                    branch: branch,
                    commit: body.head_commit?.id?.substring(0, 7)
                });
            } else {
                log(`Ignoring push to ${branch} branch`);
                res.status(200).json({ 
                    message: `Ignored push to ${branch} branch`
                });
            }
        } else if (event === 'ping') {
            log('Webhook ping received');
            res.status(200).json({ message: 'Webhook is working!' });
        } else {
            log(`Ignored ${event} event`);
            res.status(200).json({ message: `Event ${event} ignored` });
        }

    } catch (error) {
        log(`Webhook error: ${error.message}`, 'ERROR');
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Manual deployment endpoint (with basic auth)
app.post('/deploy', async (req, res) => {
    const authHeader = req.headers.authorization;
    const expectedAuth = `Bearer ${SECRET}`;

    if (!authHeader || authHeader !== expectedAuth) {
        return res.status(401).json({ error: 'Unauthorized' });
    }

    try {
        const branch = req.body.branch || 'main';
        log(`Manual deployment triggered for branch: ${branch}`);
        
        const output = await deployApplication(branch);
        res.status(200).json({ 
            message: 'Deployment completed',
            output: output.substring(0, 1000) // Limit output length
        });
    } catch (error) {
        log(`Manual deployment failed: ${error.message}`, 'ERROR');
        res.status(500).json({ 
            error: 'Deployment failed',
            message: error.message
        });
    }
});

// Error handler
app.use((error, req, res, next) => {
    log(`Unhandled error: ${error.message}`, 'ERROR');
    res.status(500).json({ error: 'Internal server error' });
});

// Create logs directory if it doesn't exist
const logsDir = path.dirname(LOG_FILE);
if (!fs.existsSync(logsDir)) {
    fs.mkdirSync(logsDir, { recursive: true });
}

// Start server
app.listen(PORT, '0.0.0.0', () => {
    log(`Webhook server started on port ${PORT}`);
    log(`Project path: ${PROJECT_PATH}`);
    log(`Log file: ${LOG_FILE}`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
    log('Received SIGTERM, shutting down gracefully');
    process.exit(0);
});

process.on('SIGINT', () => {
    log('Received SIGINT, shutting down gracefully');
    process.exit(0);
});

module.exports = app;