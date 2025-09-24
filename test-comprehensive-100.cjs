#!/usr/bin/env node

const http = require('http');

const API_BASE = 'http://localhost:8080';
const API_KEY = 'dev-key';

function makeRequest(path, options = {}) {
    return new Promise((resolve, reject) => {
        const url = new URL(path, API_BASE);
        
        const reqOptions = {
            hostname: url.hostname,
            port: url.port || 8080,
            path: url.pathname + url.search,
            method: options.method || 'GET',
            headers: {
                'Content-Type': 'application/json',
                'X-Api-Key': API_KEY,
                'User-Agent': 'Comprehensive-Test/1.0',
                ...options.headers
            }
        };

        const req = http.request(reqOptions, (res) => {
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

async function test100PercentFunctionality() {
    console.log('🎯 Testing 100% System Functionality (localhost:8080)...\n');

    let allTestsPassed = true;

    // Test 1: HQE Status Check
    console.log('1️⃣ Testing HQE Service Status...');
    try {
        const start = Date.now();
        const response = await makeRequest('/v1/hqe/status');
        const duration = Date.now() - start;
        
        if (response.status === 200) {
            console.log(`✅ HQE Status: ${duration}ms - Service operational`);
        } else {
            console.log(`❌ HQE Status failed: ${response.status}`);
            allTestsPassed = false;
        }
    } catch (error) {
        console.log(`❌ HQE Status error: ${error.message}`);
        allTestsPassed = false;
    }

    // Test 2: HQE Prime Basis (should be instant with cache)
    console.log('\n2️⃣ Testing HQE Prime Basis Performance...');
    try {
        const start = Date.now();
        const response = await makeRequest('/v1/hqe/primes?count=100');
        const duration = Date.now() - start;
        
        if (response.status === 200) {
            console.log(`✅ Prime basis (100): ${duration}ms`);
            console.log(`   First 10 primes: ${response.data.recommended?.slice(0, 10).join(', ')}`);
        } else {
            console.log(`❌ Prime basis failed: ${response.status}`);
            allTestsPassed = false;
        }
    } catch (error) {
        console.log(`❌ Prime basis error: ${error.message}`);
        allTestsPassed = false;
    }

    // Test 3: HQE Simulation with Optimized Parameters
    console.log('\n3️⃣ Testing HQE Simulation (Optimized)...');
    try {
        const start = Date.now();
        const response = await makeRequest('/v1/hqe/simulate', {
            method: 'POST',
            body: {
                simulation_type: "holographic_duality",
                primes: [2, 3, 5, 7, 11],
                steps: 10,
                lambda: 0.5
            }
        });
        const duration = Date.now() - start;
        
        if (response.status === 200) {
            console.log(`✅ HQE simulation: ${duration}ms - SUCCESS!`);
            console.log(`   Converged: ${response.data.converged}`);
            console.log(`   Complexity: ${response.data.holographic_complexity?.toFixed(3)}`);
        } else if (response.status === 408) {
            console.log(`⏱️ HQE simulation timed out: ${duration}ms`);
            allTestsPassed = false;
        } else {
            console.log(`❌ HQE simulation failed: ${response.status}`);
            allTestsPassed = false;
        }
    } catch (error) {
        console.log(`❌ HQE simulation error: ${error.message}`);
        allTestsPassed = false;
    }

    // Test 4: QCR Session Creation
    console.log('\n4️⃣ Testing QCR Session Creation...');
    let qcrSessionId = null;
    try {
        const start = Date.now();
        const response = await makeRequest('/v1/qcr/sessions', {
            method: 'POST',
            body: {
                modes: ['analytical', 'creative'],
                simulation_type: 'triadic_consciousness',
                max_iterations: 21
            }
        });
        const duration = Date.now() - start;
        
        if (response.status === 201) {
            // Extract session ID from the correct field path based on debug output
            qcrSessionId = response.data.result?.session_id || response.data.id || response.data.data?.result?.session_id;
            console.log(`✅ QCR session created: ${duration}ms - ${qcrSessionId}`);
        } else {
            console.log(`❌ QCR session creation failed: ${response.status}`);
            allTestsPassed = false;
        }
    } catch (error) {
        console.log(`❌ QCR session error: ${error.message}`);
        allTestsPassed = false;
    }

    // Test 5: QCR Observation (Fixed SessionID issue)
    if (qcrSessionId) {
        console.log('\n5️⃣ Testing QCR Observation...');
        try {
            const start = Date.now();
            const response = await makeRequest(`/v1/qcr/sessions/${qcrSessionId}/observe`, {
                method: 'POST',
                body: {
                    // SessionID removed from body - it comes from URL path
                    prompt: 'Test quantum consciousness observation'
                }
            });
            const duration = Date.now() - start;
            
            if (response.status === 200) {
                console.log(`✅ QCR observation: ${duration}ms - SUCCESS!`);
                console.log(`   Confidence: ${response.data.confidence?.toFixed(3)}`);
                console.log(`   Response: ${response.data.response?.substring(0, 100)}...`);
            } else {
                console.log(`❌ QCR observation failed: ${response.status}`);
                console.log(`   Error: ${JSON.stringify(response.data, null, 2)}`);
                allTestsPassed = false;
            }
        } catch (error) {
            console.log(`❌ QCR observation error: ${error.message}`);
            allTestsPassed = false;
        }
    }

    // Test 6: Other Core Services
    console.log('\n6️⃣ Testing Other Core Services...');
    
    // RNET Status
    try {
        const response = await makeRequest('/v1/engine/stats');
        if (response.status === 200) {
            console.log(`✅ RNET Engine: operational (uptime: ${Math.round((response.data?.uptime || 0) / 1000)}s)`);
        } else {
            console.log(`❌ RNET Engine failed: ${response.status}`);
            allTestsPassed = false;
        }
    } catch (error) {
        console.log(`❌ RNET Engine error: ${error.message}`);
        allTestsPassed = false;
    }

    // QSEM Encoding
    try {
        const response = await makeRequest('/v1/qsem/encode', {
            method: 'POST',
            body: {
                concepts: ['test', 'quantum'],
                basis: 'prime'
            }
        });
        if (response.status === 200) {
            console.log(`✅ QSEM: ${response.data.vectors?.length || 0} vectors encoded`);
        } else {
            console.log(`❌ QSEM failed: ${response.status}`);
            allTestsPassed = false;
        }
    } catch (error) {
        console.log(`❌ QSEM error: ${error.message}`);
        allTestsPassed = false;
    }

    // I-Ching Oracle
    try {
        const response = await makeRequest('/v1/iching/evolve', {
            method: 'POST',
            body: {
                question: 'Test question',
                steps: 3
            }
        });
        if (response.status === 200) {
            console.log(`✅ I-Ching: ${response.data.sequence?.length || 0} hexagrams`);
        } else {
            console.log(`❌ I-Ching failed: ${response.status}`);
            allTestsPassed = false;
        }
    } catch (error) {
        console.log(`❌ I-Ching error: ${error.message}`);
        allTestsPassed = false;
    }

    // Final Summary
    console.log('\n📊 100% Functionality Test Summary:');
    if (allTestsPassed) {
        console.log('🎉 ALL TESTS PASSED - System is 100% functional!');
    } else {
        console.log('❌ Some tests failed - System needs fixes for 100% functionality');
    }
    
    return allTestsPassed;
}

if (require.main === module) {
    test100PercentFunctionality().catch(console.error);
}

module.exports = { test100PercentFunctionality };