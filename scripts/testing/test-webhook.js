#!/usr/bin/env node

/**
 * Webhook Testing Script
 * Tests the webhook server functionality
 */

const crypto = require('crypto');
const axios = require('axios');

const WEBHOOK_URL = process.env.WEBHOOK_URL || 'http://localhost:3000/webhook';
const SECRET = process.env.WEBHOOK_SECRET || 'your-webhook-secret-change-this';

// Create GitHub webhook signature
function createSignature(payload, secret) {
    return 'sha256=' + crypto.createHmac('sha256', secret).update(payload).digest('hex');
}

// Test payload (simulating GitHub push event)
const testPayload = {
    ref: 'refs/heads/main',
    repository: {
        full_name: 'test/attendance-system',
        clone_url: 'https://github.com/test/attendance-system.git'
    },
    head_commit: {
        id: 'abc123def456',
        message: 'Test deployment commit',
        author: {
            name: 'Test User',
            email: 'test@example.com'
        }
    },
    pusher: {
        name: 'test-user'
    }
};

async function testWebhook() {
    try {
        console.log('🧪 Testing webhook server...');
        
        // Test health check
        console.log('\n1. Testing health check...');
        const healthResponse = await axios.get(WEBHOOK_URL.replace('/webhook', '/health'));
        console.log('✅ Health check:', healthResponse.data);
        
        // Test ping event
        console.log('\n2. Testing ping event...');
        const pingPayload = JSON.stringify({ zen: 'Testing is good.' });
        const pingSignature = createSignature(pingPayload, SECRET);
        
        const pingResponse = await axios.post(WEBHOOK_URL, pingPayload, {
            headers: {
                'Content-Type': 'application/json',
                'X-GitHub-Event': 'ping',
                'X-Hub-Signature-256': pingSignature
            }
        });
        console.log('✅ Ping event:', pingResponse.data);
        
        // Test push event
        console.log('\n3. Testing push event...');
        const pushPayload = JSON.stringify(testPayload);
        const pushSignature = createSignature(pushPayload, SECRET);
        
        const pushResponse = await axios.post(WEBHOOK_URL, pushPayload, {
            headers: {
                'Content-Type': 'application/json',
                'X-GitHub-Event': 'push',
                'X-Hub-Signature-256': pushSignature
            }
        });
        console.log('✅ Push event:', pushResponse.data);
        
        // Test invalid signature
        console.log('\n4. Testing invalid signature...');
        try {
            await axios.post(WEBHOOK_URL, pushPayload, {
                headers: {
                    'Content-Type': 'application/json',
                    'X-GitHub-Event': 'push',
                    'X-Hub-Signature-256': 'sha256=invalid'
                }
            });
        } catch (error) {
            if (error.response.status === 401) {
                console.log('✅ Invalid signature rejected correctly');
            } else {
                throw error;
            }
        }
        
        console.log('\n🎉 All webhook tests passed!');
        
    } catch (error) {
        console.error('❌ Webhook test failed:', error.message);
        if (error.response) {
            console.error('Response status:', error.response.status);
            console.error('Response data:', error.response.data);
        }
        process.exit(1);
    }
}

// Test manual deployment endpoint
async function testManualDeploy() {
    try {
        console.log('\n🚀 Testing manual deployment...');
        
        const deployResponse = await axios.post(WEBHOOK_URL.replace('/webhook', '/deploy'), 
            { branch: 'main' },
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${SECRET}`
                }
            }
        );
        console.log('✅ Manual deployment:', deployResponse.data);
        
    } catch (error) {
        if (error.response && error.response.status === 401) {
            console.log('✅ Manual deployment requires authentication');
        } else {
            console.error('❌ Manual deployment test failed:', error.message);
        }
    }
}

// Run tests
async function runTests() {
    console.log('🔧 Webhook Test Suite');
    console.log('====================');
    console.log('Webhook URL:', WEBHOOK_URL);
    console.log('Secret configured:', SECRET ? 'Yes' : 'No');
    
    await testWebhook();
    await testManualDeploy();
    
    console.log('\n✨ Testing completed!');
}

// Run if called directly
if (require.main === module) {
    runTests().catch(console.error);
}

module.exports = { testWebhook, testManualDeploy, createSignature };