#!/usr/bin/env node

const https = require('https');

const API_BASE = 'https://api.sschepis.com';

function makeRequest(path, options = {}) {
    return new Promise((resolve, reject) => {
        const url = new URL(path, API_BASE);
        
        const reqOptions = {
            method: options.method || 'GET',
            headers: {
                'Content-Type': 'application/json',
                'User-Agent': 'HQE-Performance-Test/1.0',
                ...options.headers
            }
        };

        const req = https.request(url, reqOptions, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => {
                try {
                    const result = JSON.parse(data);
                    resolve({ status: res.statusCode, data: result });
                } catch (e) {
                    resolve({ status: res.statusCode, data: data });
                }
            });
        });

        req.on('error', reject);
        req.on('timeout', () => reject(new Error('Request timeout')));
        req.setTimeout(30000); // 30 second timeout

        if (options.body) {
            req.write(JSON.stringify(options.body));
        }

        req.end();
    });
}

async function testHQEPerformance() {
    console.log('🔬 Testing HQE Performance After Prime Cache Optimization...\n');

    // Test 1: Quick status check
    console.log('1️⃣ Testing HQE Status...');
    try {
        const start = Date.now();
        const response = await makeRequest('/v1/hqe/status');
        const duration = Date.now() - start;
        
        if (response.status === 200) {
            console.log(`✅ Status: ${duration}ms - Service operational`);
        } else {
            console.log(`❌ Status failed: ${response.status}`);
            return;
        }
    } catch (error) {
        console.log(`❌ Status error: ${error.message}`);
        return;
    }

    // Test 2: Prime basis performance
    console.log('\n2️⃣ Testing Prime Basis Performance...');
    try {
        const start = Date.now();
        const response = await makeRequest('/v1/hqe/primes?count=100');
        const duration = Date.now() - start;
        
        if (response.status === 200) {
            console.log(`✅ Prime basis (100): ${duration}ms`);
            console.log(`   First 10 primes: ${response.data.primes?.slice(0, 10).join(', ')}`);
        } else {
            console.log(`❌ Prime basis failed: ${response.status}`);
        }
    } catch (error) {
        console.log(`❌ Prime basis error: ${error.message}`);
    }

    // Test 3: Small holographic simulation (should be fast now)
    console.log('\n3️⃣ Testing Small Holographic Simulation...');
    try {
        const start = Date.now();
        const response = await makeRequest('/v1/hqe/simulate', {
            method: 'POST',
            body: {
                type: 'holographic_reconstruction',
                params: {
                    boundary_data: [[1, 0], [0, 1]], 
                    dimensions: 2,
                    max_iterations: 5  // Very small iteration count
                }
            }
        });
        const duration = Date.now() - start;
        
        if (response.status === 200) {
            console.log(`✅ Small holographic simulation: ${duration}ms`);
            console.log(`   Result: ${JSON.stringify(response.data).substring(0, 100)}...`);
        } else if (response.status === 408) {
            console.log(`⏱️ Small simulation still timed out: ${duration}ms`);
        } else {
            console.log(`❌ Small simulation failed: ${response.status} - ${JSON.stringify(response.data)}`);
        }
    } catch (error) {
        console.log(`❌ Small simulation error: ${error.message}`);
    }

    // Test 4: Boundary evolution (minimal params)
    console.log('\n4️⃣ Testing Minimal Boundary Evolution...');
    try {
        const start = Date.now();
        const response = await makeRequest('/v1/hqe/simulate', {
            method: 'POST',
            body: {
                type: 'boundary_evolution',
                params: {
                    initial_state: [1, 0.5],
                    time_steps: 3,  // Very small step count
                    step_size: 0.1
                }
            }
        });
        const duration = Date.now() - start;
        
        if (response.status === 200) {
            console.log(`✅ Boundary evolution: ${duration}ms`);
        } else if (response.status === 408) {
            console.log(`⏱️ Boundary evolution still timed out: ${duration}ms`);
        } else {
            console.log(`❌ Boundary evolution failed: ${response.status}`);
        }
    } catch (error) {
        console.log(`❌ Boundary evolution error: ${error.message}`);
    }

    // Test 5: Bulk geometry (minimal complexity)
    console.log('\n5️⃣ Testing Minimal Bulk Geometry...');
    try {
        const start = Date.now();
        const response = await makeRequest('/v1/hqe/simulate', {
            method: 'POST',
            body: {
                type: 'bulk_geometry',
                params: {
                    metric_tensor: [[1, 0], [0, 1]],
                    resolution: 2  // Very low resolution
                }
            }
        });
        const duration = Date.now() - start;
        
        if (response.status === 200) {
            console.log(`✅ Bulk geometry: ${duration}ms`);
        } else if (response.status === 408) {
            console.log(`⏱️ Bulk geometry still timed out: ${duration}ms`);
        } else {
            console.log(`❌ Bulk geometry failed: ${response.status}`);
        }
    } catch (error) {
        console.log(`❌ Bulk geometry error: ${error.message}`);
    }

    console.log('\n📊 Performance Test Summary:');
    console.log('   Prime cache optimization implemented with 1000 pre-computed primes');
    console.log('   Eliminated expensive dynamic prime generation in GetPrimeBasis()');
    console.log('   Testing with minimal simulation parameters to isolate performance gains');
}

testHQEPerformance().catch(console.error);