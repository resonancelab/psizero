#!/usr/bin/env node

const http = require('http');

const API_BASE = 'http://localhost:8080';
const API_KEY = 'dev-key';

async function testEndpoint(method, path, data = null, timeout = 5000) {
  return new Promise((resolve, reject) => {
    const url = new URL(API_BASE + path);
    const options = {
      hostname: url.hostname,
      port: url.port || 80,
      path: url.pathname + url.search,
      method: method,
      timeout: timeout,
      headers: {
        'X-Api-Key': API_KEY,
        'Content-Type': 'application/json'
      }
    };

    console.log(`Testing ${method} ${path}...`);
    
    const req = http.request(options, (res) => {
      let body = '';
      res.on('data', (chunk) => body += chunk);
      res.on('end', () => {
        try {
          const response = JSON.parse(body);
          if (res.statusCode >= 200 && res.statusCode < 300) {
            console.log(`✅ ${method} ${path} - Status: ${res.statusCode}`);
            resolve(response);
          } else {
            console.log(`❌ ${method} ${path} - Status: ${res.statusCode}, Error: ${response.detail || response.message || body}`);
            reject(new Error(`HTTP ${res.statusCode}: ${response.detail || response.message || body}`));
          }
        } catch (error) {
          if (res.statusCode >= 200 && res.statusCode < 300) {
            console.log(`✅ ${method} ${path} - Status: ${res.statusCode} (non-JSON response)`);
            resolve({ success: true, body });
          } else {
            console.log(`❌ ${method} ${path} - Status: ${res.statusCode}, Parse Error: ${error.message}`);
            reject(new Error(`HTTP ${res.statusCode}: ${body}`));
          }
        }
      });
    });

    req.on('error', (error) => {
      console.log(`❌ ${method} ${path} - Connection Error: ${error.message}`);
      reject(error);
    });
    
    req.on('timeout', () => {
      req.destroy();
      console.log(`❌ ${method} ${path} - Timeout after ${timeout}ms`);
      reject(new Error(`Request timeout after ${timeout}ms`));
    });
    
    if (data) {
      req.write(JSON.stringify(data));
    }
    
    req.end();
  });
}

async function runTests() {
  console.log('🔍 Testing RNET API endpoints...\n');

  const tests = [
    // Basic connectivity
    ['GET', '/v1/engine/stats'],
    
    // HQE endpoints
    ['POST', '/v1/hqe/simulate', {
      simulation_type: 'holographic_reconstruction',
      primes: [2, 3, 5, 7],
      steps: 4,
      lambda: 0.02
    }],
    
    // QSEM endpoints
    ['POST', '/v1/qsem/encode', {
      concepts: ['test', 'quantum'],
      basis: 'prime'
    }],
    
    // QCR endpoints
    ['POST', '/v1/qcr/sessions', {
      modes: ['analytical', 'creative'],
      maxIterations: 5
    }],
    
    // I-Ching endpoints
    ['POST', '/v1/iching/evolve', {
      question: 'Test question',
      steps: 3
    }],
    
    // NLC endpoints
    ['POST', '/v1/nlc/sessions', {
      primes: [2, 3, 5],
      participants: ['test_a', 'test_b'],
      protocol: 'teleportation'
    }],
    
    // SRS endpoints
    ['POST', '/v1/srs/solve', {
      problem: 'subsetsum',
      spec: {
        numbers: [1, 2, 3, 4],
        target: 5
      }
    }]
  ];

  for (const [method, path, data] of tests) {
    try {
      await testEndpoint(method, path, data);
      await new Promise(resolve => setTimeout(resolve, 100)); // Small delay between tests
    } catch (error) {
      // Error already logged in testEndpoint
    }
    console.log(''); // Empty line for readability
  }
  
  console.log('🏁 Endpoint testing completed.');
}

runTests().catch(console.error);