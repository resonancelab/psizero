#!/usr/bin/env node

const http = require('http');

const BASE_URL = 'http://localhost:8080';
const API_KEY = 'dev-key';

async function makeRequest(method, endpoint, data = null, timeout = 30000) {
  const url = new URL(BASE_URL + endpoint);
  
  const options = {
    hostname: url.hostname,
    port: url.port || 80,
    path: url.pathname + url.search,
    method,
    timeout,
    headers: {
      'Content-Type': 'application/json',
      'X-Api-Key': API_KEY
    }
  };

  return new Promise((resolve, reject) => {
    const startTime = Date.now();
    
    const req = http.request(options, (res) => {
      let responseData = '';
      
      res.on('data', (chunk) => {
        responseData += chunk;
      });
      
      res.on('end', () => {
        const endTime = Date.now();
        const duration = endTime - startTime;
        
        try {
          const parsed = JSON.parse(responseData);
          resolve({
            status: res.statusCode,
            headers: res.headers,
            data: parsed,
            duration,
            raw: responseData
          });
        } catch (e) {
          resolve({
            status: res.statusCode,
            headers: res.headers,
            data: responseData,
            duration,
            raw: responseData,
            parseError: e.message
          });
        }
      });
    });

    req.on('error', (error) => {
      const endTime = Date.now();
      const duration = endTime - startTime;
      reject({ error, duration, type: 'connection_error' });
    });

    req.on('timeout', () => {
      const endTime = Date.now();
      const duration = endTime - startTime;
      req.destroy();
      reject({ error: 'Request timeout', duration, type: 'timeout' });
    });

    req.setTimeout(timeout);

    if (data) {
      req.write(JSON.stringify(data));
    }
    
    req.end();
  });
}

async function testHQEStepByStep() {
  console.log('🔍 Testing HQE step-by-step to isolate the hang...\n');
  
  // Test 1: Minimal configuration
  console.log('1. Testing minimal HQE configuration...');
  try {
    const minimalConfig = {
      simulation_type: 'holographic_reconstruction',
      primes: [2],
      steps: 1,
      lambda: 0.1,
      config: {
        slice_count: 1,
        boundary_state_count: 1,
        max_iterations: 1,
        timeout_seconds: 10
      }
    };
    
    const result1 = await makeRequest('POST', '/v1/hqe/simulate', minimalConfig, 15000);
    console.log(`✅ Minimal config - Status: ${result1.status}, Duration: ${result1.duration}ms`);
  } catch (error) {
    console.log(`❌ Minimal config - Error: ${error.type}, Duration: ${error.duration}ms`);
  }
  
  // Test 2: Single slice, multiple states
  console.log('\n2. Testing single slice, multiple boundary states...');
  try {
    const singleSliceConfig = {
      simulation_type: 'holographic_reconstruction',
      primes: [2, 3],
      steps: 1,
      lambda: 0.1,
      config: {
        slice_count: 1,
        boundary_state_count: 10,
        max_iterations: 1,
        timeout_seconds: 10
      }
    };
    
    const result2 = await makeRequest('POST', '/v1/hqe/simulate', singleSliceConfig, 15000);
    console.log(`✅ Single slice - Status: ${result2.status}, Duration: ${result2.duration}ms`);
  } catch (error) {
    console.log(`❌ Single slice - Error: ${error.type}, Duration: ${error.duration}ms`);
  }
  
  // Test 3: Multiple slices, minimal states
  console.log('\n3. Testing multiple slices, minimal boundary states...');
  try {
    const multiSliceConfig = {
      simulation_type: 'holographic_reconstruction',
      primes: [2, 3],
      steps: 1,
      lambda: 0.1,
      config: {
        slice_count: 5,
        boundary_state_count: 1,
        max_iterations: 1,
        timeout_seconds: 10
      }
    };
    
    const result3 = await makeRequest('POST', '/v1/hqe/simulate', multiSliceConfig, 15000);
    console.log(`✅ Multi slice - Status: ${result3.status}, Duration: ${result3.duration}ms`);
  } catch (error) {
    console.log(`❌ Multi slice - Error: ${error.type}, Duration: ${error.duration}ms`);
  }
  
  // Test 4: Test HQE status endpoint
  console.log('\n4. Testing HQE status endpoint...');
  try {
    const statusResult = await makeRequest('GET', '/v1/hqe/status', null, 5000);
    console.log(`✅ HQE Status - Status: ${statusResult.status}, Duration: ${statusResult.duration}ms`);
    console.log('   Status data:', statusResult.data);
  } catch (error) {
    console.log(`❌ HQE Status - Error: ${error.type}, Duration: ${error.duration}ms`);
  }
  
  // Test 5: Test HQE primes endpoint
  console.log('\n5. Testing HQE primes endpoint...');
  try {
    const primesResult = await makeRequest('GET', '/v1/hqe/primes', null, 5000);
    console.log(`✅ HQE Primes - Status: ${primesResult.status}, Duration: ${primesResult.duration}ms`);
  } catch (error) {
    console.log(`❌ HQE Primes - Error: ${error.type}, Duration: ${error.duration}ms`);
  }
  
  // Test 6: Different simulation types
  console.log('\n6. Testing different simulation types...');
  const simTypes = ['holographic_reconstruction', 'boundary_evolution', 'bulk_geometry'];
  
  for (const simType of simTypes) {
    console.log(`   Testing ${simType}...`);
    try {
      const typeConfig = {
        simulation_type: simType,
        primes: [2],
        steps: 1,
        lambda: 0.1,
        config: {
          slice_count: 1,
          boundary_state_count: 1,
          max_iterations: 1,
          timeout_seconds: 5
        }
      };
      
      const result = await makeRequest('POST', '/v1/hqe/simulate', typeConfig, 10000);
      console.log(`   ✅ ${simType} - Status: ${result.status}, Duration: ${result.duration}ms`);
    } catch (error) {
      console.log(`   ❌ ${simType} - Error: ${error.type}, Duration: ${error.duration}ms`);
    }
  }
  
  console.log('\n🏁 HQE debug testing completed.');
}

// Run the tests
testHQEStepByStep().catch(console.error);