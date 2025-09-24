#!/usr/bin/env node

const http = require('http');

const API_BASE = 'http://localhost:8080';
const API_KEY = 'dev-key';
const SPACE_ID = 'space_7d22a0cd-7f2b-4940-a1c7-182ee1636277'; // The space ID you mentioned

// Make HTTP request to RNET backend
async function makeRequest(method, path, data = null) {
  return new Promise((resolve, reject) => {
    const url = new URL(API_BASE + path);
    const options = {
      hostname: url.hostname,
      port: url.port || 80,
      path: url.pathname + url.search,
      method: method,
      timeout: 10000,
      headers: {
        'X-Api-Key': API_KEY,
        'Content-Type': 'application/json'
      }
    };

    const req = http.request(options, (res) => {
      let responseBody = '';
      
      res.on('data', (chunk) => {
        responseBody += chunk;
      });
      
      res.on('end', () => {
        try {
          const response = JSON.parse(responseBody);
          resolve(response);
        } catch (parseError) {
          resolve(responseBody);
        }
      });
    });

    req.on('error', (error) => {
      reject(error);
    });

    req.on('timeout', () => {
      req.destroy();
      reject(new Error('Request timeout'));
    });

    if (data) {
      req.write(JSON.stringify(data));
    }
    
    req.end();
  });
}

async function debugSnapshot() {
  try {
    console.log('🔍 Getting space snapshot...');
    const snapshot = await makeRequest('GET', `/v1/spaces/${SPACE_ID}/snapshot`);
    
    console.log('📊 Full Snapshot Structure:');
    console.log(JSON.stringify(snapshot, null, 2));
    
    console.log('\n🔍 Analyzing User Discovery Data:');
    if (snapshot.state && snapshot.state.phases) {
      console.log(`Found ${snapshot.state.phases.length} phases:`);
      snapshot.state.phases.forEach((phase, index) => {
        console.log(`\nPhase ${index}:`);
        console.log(`  ID: ${phase.id}`);
        console.log(`  Type: ${phase.type}`);
        if (phase.metadata) {
          console.log(`  Metadata:`, JSON.stringify(phase.metadata, null, 4));
          if (phase.metadata.userInfo) {
            console.log(`  ✅ Found user info: ${JSON.stringify(phase.metadata.userInfo)}`);
          }
        } else {
          console.log(`  ❌ No metadata found`);
        }
      });
    } else {
      console.log('❌ No state.phases found in snapshot');
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

debugSnapshot();