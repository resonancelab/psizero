import PageLayout from "@/components/layout/PageLayout";
import Section from "@/components/layout/Section";
import WebhookConfiguration from "@/components/WebhookConfiguration";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Webhook, Zap, Shield, Clock, CheckCircle } from "lucide-react";

const Webhooks = () => {
  return (
    <PageLayout>
      <Section>
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-foreground mb-4 flex items-center">
              <Webhook className="h-10 w-10 text-api-secondary mr-3" />
              Webhook Management
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl">
              Configure webhooks to receive real-time notifications about resonance API events, 
              session convergence, and system state changes across all platform categories.
            </p>
          </div>

          {/* Platform Overview */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardHeader className="pb-2">
                <CardDescription>Real-time Events</CardDescription>
                <CardTitle className="text-2xl text-blue-600">
                  <Zap className="h-6 w-6 inline mr-2" />
                  4
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">Available event types</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardDescription>Security</CardDescription>
                <CardTitle className="text-2xl text-green-600">
                  <Shield className="h-6 w-6 inline mr-2" />
                  HMAC
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">Signature verification</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardDescription>Reliability</CardDescription>
                <CardTitle className="text-2xl text-purple-600">
                  <Clock className="h-6 w-6 inline mr-2" />
                  3x
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">Auto-retry attempts</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardDescription>Delivery</CardDescription>
                <CardTitle className="text-2xl text-emerald-600">
                  <CheckCircle className="h-6 w-6 inline mr-2" />
                  99.9%
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">Success rate</p>
              </CardContent>
            </Card>
          </div>

          {/* Event Categories Overview */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Resonance API Events</CardTitle>
              <CardDescription>
                Subscribe to real-time notifications from our resonance-based API categories
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold">Solver Events</h4>
                    <Badge className="bg-blue-100 text-blue-800">SRS</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">
                    Notifications when symbolic resonance problems are solved or reach convergence
                  </p>
                  <div className="text-xs text-muted-foreground">
                    • <code>srs.collapse</code> - Solution found or unsatisfiability determined
                  </div>
                </div>
                
                <div className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold">Communication Events</h4>
                    <Badge className="bg-green-100 text-green-800">NLC</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">
                    Alerts when non-local communication channels achieve stable resonance
                  </p>
                  <div className="text-xs text-muted-foreground">
                    • <code>nlc.stable</code> - Channel reaches stable resonance state
                  </div>
                </div>
                
                <div className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold">Consciousness Events</h4>
                    <Badge className="bg-purple-100 text-purple-800">QCR</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">
                    Updates on quantum consciousness resonator triadic convergence
                  </p>
                  <div className="text-xs text-muted-foreground">
                    • <code>qcr.converged</code> - Triadic resonance stabilizes
                  </div>
                </div>
                
                <div className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold">Oracle Events</h4>
                    <Badge className="bg-orange-100 text-orange-800">I-Ching</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">
                    Notifications when hexagram sequences reach stable attractors
                  </p>
                  <div className="text-xs text-muted-foreground">
                    • <code>iching.stabilized</code> - Sequence reaches attractor
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Webhook Configuration Component */}
          <WebhookConfiguration />

          {/* Implementation Guide */}
          <Card className="mt-8">
            <CardHeader>
              <CardTitle>Implementation Guide</CardTitle>
              <CardDescription>
                Quick guide to implementing webhook receivers for Nomyx Resonance events
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <h4 className="font-semibold mb-2">1. Webhook Signature Verification</h4>
                  <div className="bg-gray-900 text-gray-100 p-4 rounded-lg text-sm">
                    <pre>{`// Verify webhook signature (Node.js example)
const crypto = require('crypto');

function verifyWebhookSignature(payload, signature, secret) {
  const expectedSignature = crypto
    .createHmac('sha256', secret)
    .update(payload, 'utf8')
    .digest('hex');
  
  return crypto.timingSafeEqual(
    Buffer.from(signature, 'hex'),
    Buffer.from(expectedSignature, 'hex')
  );
}

// Express.js webhook handler
app.post('/webhooks/nomyx', (req, res) => {
  const signature = req.headers['x-nomyx-signature'];
  const isValid = verifyWebhookSignature(
    JSON.stringify(req.body), 
    signature, 
    process.env.WEBHOOK_SECRET
  );
  
  if (!isValid) {
    return res.status(401).send('Invalid signature');
  }
  
  // Process the webhook event
  const { event, data } = req.body;
  console.log(\`Received \${event}:\`, data);
  
  res.status(200).send('OK');
});`}</pre>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold mb-2">2. Event Handling Examples</h4>
                  <div className="bg-gray-900 text-gray-100 p-4 rounded-lg text-sm">
                    <pre>{`// Handle different event types
switch (event) {
  case 'srs.collapse':
    // Process SRS solution
    if (data.feasible) {
      console.log('Solution found:', data.certificate);
    } else {
      console.log('Problem unsatisfiable');
    }
    break;
    
  case 'nlc.stable':
    // Handle stable NLC channel
    console.log(\`Channel \${data.sessionId} stable at \${data.channelQuality}\`);
    break;
    
  case 'qcr.converged':
    // Process QCR convergence
    console.log(\`QCR session converged after \${data.iteration} iterations\`);
    break;
    
  case 'iching.stabilized':
    // Handle I-Ching stabilization
    console.log(\`Hexagram stabilized: \${data.finalHexagram}\`);
    break;
}`}</pre>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold mb-2">3. Best Practices</h4>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li>• Always verify webhook signatures to ensure authenticity</li>
                    <li>• Respond with HTTP 200 status to acknowledge receipt</li>
                    <li>• Implement idempotency to handle duplicate deliveries</li>
                    <li>• Use HTTPS endpoints for secure communication</li>
                    <li>• Handle webhook processing asynchronously for better performance</li>
                    <li>• Log webhook events for debugging and monitoring</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </Section>
    </PageLayout>
  );
};

export default Webhooks;