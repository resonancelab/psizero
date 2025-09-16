import PageLayout from "@/components/layout/PageLayout";
import Section from "@/components/layout/Section";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Copy, ExternalLink, Brain, Atom, Sparkles, Globe, Eye, Hexagon, Gauge } from "lucide-react";
import CodeBlock from "@/components/ui/code-block";

const Examples = () => {
  const languages = [
    { id: "javascript", name: "JavaScript", icon: "🟨" },
    { id: "python", name: "Python", icon: "🐍" },
    { id: "go", name: "Go", icon: "🔷" },
    { id: "curl", name: "cURL", icon: "🌐" }
  ];

  const apiExamples = {
    srs: {
      name: "Symbolic Resonance Solver",
      icon: Brain,
      color: "blue",
      javascript: {
        auth: `// SRS API Authentication
const apiKey = 'your-api-key';
const headers = {
  'Authorization': \`Bearer \${apiKey}\`,
  'Content-Type': 'application/json'
};`,
        solve: `// Solve 3-SAT Problem with SRS
const solve3SAT = async (variables, clauses) => {
  const response = await fetch('https://api.psizero.dev/v1/srs/solve', {
    method: 'POST',
    headers,
    body: JSON.stringify({
      problem: '3sat',
      spec: {
        variables,
        clauses: clauses.map(clause => 
          clause.map(literal => ({
            var: Math.abs(literal),
            neg: literal < 0
          }))
        )
      },
      config: {
        stop: { iterMax: 5000, plateauEps: 1e-6 }
      }
    })
  });
  return response.json();
};

// Example usage
const result = await solve3SAT(3, [
  [1, -2, 3],
  [-1, 2, -3],
  [2, 3, 1]
]);
console.log('Solution:', result.certificate.assignment);`
      },
      python: {
        auth: `# SRS API Authentication
import requests

api_key = "your-api-key"
headers = {
    "Authorization": f"Bearer {api_key}",
    "Content-Type": "application/json"
}`,
        solve: `# Solve Subset Sum Problem with SRS
def solve_subset_sum(weights, target):
    response = requests.post(
        "https://api.psizero.dev/v1/srs/solve",
        headers=headers,
        json={
            "problem": "subsetsum",
            "spec": {
                "weights": weights,
                "target": target
            },
            "config": {
                "stop": {"iterMax": 10000}
            }
        }
    )
    return response.json()

# Example usage
result = solve_subset_sum([3, 7, 1, 14, 2], 9)
if result["feasible"]:
    indices = result["certificate"]["indices"]
    solution = [weights[i] for i in indices]
    print(f"Solution: {solution} = {sum(solution)}")`
      }
    },
    hqe: {
      name: "Holographic Quantum Encoder",
      icon: Atom,
      color: "purple",
      javascript: {
        simulate: `// HQE Quantum Simulation
const simulateQuantumSystem = async (primes, steps = 256) => {
  const response = await fetch('https://api.psizero.dev/v1/hqe/simulate', {
    method: 'POST',
    headers,
    body: JSON.stringify({
      primes,
      dt: 0.1,
      steps,
      lambda: 0.02,
      resonanceTarget: 0.8,
      initialAmplitudes: primes.map(() => 1/Math.sqrt(primes.length))
    })
  });
  return response.json();
};

// Simulate 4-prime quantum system
const result = await simulateQuantumSystem([2, 3, 5, 7]);
console.log('Final amplitudes:', result.snapshots.slice(-1)[0].amplitudes);
console.log('System entropy:', result.finalMetrics.entropy);`
      },
      python: {
        simulate: `# HQE Quantum System Simulation
def simulate_quantum_system(primes, steps=256, resonance_target=0.8):
    response = requests.post(
        "https://api.psizero.dev/v1/hqe/simulate",
        headers=headers,
        json={
            "primes": primes,
            "dt": 0.1,
            "steps": steps,
            "lambda": 0.02,
            "resonanceTarget": resonance_target,
            "initialAmplitudes": [1/len(primes)**0.5] * len(primes)
        }
    )
    return response.json()

# High-dimensional quantum simulation
result = simulate_quantum_system([2, 3, 5, 7, 11, 13], steps=512)
print(f"Resonance achieved: {result['finalMetrics']['resonanceStrength']:.3f}")

# Plot amplitude evolution
import matplotlib.pyplot as plt
steps = [s['step'] for s in result['snapshots']]
amplitudes = [s['amplitudes'][0] for s in result['snapshots']]
plt.plot(steps, amplitudes)
plt.title('Prime 2 Amplitude Evolution')
plt.show()`
      }
    },
    qsem: {
      name: "Quantum Semantics",
      icon: Sparkles,
      color: "pink",
      javascript: {
        encode: `// QSEM Concept Encoding
const encodeConcepts = async (concepts) => {
  const response = await fetch('https://api.psizero.dev/v1/qsem/encode', {
    method: 'POST',
    headers,
    body: JSON.stringify({
      concepts,
      basis: 'prime'
    })
  });
  return response.json();
};

// Compute semantic resonance
const computeResonance = async (vectors) => {
  const response = await fetch('https://api.psizero.dev/v1/qsem/resonance', {
    method: 'POST',
    headers,
    body: JSON.stringify({ vectors })
  });
  return response.json();
};

// Semantic analysis workflow
const concepts = ["love", "entropy", "quantum", "consciousness"];
const encoded = await encodeConcepts(concepts);
const resonance = await computeResonance(encoded.vectors);
console.log('Concept coherence:', resonance.coherence);`
      },
      python: {
        encode: `# QSEM Semantic Analysis
def analyze_concept_relationships(concepts):
    # Encode concepts
    encode_response = requests.post(
        "https://api.psizero.dev/v1/qsem/encode",
        headers=headers,
        json={"concepts": concepts, "basis": "prime"}
    )
    vectors = encode_response.json()["vectors"]
    
    # Compute resonance
    resonance_response = requests.post(
        "https://api.psizero.dev/v1/qsem/resonance",
        headers=headers,
        json={"vectors": vectors}
    )
    return resonance_response.json()

# Scientific concept analysis
concepts = ["quantum", "information", "entropy", "consciousness", "reality"]
result = analyze_concept_relationships(concepts)

print(f"Overall coherence: {result['coherence']:.3f}")
for pair in result['pairwise']:
    concept_a = concepts[pair['a']]
    concept_b = concepts[pair['b']]
    resonance = pair['resonance']
    print(f"{concept_a} ↔ {concept_b}: {resonance:.3f}")`
      }
    },
    nlc: {
      name: "Non-Local Communication",
      icon: Globe,
      color: "green",
      javascript: {
        session: `// NLC Quantum Communication Session
const createNLCSession = async (primes) => {
  const response = await fetch('https://api.psizero.dev/v1/nlc/sessions', {
    method: 'POST',
    headers,
    body: JSON.stringify({
      primes,
      goldenPhase: true,
      silverPhase: true
    })
  });
  return response.json();
};

const sendMessage = async (sessionId, message) => {
  const response = await fetch(\`https://api.psizero.dev/v1/nlc/sessions/\${sessionId}/messages\`, {
    method: 'POST',
    headers,
    body: JSON.stringify({ content: message })
  });
  return response.json();
};

// Establish quantum communication
const session = await createNLCSession([2, 3, 5, 7, 11]);
console.log('Session ID:', session.id);

// Wait for channel stabilization
while (session.status !== 'stable') {
  await new Promise(resolve => setTimeout(resolve, 1000));
  const status = await fetch(\`https://api.psizero.dev/v1/nlc/sessions/\${session.id}\`);
  session = await status.json();
}

// Send quantum message
const message = await sendMessage(session.id, "Hello through quantum entanglement!");
console.log('Message sent with quality:', message.channelQuality);`
      },
      python: {
        session: `# NLC Quantum Communication System
import time

def create_secure_quantum_channel(primes, wait_for_stability=True):
    # Create session
    response = requests.post(
        "https://api.psizero.dev/v1/nlc/sessions",
        headers=headers,
        json={
            "primes": primes,
            "goldenPhase": True,
            "silverPhase": True
        }
    )
    session = response.json()
    
    if wait_for_stability:
        # Wait for channel stabilization
        while session["status"] != "stable":
            time.sleep(1)
            status_response = requests.get(
                f"https://api.psizero.dev/v1/nlc/sessions/{session['id']}",
                headers=headers
            )
            session = status_response.json()
            print(f"Channel status: {session['status']}, Quality: {session['metrics']['resonanceStrength']:.3f}")
    
    return session

def send_quantum_message(session_id, message):
    response = requests.post(
        f"https://api.psizero.dev/v1/nlc/sessions/{session_id}/messages",
        headers=headers,
        json={"content": message}
    )
    return response.json()

# High-security quantum communication
session = create_secure_quantum_channel([2, 3, 5, 7, 11, 13])
result = send_quantum_message(session["id"], "Top secret quantum message")
print(f"Transmission quality: {result['channelQuality']:.3f}")`
      }
    },
    qcr: {
      name: "Quantum Consciousness Resonator",
      icon: Eye,
      color: "indigo",
      javascript: {
        consciousness: `// QCR Consciousness Simulation
const createConsciousnessSession = async (modes) => {
  const response = await fetch('https://api.psizero.dev/v1/qcr/sessions', {
    method: 'POST',
    headers,
    body: JSON.stringify({
      modes,
      maxIterations: 21
    })
  });
  return response.json();
};

const queryConsciousness = async (sessionId, prompt) => {
  const response = await fetch(\`https://api.psizero.dev/v1/qcr/sessions/\${sessionId}/observe\`, {
    method: 'POST',
    headers,
    body: JSON.stringify({ prompt })
  });
  return response.json();
};

// Multi-modal consciousness
const session = await createConsciousnessSession([
  "analytical", "creative", "ethical", "emotional"
]);

// Explore philosophical questions
const response = await queryConsciousness(session.id, 
  "What is the relationship between consciousness and quantum mechanics?"
);

console.log('Consciousness response:', response.response);
console.log('Resonance strength:', response.metrics.resonanceStrength);`
      },
      python: {
        consciousness: `# QCR Advanced Consciousness Simulation
def create_multi_modal_consciousness(modes, max_iterations=21):
    response = requests.post(
        "https://api.psizero.dev/v1/qcr/sessions",
        headers=headers,
        json={
            "modes": modes,
            "maxIterations": max_iterations
        }
    )
    return response.json()

def explore_consciousness_question(session_id, question):
    response = requests.post(
        f"https://api.psizero.dev/v1/qcr/sessions/{session_id}/observe",
        headers=headers,
        json={"prompt": question}
    )
    return response.json()

# Create advanced consciousness system
consciousness = create_multi_modal_consciousness([
    "analytical", "creative", "ethical", "pragmatic", "emotional"
])

# Explore deep questions
questions = [
    "What is the nature of free will?",
    "How does consciousness emerge from matter?",
    "What is the meaning of existence?",
    "How do we balance logic and intuition?"
]

for question in questions:
    result = explore_consciousness_question(consciousness["id"], question)
    print(f"\\nQ: {question}")
    print(f"A: {result['response']}")
    print(f"Confidence: {result['metrics']['dominance']:.3f}")`
      }
    },
    iching: {
      name: "I-Ching Oracle",
      icon: Hexagon,
      color: "orange",
      javascript: {
        oracle: `// I-Ching Quantum Oracle
const consultOracle = async (question, steps = 7) => {
  const response = await fetch('https://api.psizero.dev/v1/iching/evolve', {
    method: 'POST',
    headers,
    body: JSON.stringify({
      question,
      steps
    })
  });
  return response.json();
};

// Seek guidance
const guidance = await consultOracle(
  "What direction should I take in my career development?", 
  7
);

console.log('Oracle guidance:');
console.log('Final hexagram:', guidance.sequence.slice(-1)[0].hexagram);
console.log('Interpretation:', guidance.interpretation.meaning);
console.log('Practical advice:', guidance.interpretation.guidance);
console.log('Timeframe:', guidance.interpretation.timeframe);

// Visualize hexagram evolution
guidance.sequence.forEach((step, i) => {
  const hexagram = step.hexagram.split('').map(bit => bit === '1' ? '━━━' : '━ ━').join('\\n');
  console.log(\`Step \${step.step}: Entropy \${step.entropy.toFixed(2)}\\n\${hexagram}\\n\`);
});`
      },
      python: {
        oracle: `# I-Ching Quantum Wisdom System
def consult_quantum_oracle(question, evolution_steps=7):
    response = requests.post(
        "https://api.psizero.dev/v1/iching/evolve",
        headers=headers,
        json={
            "question": question,
            "steps": evolution_steps
        }
    )
    return response.json()

def visualize_hexagram_evolution(oracle_response):
    import matplotlib.pyplot as plt
    
    steps = [s['step'] for s in oracle_response['sequence']]
    entropy = [s['entropy'] for s in oracle_response['sequence']]
    proximity = [s['attractorProximity'] for s in oracle_response['sequence']]
    
    fig, (ax1, ax2) = plt.subplots(2, 1, figsize=(10, 8))
    
    ax1.plot(steps, entropy, 'b-', label='System Entropy')
    ax1.set_ylabel('Entropy')
    ax1.set_title('Oracle Evolution Dynamics')
    ax1.legend()
    
    ax2.plot(steps, proximity, 'r-', label='Attractor Proximity')
    ax2.set_xlabel('Evolution Step')
    ax2.set_ylabel('Attractor Proximity')
    ax2.legend()
    
    plt.tight_layout()
    plt.show()

# Business strategy consultation
business_guidance = consult_quantum_oracle(
    "Should we expand our AI research division or focus on quantum computing?",
    evolution_steps=10
)

print("=== QUANTUM ORACLE GUIDANCE ===")
print(f"Question Stabilized: {business_guidance['stabilized']}")
print(f"Final Wisdom: {business_guidance['interpretation']['meaning']}")
print(f"Strategic Advice: {business_guidance['interpretation']['guidance']}")

# Visualize the wisdom emergence process
visualize_hexagram_evolution(business_guidance)`
      }
    },
    unified: {
      name: "Unified Physics",
      icon: Gauge,
      color: "red",
      javascript: {
        gravity: `// Unified Physics - Emergent Gravity Computation
const computeEmergentGravity = async (observerRate, entropyGradient, density = null) => {
  const response = await fetch('https://api.psizero.dev/v1/unified/gravity/compute', {
    method: 'POST',
    headers,
    body: JSON.stringify({
      observerEntropyReductionRate: observerRate,
      regionEntropyGradient: entropyGradient,
      ...(density && { blackHoleProxyDensity: density })
    })
  });
  return response.json();
};

// Laboratory physics regime
const labResults = await computeEmergentGravity(5.2, 0.001);
console.log('Lab G_eff:', labResults.effectiveG);
console.log('Deviation from standard G:', 
  ((labResults.effectiveG / 6.67e-11) - 1) * 100 + '%');

// Astrophysical extreme regime
const blackHoleResults = await computeEmergentGravity(1000, 0.1, 1e15);
console.log('Near black hole G_eff:', blackHoleResults.effectiveG);
console.log('Gravitational enhancement:', 
  blackHoleResults.analysis.gravitationalEnhancement);
console.log('Physical regime:', blackHoleResults.analysis.regime);`
      },
      python: {
        gravity: `# Unified Physics - Observer-Gravity Coupling Research
import numpy as np

def study_observer_gravity_coupling(observer_rates, entropy_gradients):
    results = []
    
    for rate in observer_rates:
        for gradient in entropy_gradients:
            response = requests.post(
                "https://api.psizero.dev/v1/unified/gravity/compute",
                headers=headers,
                json={
                    "observerEntropyReductionRate": rate,
                    "regionEntropyGradient": gradient
                }
            )
            result = response.json()
            results.append({
                "observer_rate": rate,
                "entropy_gradient": gradient,
                "effective_g": result["effectiveG"],
                "enhancement": result["analysis"]["gravitationalEnhancement"],
                "regime": result["analysis"]["regime"]
            })
    
    return results

# Consciousness-gravity correlation study
observer_rates = np.logspace(0, 3, 10)  # 1 to 1000 bits/sec
entropy_gradients = np.logspace(-4, -1, 10)  # 0.0001 to 0.1 bits/m³

results = study_observer_gravity_coupling(observer_rates, entropy_gradients)

# Analyze results
import pandas as pd
import matplotlib.pyplot as plt

df = pd.DataFrame(results)
print("=== OBSERVER-GRAVITY COUPLING ANALYSIS ===")
print(f"Standard regime samples: {len(df[df['regime'] == 'classical'])}")
print(f"Enhanced gravity samples: {len(df[df['enhancement'] > 1.1])}")
print(f"Maximum enhancement factor: {df['enhancement'].max():.2f}")

# Plot consciousness-gravity relationship
plt.figure(figsize=(12, 8))
scatter = plt.scatter(df['observer_rate'], df['entropy_gradient'], 
                     c=df['enhancement'], s=50, cmap='viridis')
plt.colorbar(scatter, label='Gravitational Enhancement')
plt.xlabel('Observer Entropy Reduction Rate (bits/sec)')
plt.ylabel('Regional Entropy Gradient (bits/m³)')
plt.title('Consciousness-Gravity Coupling Map')
plt.xscale('log')
plt.yscale('log')
plt.show()`
      }
    }
  };

  const curlExamples = {
    srs: `# SRS: Solve 3-SAT Problem
curl -X POST "https://api.psizero.dev/v1/srs/solve" \\
  -H "Authorization: Bearer your-api-key" \\
  -H "Content-Type: application/json" \\
  -d '{
    "problem": "3sat",
    "spec": {
      "variables": 3,
      "clauses": [
        [{"var": 1, "neg": false}, {"var": 2, "neg": true}, {"var": 3, "neg": false}],
        [{"var": 1, "neg": true}, {"var": 2, "neg": false}, {"var": 3, "neg": true}]
      ]
    },
    "config": {"stop": {"iterMax": 5000}}
  }'`,
    hqe: `# HQE: Quantum System Simulation
curl -X POST "https://api.psizero.dev/v1/hqe/simulate" \\
  -H "Authorization: Bearer your-api-key" \\
  -H "Content-Type: application/json" \\
  -d '{
    "primes": [2, 3, 5, 7],
    "dt": 0.1,
    "steps": 256,
    "lambda": 0.02,
    "resonanceTarget": 0.8
  }'`,
    qsem: `# QSEM: Concept Encoding & Resonance
curl -X POST "https://api.psizero.dev/v1/qsem/encode" \\
  -H "Authorization: Bearer your-api-key" \\
  -H "Content-Type: application/json" \\
  -d '{
    "concepts": ["quantum", "consciousness", "information"],
    "basis": "prime"
  }'`,
    nlc: `# NLC: Quantum Communication Session
curl -X POST "https://api.psizero.dev/v1/nlc/sessions" \\
  -H "Authorization: Bearer your-api-key" \\
  -H "Content-Type: application/json" \\
  -d '{
    "primes": [2, 3, 5, 7, 11],
    "goldenPhase": true,
    "silverPhase": true
  }'`,
    qcr: `# QCR: Consciousness Simulation
curl -X POST "https://api.psizero.dev/v1/qcr/sessions" \\
  -H "Authorization: Bearer your-api-key" \\
  -H "Content-Type: application/json" \\
  -d '{
    "modes": ["analytical", "creative", "ethical"],
    "maxIterations": 21
  }'`,
    iching: `# I-Ching: Oracle Consultation
curl -X POST "https://api.psizero.dev/v1/iching/evolve" \\
  -H "Authorization: Bearer your-api-key" \\
  -H "Content-Type: application/json" \\
  -d '{
    "question": "What path should I take?",
    "steps": 7
  }'`,
    unified: `# Unified Physics: Emergent Gravity
curl -X POST "https://api.psizero.dev/v1/unified/gravity/compute" \\
  -H "Authorization: Bearer your-api-key" \\
  -H "Content-Type: application/json" \\
  -d '{
    "observerEntropyReductionRate": 12.4,
    "regionEntropyGradient": 0.002
  }'`
  };

  const goExamples = {
    srs: `package main

import (
    "bytes"
    "encoding/json"
    "fmt"
    "net/http"
)

type SRSRequest struct {
    Problem string \`json:"problem"\`
    Spec    struct {
        Variables int \`json:"variables"\`
        Clauses   [][]struct {
            Var int  \`json:"var"\`
            Neg bool \`json:"neg"\`
        } \`json:"clauses"\`
    } \`json:"spec"\`
}

func solveSRS(apiKey string, req SRSRequest) error {
    jsonData, _ := json.Marshal(req)
    
    client := &http.Client{}
    request, _ := http.NewRequest("POST", "https://api.psizero.dev/v1/srs/solve", bytes.NewBuffer(jsonData))
    request.Header.Set("Authorization", "Bearer "+apiKey)
    request.Header.Set("Content-Type", "application/json")
    
    resp, err := client.Do(request)
    if err != nil {
        return err
    }
    defer resp.Body.Close()
    
    var result map[string]interface{}
    json.NewDecoder(resp.Body).Decode(&result)
    fmt.Printf("SRS Result: %+v\\n", result)
    return nil
}`,
    
    hqe: `package main

import (
    "bytes"
    "encoding/json"
    "fmt"
    "net/http"
)

type HQERequest struct {
    Primes          []int     \`json:"primes"\`
    Dt              float64   \`json:"dt"\`
    Steps           int       \`json:"steps"\`
    Lambda          float64   \`json:"lambda"\`
    ResonanceTarget float64   \`json:"resonanceTarget"\`
}

func simulateHQE(apiKey string, primes []int) error {
    req := HQERequest{
        Primes:          primes,
        Dt:              0.1,
        Steps:           256,
        Lambda:          0.02,
        ResonanceTarget: 0.8,
    }
    
    jsonData, _ := json.Marshal(req)
    
    client := &http.Client{}
    request, _ := http.NewRequest("POST", "https://api.psizero.dev/v1/hqe/simulate", bytes.NewBuffer(jsonData))
    request.Header.Set("Authorization", "Bearer "+apiKey)
    request.Header.Set("Content-Type", "application/json")
    
    resp, err := client.Do(request)
    if err != nil {
        return err
    }
    defer resp.Body.Close()
    
    var result map[string]interface{}
    json.NewDecoder(resp.Body).Decode(&result)
    fmt.Printf("HQE Simulation: %+v\\n", result)
    return nil
}`
  };

  return (
    <PageLayout>
      <Section padding="lg">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">
              API Code Examples
            </h1>
            <p className="text-muted-foreground">
              Comprehensive implementation guides and working examples for all 9 Ψ0 Platform APIs
            </p>
          </div>

          <Tabs defaultValue="javascript" className="space-y-8">
            <TabsList className="grid grid-cols-4 w-full">
              {languages.map((lang) => (
                <TabsTrigger key={lang.id} value={lang.id} className="flex items-center gap-2">
                  <span>{lang.icon}</span>
                  <span className="hidden sm:inline">{lang.name}</span>
                </TabsTrigger>
              ))}
            </TabsList>

            {/* JavaScript Examples */}
            <TabsContent value="javascript" className="space-y-8">
              {Object.entries(apiExamples).map(([apiKey, api]) => (
                <Card key={apiKey} className="overflow-hidden">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg bg-${api.color}-100`}>
                          <api.icon className={`h-5 w-5 text-${api.color}-600`} />
                        </div>
                        {api.name}
                        <Badge variant="secondary">JavaScript</Badge>
                      </CardTitle>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          <Copy className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm">
                          <ExternalLink className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {Object.entries(api.javascript).map(([exampleKey, code]) => (
                      <div key={exampleKey}>
                        <h4 className="font-semibold mb-3 capitalize">{exampleKey.replace(/([A-Z])/g, ' $1')}</h4>
                        <CodeBlock
                          language="javascript"
                          code={code}
                        />
                      </div>
                    ))}
                  </CardContent>
                </Card>
              ))}
            </TabsContent>

            {/* Python Examples */}
            <TabsContent value="python" className="space-y-8">
              {Object.entries(apiExamples).map(([apiKey, api]) => (
                <Card key={apiKey} className="overflow-hidden">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg bg-${api.color}-100`}>
                          <api.icon className={`h-5 w-5 text-${api.color}-600`} />
                        </div>
                        {api.name}
                        <Badge variant="secondary">Python</Badge>
                      </CardTitle>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          <Copy className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm">
                          <ExternalLink className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {Object.entries(api.python || {}).map(([exampleKey, code]) => (
                      <div key={exampleKey}>
                        <h4 className="font-semibold mb-3 capitalize">{exampleKey.replace(/([A-Z])/g, ' $1')}</h4>
                        <CodeBlock
                          language="python"
                          code={code}
                        />
                      </div>
                    ))}
                  </CardContent>
                </Card>
              ))}
            </TabsContent>

            {/* Go Examples */}
            <TabsContent value="go" className="space-y-8">
              {Object.entries(goExamples).map(([apiKey, code]) => {
                const api = apiExamples[apiKey];
                return (
                  <Card key={apiKey} className="overflow-hidden">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="flex items-center gap-3">
                          <div className={`p-2 rounded-lg bg-${api.color}-100`}>
                            <api.icon className={`h-5 w-5 text-${api.color}-600`} />
                          </div>
                          {api.name}
                          <Badge variant="secondary">Go</Badge>
                        </CardTitle>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm">
                            <Copy className="h-4 w-4" />
                          </Button>
                          <Button variant="outline" size="sm">
                            <ExternalLink className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <CodeBlock
                        language="go"
                        code={code}
                      />
                    </CardContent>
                  </Card>
                );
              })}
            </TabsContent>

            {/* cURL Examples */}
            <TabsContent value="curl" className="space-y-8">
              {Object.entries(curlExamples).map(([apiKey, code]) => {
                const api = apiExamples[apiKey];
                return (
                  <Card key={apiKey} className="overflow-hidden">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="flex items-center gap-3">
                          <div className={`p-2 rounded-lg bg-${api.color}-100`}>
                            <api.icon className={`h-5 w-5 text-${api.color}-600`} />
                          </div>
                          {api.name}
                          <Badge variant="secondary">cURL</Badge>
                        </CardTitle>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm">
                            <Copy className="h-4 w-4" />
                          </Button>
                          <Button variant="outline" size="sm">
                            <ExternalLink className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <CodeBlock
                        language="bash"
                        code={code}
                      />
                    </CardContent>
                  </Card>
                );
              })}
            </TabsContent>
          </Tabs>

          {/* Getting Started Section */}
          <Card className="mt-8">
            <CardHeader>
              <CardTitle>Ready to Start Building?</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                Explore our quantum and resonance APIs with comprehensive examples, interactive playground, and detailed documentation.
              </p>
              <div className="flex gap-3">
                <Button variant="outline">
                  View API Documentation
                </Button>
                <Button variant="outline">
                  Try Interactive Playground
                </Button>
                <Button>
                  Get API Keys
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </Section>
    </PageLayout>
  );
};

export default Examples;