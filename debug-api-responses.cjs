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
                'User-Agent': 'Debug-Test/1.0',
                ...options.headers
            }
        };

        const req = http.request(reqOptions, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => {
                try {
                    const result = JSON.parse(data);
                    resolve({ status: res.statusCode, data: result, raw: data });
                } catch (e) {
                    resolve({ status: res.statusCode, data: null, raw: data, parseError: e.message });
                }
            });
        });

        req.on('error', reject);
        req.on('timeout', () => reject(new Error('Request timeout')));
        req.setTimeout(10000);

        if (options.body) {
            req.write(JSON.stringify(options.body));
        }

        req.end();
    });
}

async function debugAPIResponses() {
    console.log('🔍 Debugging API Response Formats...\n');

    // Test HQE Prime Response
    console.log('1️⃣ HQE Prime Response Structure:');
    try {
        const response = await makeRequest('/v1/hqe/primes?count=5');
        console.log(`Status: ${response.status}`);
        console.log(`Raw response: ${response.raw}`);
        console.log(`Parsed data:`, JSON.stringify(response.data, null, 2));
    } catch (error) {
        console.log(`Error: ${error.message}`);
    }

    // Test HQE Simulation Response
    console.log('\n2️⃣ HQE Simulation Response Structure:');
    try {
        const response = await makeRequest('/v1/hqe/simulate', {
            method: 'POST',
            body: {
                type: 'holographic_reconstruction',
                params: {
                    boundary_data: [[1, 0], [0, 1]], 
                    dimensions: 2,
                    max_iterations: 5
                }
            }
        });
        console.log(`Status: ${response.status}`);
        console.log(`Raw response: ${response.raw}`);
        console.log(`Parsed data:`, JSON.stringify(response.data, null, 2));
    } catch (error) {
        console.log(`Error: ${error.message}`);
    }

    // Test QCR Session Response  
    console.log('\n3️⃣ QCR Session Response Structure:');
    try {
        const response = await makeRequest('/v1/qcr/sessions', {
            method: 'POST',
            body: {
                modes: ['analytical'],
                simulation_type: 'triadic_consciousness',
                max_iterations: 5
            }
        });
        console.log(`Status: ${response.status}`);
        console.log(`Raw response: ${response.raw}`);
        console.log(`Parsed data:`, JSON.stringify(response.data, null, 2));
        
        // If session creation succeeded, test observation
        if (response.status === 201 && response.data && response.data.id) {
            console.log('\n3️⃣b QCR Observation Response Structure:');
            const sessionId = response.data.id;
            const obsResponse = await makeRequest(`/v1/qcr/sessions/${sessionId}/observe`, {
                method: 'POST',
                body: {
                    prompt: 'Test observation'
                }
            });
            console.log(`Observation Status: ${obsResponse.status}`);
            console.log(`Observation Raw: ${obsResponse.raw}`);
            console.log(`Observation Data:`, JSON.stringify(obsResponse.data, null, 2));
        }
    } catch (error) {
        console.log(`Error: ${error.message}`);
    }

    console.log('\n🔍 Debug complete');
}

if (require.main === module) {
    debugAPIResponses().catch(console.error);
}