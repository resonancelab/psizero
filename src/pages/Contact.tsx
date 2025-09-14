import { useState } from "react";
import PageLayout from "@/components/layout/PageLayout";
import Section from "@/components/layout/Section";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Mail, MessageSquare, Phone, Clock } from "lucide-react";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    priority: "",
    message: ""
  });

  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      // In a real app, this would send to a contact form handler
      // await fetch('/api/contact', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(formData)
      // });
      
      setIsSubmitted(true);
    } catch (error) {
      console.error('Failed to submit contact form:', error);
    }
  };

  if (isSubmitted) {
    return (
      <PageLayout>
        <Section padding="lg">
          <div className="max-w-2xl mx-auto text-center">
            <Card>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  <div className="w-16 h-16 bg-api-success/10 rounded-full flex items-center justify-center mx-auto">
                    <Mail className="h-8 w-8 text-api-success" />
                  </div>
                  <h2 className="text-2xl font-bold">Message Sent!</h2>
                  <p className="text-muted-foreground">
                    Thank you for contacting us. We'll get back to you within 24 hours.
                  </p>
                  <Button onClick={() => setIsSubmitted(false)} variant="outline">
                    Send Another Message
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </Section>
      </PageLayout>
    );
  }

  const contactMethods = [
    {
      icon: Mail,
      title: "Email Support",
      description: "Get help via email",
      details: "support@apiflow.com",
      responseTime: "Within 24 hours"
    },
    {
      icon: MessageSquare,
      title: "Live Chat",
      description: "Chat with our team",
      details: "Available in dashboard",
      responseTime: "Within 2 hours"
    },
    {
      icon: Phone,
      title: "Phone Support",
      description: "Enterprise customers only",
      details: "+1 (555) 123-4567",
      responseTime: "Business hours"
    }
  ];

  return (
    <PageLayout>
      <Section padding="lg">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold text-foreground mb-2">
              Contact Support
            </h1>
            <p className="text-muted-foreground">
              Get in touch with our support team. We're here to help!
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
            {contactMethods.map((method) => {
              const Icon = method.icon;
              return (
                <Card key={method.title}>
                  <CardHeader className="text-center">
                    <div className="mx-auto w-12 h-12 bg-api-secondary/10 rounded-lg flex items-center justify-center mb-2">
                      <Icon className="h-6 w-6 text-api-secondary" />
                    </div>
                    <CardTitle className="text-lg">{method.title}</CardTitle>
                    <CardDescription>{method.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="text-center space-y-2">
                    <p className="font-medium">{method.details}</p>
                    <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                      <Clock className="h-4 w-4" />
                      {method.responseTime}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <Card>
              <CardHeader>
                <CardTitle>Send us a message</CardTitle>
                <CardDescription>
                  Fill out the form below and we'll get back to you as soon as possible
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="name">Name</Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                        required
                      />
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="subject">Subject</Label>
                    <Input
                      id="subject"
                      value={formData.subject}
                      onChange={(e) => setFormData({...formData, subject: e.target.value})}
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="priority">Priority</Label>
                    <Select value={formData.priority} onValueChange={(value) => setFormData({...formData, priority: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select priority level" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">Low</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                        <SelectItem value="urgent">Urgent</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="message">Message</Label>
                    <Textarea
                      id="message"
                      rows={6}
                      value={formData.message}
                      onChange={(e) => setFormData({...formData, message: e.target.value})}
                      placeholder="Describe your issue or question..."
                      required
                    />
                  </div>

                  <Button type="submit" className="w-full">
                    Send Message
                  </Button>
                </form>
              </CardContent>
            </Card>

            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Before you contact us</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-medium mb-2">Check our resources:</h4>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      <li>• <a href="/help" className="text-api-secondary hover:underline">Help Center & FAQ</a></li>
                      <li>• <a href="/docs" className="text-api-secondary hover:underline">API Documentation</a></li>
                      <li>• <a href="/status" className="text-api-secondary hover:underline">Service Status</a></li>
                      <li>• <a href="/getting-started" className="text-api-secondary hover:underline">Getting Started Guide</a></li>
                    </ul>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Support Hours</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Email Support:</span>
                      <span>24/7</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Live Chat:</span>
                      <span>9 AM - 6 PM PST</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Phone Support:</span>
                      <span>Enterprise only</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </Section>
    </PageLayout>
  );
};

export default Contact;