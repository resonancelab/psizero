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

async function debugSpaceStats() {
  try {
    console.log('🔍 Getting space stats...');
    const stats = await makeRequest('GET', `/v1/spaces/${SPACE_ID}/stats`);
    
    console.log('📊 Full Space Stats Structure:');
    console.log(JSON.stringify(stats, null, 2));
    
    console.log('\n🔍 Analyzing Session Data:');
    if (stats.current_telemetry && stats.current_telemetry.sessions) {
      console.log(`Found ${stats.current_telemetry.sessions.length} sessions:`);
      stats.current_telemetry.sessions.forEach((session, index) => {
        console.log(`\nSession ${index}:`);
        console.log(`  ID: ${session.id}`);
        console.log(`  Member ID: ${session.memberId || 'N/A'}`);
        console.log(`  Display Name: ${session.displayName || 'N/A'}`);
        console.log(`  All fields:`, JSON.stringify(session, null, 4));
      });
    } else {
      console.log('❌ No sessions found in current_telemetry');
      
      // Check if telemetry exists at all
      if (stats.current_telemetry) {
        console.log('Current telemetry structure:', Object.keys(stats.current_telemetry));
      } else {
        console.log('❌ No current_telemetry at all');
      }
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

debugSpaceStats();