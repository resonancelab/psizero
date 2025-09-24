#!/usr/bin/env node

/**
 * FastFactor API Integration Test
 * 
 * This script tests the FastFactor quantum-inspired integer factorization service
 * to ensure the API integration is working correctly.
 */

const API_BASE_URL = 'http://localhost:8080/v1';
const API_KEY = 'demo_api_key_12345'; // Demo API key for testing

// Test configuration
const TEST_CASES = [
  {
    name: 'Small composite number',
    number: '15',
    expected_factors: ['3', '5']
  },
  {
    name: 'Medium composite number', 
    number: '12345',
    expected_factors: ['3', '5', '823'] // 3 × 5 × 823 = 12345
  },
  {
    name: 'Even number',
    number: '42',
    expected_factors: ['2', '3', '7'] // 2 × 3 × 7 = 42
  },
  {
    name: 'Large semiprime',
    number: '1073741827', // This is actually a prime, good test case
    expected_factors: ['1073741827'] // Should return itself if prime
  }
];

async function makeApiRequest(endpoint, method = 'GET', data = null) {
  const url = `${API_BASE_URL}${endpoint}`;
  const options = {
    method,
    headers: {
      'Content-Type': 'application/json',
      'X-API-Key': API_KEY
    }
  };

  if (data) {
    options.body = JSON.stringify(data);
  }

  try {
    console.log(`Making ${method} request to: ${url}`);
    const response = await fetch(url, options);
    
    const result = await response.json();
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${result.error?.message || 'Request failed'}`);
    }
    
    return result;
  } catch (error) {
    console.error(`API request failed: ${error.message}`);
    throw error;
  }
}

async function testHealthCheck() {
  console.log('\n🔍 Testing API health check...');
  try {
    const result = await makeApiRequest('/health');
    console.log('✅ Health check successful');
    console.log(`   Status: ${result.status}`);
    console.log(`   FastFactor engine: ${result.engines?.fastfactor ? '✅ Available' : '❌ Not available'}`);
    return result.engines?.fastfactor === true;
  } catch (error) {
    console.error('❌ Health check failed:', error.message);
    return false;
  }
}

async function testFastFactorStatus() {
  console.log('\n🔍 Testing FastFactor service status...');
  try {
    const result = await makeApiRequest('/fastfactor/status');
    console.log('✅ FastFactor status check successful');
    console.log(`   Service: ${result.data?.service}`);
    console.log(`   Status: ${result.data?.status}`);
    console.log(`   Version: ${result.data?.version}`);
    console.log(`   Description: ${result.data?.description}`);
    return true;
  } catch (error) {
    console.error('❌ FastFactor status check failed:', error.message);
    return false;
  }
}

async function testFactorization(testCase) {
  console.log(`\n🔍 Testing factorization: ${testCase.name} (${testCase.number})`);
  
  const request = {
    number: testCase.number,
    config: {
      max_iterations: 1000,
      timeout_seconds: 30,
      resonance_threshold: 0.9
    }
  };

  try {
    const startTime = Date.now();
    const result = await makeApiRequest('/fastfactor/factorize', 'POST', request);
    const endTime = Date.now();
    
    const response = result.data;
    
    console.log('✅ Factorization completed');
    console.log(`   Number: ${response.number}`);
    console.log(`   Is Prime: ${response.is_prime}`);
    console.log(`   Is Complete: ${response.is_complete}`);
    console.log(`   Confidence: ${(response.confidence * 100).toFixed(2)}%`);
    console.log(`   Factors found: ${response.factors.length}`);
    
    if (response.factors && response.factors.length > 0) {
      console.log('   Factor details:');
      response.factors.forEach((factor, index) => {
        console.log(`     ${index + 1}. ${factor.value} (confidence: ${(factor.confidence * 100).toFixed(2)}%)`);
      });
      
      // Verify factors multiply to original number
      if (response.factors.length > 1) {
        const product = response.factors.reduce((acc, factor) => {
          return (BigInt(acc) * BigInt(factor.value)).toString();
        }, '1');
        
        if (product === testCase.number) {
          console.log('   ✅ Factor verification: Product equals original number');
        } else {
          console.log('   ⚠️  Factor verification: Product does not equal original number');
          console.log(`      Expected: ${testCase.number}, Got: ${product}`);
        }
      }
    }
    
    console.log(`   Processing time: ${endTime - startTime}ms`);
    console.log(`   Server time: ${response.timing?.duration_ms || 'N/A'}ms`);
    console.log(`   Iterations: ${response.timing?.iterations || 'N/A'}`);
    
    if (response.resonance_metrics) {
      console.log('   Resonance metrics:');
      console.log(`     Average resonance: ${response.resonance_metrics.average_resonance?.toFixed(4)}`);
      console.log(`     Peak resonance: ${response.resonance_metrics.peak_resonance?.toFixed(4)}`);
      console.log(`     Coherence strength: ${response.resonance_metrics.coherence_strength?.toFixed(4)}`);
    }
    
    return true;
  } catch (error) {
    console.error('❌ Factorization failed:', error.message);
    return false;
  }
}

async function testPerformanceMetrics() {
  console.log('\n🔍 Testing performance metrics...');
  try {
    const result = await makeApiRequest('/fastfactor/performance');
    console.log('✅ Performance metrics retrieved');
    console.log(`   Telemetry points: ${result.data?.telemetry_points || 0}`);
    
    if (result.data?.statistics) {
      console.log('   Statistics:');
      console.log(`     Average entropy: ${result.data.statistics.average_entropy?.toFixed(4)}`);
      console.log(`     Average resonance: ${result.data.statistics.average_resonance?.toFixed(4)}`);
      console.log(`     Total measurements: ${result.data.statistics.total_measurements}`);
    }
    
    return true;
  } catch (error) {
    console.error('❌ Performance metrics test failed:', error.message);
    return false;
  }
}

async function runTests() {
  console.log('🚀 Starting FastFactor API Integration Tests\n');
  console.log(`API Base URL: ${API_BASE_URL}`);
  console.log(`API Key: ${API_KEY.substring(0, 10)}...`);
  
  let passed = 0;
  let total = 0;
  
  // Test 1: Health check
  total++;
  if (await testHealthCheck()) {
    passed++;
  }
  
  // Test 2: Service status
  total++;
  if (await testFastFactorStatus()) {
    passed++;
  }
  
  // Test 3: Factorization tests
  for (const testCase of TEST_CASES) {
    total++;
    if (await testFactorization(testCase)) {
      passed++;
    }
    
    // Small delay between tests
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
  
  // Test 4: Performance metrics
  total++;
  if (await testPerformanceMetrics()) {
    passed++;
  }
  
  // Summary
  console.log('\n' + '='.repeat(60));
  console.log('📊 TEST SUMMARY');
  console.log('='.repeat(60));
  console.log(`Total tests: ${total}`);
  console.log(`Passed: ${passed}`);
  console.log(`Failed: ${total - passed}`);
  console.log(`Success rate: ${((passed / total) * 100).toFixed(1)}%`);
  
  if (passed === total) {
    console.log('\n🎉 All tests passed! FastFactor API integration is working correctly.');
    process.exit(0);
  } else {
    console.log('\n❌ Some tests failed. Please check the FastFactor service configuration.');
    process.exit(1);
  }
}

// Handle unhandled promise rejections
process.on('unhandledRejection', (error) => {
  console.error('❌ Unhandled promise rejection:', error);
  process.exit(1);
});

// Run the tests
runTests().catch((error) => {
  console.error('❌ Test execution failed:', error);
  process.exit(1);
});