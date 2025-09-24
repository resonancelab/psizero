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

async function testHQEStatus() {
  console.log('🔍 Testing HQE Status endpoint...');
  try {
    const result = await makeRequest('GET', '/v1/hqe/status', null, 10000);
    console.log(`✅ HQE Status - Status: ${result.status}, Duration: ${result.duration}ms`);
    if (result.data?.data) {
      console.log('   Status Data:', JSON.stringify(result.data.data, null, 2));
    }
    return result;
  } catch (error) {
    console.log(`❌ HQE Status - Error: ${error.type}, Duration: ${error.duration}ms`);
    console.log('   Error details:', error.error);
    return null;
  }
}

async function testHQEPrimes() {
  console.log('\n🔍 Testing HQE Primes endpoint...');
  try {
    const result = await makeRequest('GET', '/v1/hqe/primes', null, 10000);
    console.log(`✅ HQE Primes - Status: ${result.status}, Duration: ${result.duration}ms`);
    if (result.data?.data) {
      console.log('   Primes Data:', JSON.stringify(result.data.data, null, 2));
    }
    return result;
  } catch (error) {
    console.log(`❌ HQE Primes - Error: ${error.type}, Duration: ${error.duration}ms`);
    console.log('   Error details:', error.error);
    return null;
  }
}

async function testHQESessionCreation() {
  console.log('\n🔍 Testing HQE Session Creation...');
  try {
    const sessionData = {
      primes: [2, 3],
      dt: 0.1,
      steps: 10,
      lambda: 0.1
    };
    
    const result = await makeRequest('POST', '/v1/hqe/sessions', sessionData, 15000);
    console.log(`✅ HQE Session Creation - Status: ${result.status}, Duration: ${result.duration}ms`);
    if (result.data?.data) {
      console.log('   Session Data:', JSON.stringify(result.data.data, null, 2));
      return result.data.data.id;
    }
    return null;
  } catch (error) {
    console.log(`❌ HQE Session Creation - Error: ${error.type}, Duration: ${error.duration}ms`);
    console.log('   Error details:', error.error);
    return null;
  }
}

async function testMinimalHQESimulation() {
  console.log('\n🔍 Testing Minimal HQE Simulation (2 primes, 2 steps)...');
  try {
    const simData = {
      simulation_type: 'holographic_reconstruction',
      primes: [2, 3],
      steps: 2,
      lambda: 0.1,
      config: {
        slice_count: 2,
        boundary_state_count: 5,
        max_iterations: 2,
        timeout_seconds: 30
      }
    };
    
    const result = await makeRequest('POST', '/v1/hqe/simulate', simData, 35000);
    console.log(`✅ Minimal HQE Simulation - Status: ${result.status}, Duration: ${result.duration}ms`);
    if (result.data?.data) {
      console.log('   Result Keys:', Object.keys(result.data.data));
      if (result.data.data.result) {
        console.log('   Simulation Result:', {
          converged: result.data.data.result.converged,
          compute_time: result.data.data.result.compute_time,
          entanglement_entropy: result.data.data.result.entanglement_entropy
        });
      }
    }
    return result;
  } catch (error) {
    console.log(`❌ Minimal HQE Simulation - Error: ${error.type}, Duration: ${error.duration}ms`);
    console.log('   Error details:', error.error);
    return null;
  }
}

async function testStandardHQESimulation() {
  console.log('\n🔍 Testing Standard HQE Simulation (4 primes, 4 steps)...');
  try {
    const simData = {
      simulation_type: 'holographic_reconstruction',
      primes: [2, 3, 5, 7],
      steps: 4,
      lambda: 0.02,
      config: {
        timeout_seconds: 60
      }
    };
    
    const result = await makeRequest('POST', '/v1/hqe/simulate', simData, 65000);
    console.log(`✅ Standard HQE Simulation - Status: ${result.status}, Duration: ${result.duration}ms`);
    if (result.data?.data) {
      console.log('   Result Keys:', Object.keys(result.data.data));
      if (result.data.data.result) {
        console.log('   Simulation Result:', {
          converged: result.data.data.result.converged,
          compute_time: result.data.data.result.compute_time,
          entanglement_entropy: result.data.data.result.entanglement_entropy
        });
      }
    }
    return result;
  } catch (error) {
    console.log(`❌ Standard HQE Simulation - Error: ${error.type}, Duration: ${error.duration}ms`);
    console.log('   Error details:', error.error);
    return null;
  }
}

async function testHQEWithDifferentSimulationTypes() {
  console.log('\n🔍 Testing Different HQE Simulation Types...');
  
  const types = [
    'holographic_reconstruction',
    'boundary_evolution', 
    'bulk_geometry',
    'entanglement_growth'
  ];
  
  for (const simType of types) {
    console.log(`\n  Testing simulation_type: ${simType}`);
    try {
      const simData = {
        simulation_type: simType,
        primes: [2, 3],
        steps: 2,
        lambda: 0.1,
        config: {
          slice_count: 2,
          boundary_state_count: 5,
          max_iterations: 2,
          timeout_seconds: 20
        }
      };
      
      const result = await makeRequest('POST', '/v1/hqe/simulate', simData, 25000);
      console.log(`  ✅ ${simType} - Status: ${result.status}, Duration: ${result.duration}ms`);
      
      if (result.status >= 400 && result.data) {
        console.log(`     Error: ${JSON.stringify(result.data, null, 2)}`);
      }
    } catch (error) {
      console.log(`  ❌ ${simType} - Error: ${error.type}, Duration: ${error.duration}ms`);
      if (error.error) {
        console.log(`     Details: ${error.error}`);
      }
    }
  }
}

async function runComprehensiveHQETests() {
  console.log('🧪 Starting Comprehensive HQE Testing...\n');
  
  // Test basic endpoints first
  await testHQEStatus();
  await testHQEPrimes();
  
  // Test session management
  const sessionId = await testHQESessionCreation();
  
  // Test simulations with increasing complexity
  await testMinimalHQESimulation();
  await testStandardHQESimulation();
  
  // Test different simulation types
  await testHQEWithDifferentSimulationTypes();
  
  // If we got a session, test session operations
  if (sessionId) {
    console.log(`\n🔍 Testing Session Operations with ID: ${sessionId}`);
    
    try {
      // Get session status
      const sessionResult = await makeRequest('GET', `/v1/hqe/sessions/${sessionId}`, null, 10000);
      console.log(`✅ Get Session - Status: ${sessionResult.status}, Duration: ${sessionResult.duration}ms`);
      
      // Try to step the session
      const stepResult = await makeRequest('POST', `/v1/hqe/sessions/${sessionId}/step`, { steps: 5 }, 15000);
      console.log(`✅ Step Session - Status: ${stepResult.status}, Duration: ${stepResult.duration}ms`);
      
      // Close the session
      const closeResult = await makeRequest('DELETE', `/v1/hqe/sessions/${sessionId}`, null, 10000);
      console.log(`✅ Close Session - Status: ${closeResult.status}, Duration: ${closeResult.duration}ms`);
      
    } catch (error) {
      console.log(`❌ Session Operations - Error: ${error.type}, Duration: ${error.duration}ms`);
    }
  }
  
  console.log('\n🏁 HQE Testing completed.');
}

// Run the tests
runComprehensiveHQETests().catch(console.error);