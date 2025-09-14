import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Code, ArrowRight, Building, User, Zap } from 'lucide-react';

const Onboarding = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    company: '',
    role: '',
    useCase: '',
    experience: ''
  });
  const navigate = useNavigate();

  const handleNext = () => {
    if (step < 3) {
      setStep(step + 1);
    } else {
      // Complete onboarding
      navigate('/dashboard');
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <Card className="shadow-elegant">
            <CardHeader>
              <CardTitle className="flex items-center">
                <User className="w-5 h-5 mr-2 text-api-secondary" />
                Tell us about yourself
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name</Label>
                  <Input
                    id="firstName"
                    placeholder="Enter your first name"
                    value={formData.firstName}
                    onChange={(e) => handleInputChange('firstName', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input
                    id="lastName"
                    placeholder="Enter your last name"
                    value={formData.lastName}
                    onChange={(e) => handleInputChange('lastName', e.target.value)}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="company">Company (Optional)</Label>
                <Input
                  id="company"
                  placeholder="Enter your company name"
                  value={formData.company}
                  onChange={(e) => handleInputChange('company', e.target.value)}
                />
              </div>
            </CardContent>
          </Card>
        );

      case 2:
        return (
          <Card className="shadow-elegant">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Building className="w-5 h-5 mr-2 text-api-secondary" />
                What's your role?
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <RadioGroup
                value={formData.role}
                onValueChange={(value) => handleInputChange('role', value)}
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="developer" id="developer" />
                  <Label htmlFor="developer">Developer</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="designer" id="designer" />
                  <Label htmlFor="designer">Designer</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="product-manager" id="product-manager" />
                  <Label htmlFor="product-manager">Product Manager</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="founder" id="founder" />
                  <Label htmlFor="founder">Founder/Entrepreneur</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="other" id="other" />
                  <Label htmlFor="other">Other</Label>
                </div>
              </RadioGroup>
            </CardContent>
          </Card>
        );

      case 3:
        return (
          <Card className="shadow-elegant">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Zap className="w-5 h-5 mr-2 text-api-secondary" />
                How do you plan to use APIFlow?
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <RadioGroup
                value={formData.useCase}
                onValueChange={(value) => handleInputChange('useCase', value)}
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="web-app" id="web-app" />
                  <Label htmlFor="web-app">Building a web application</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="mobile-app" id="mobile-app" />
                  <Label htmlFor="mobile-app">Building a mobile application</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="integration" id="integration" />
                  <Label htmlFor="integration">API integration for existing system</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="prototype" id="prototype" />
                  <Label htmlFor="prototype">Prototyping and testing</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="learning" id="learning" />
                  <Label htmlFor="learning">Learning and exploration</Label>
                </div>
              </RadioGroup>
            </CardContent>
          </Card>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <div className="inline-flex items-center space-x-2 mb-8">
            <Code className="h-8 w-8 text-api-secondary" />
            <span className="font-bold text-2xl text-foreground">APIFlow</span>
          </div>
          <h2 className="text-3xl font-bold tracking-tight">Welcome to APIFlow!</h2>
          <p className="mt-2 text-muted-foreground">
            Let's get you set up in just a few steps.
          </p>
          
          {/* Progress indicator */}
          <div className="flex justify-center mt-6 space-x-2">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className={`w-3 h-3 rounded-full ${
                  i <= step ? 'bg-api-secondary' : 'bg-muted'
                }`}
              />
            ))}
          </div>
          <p className="text-sm text-muted-foreground mt-2">
            Step {step} of 3
          </p>
        </div>

        {renderStep()}

        <div className="flex justify-between">
          {step > 1 && (
            <Button
              variant="outline"
              onClick={() => setStep(step - 1)}
            >
              Back
            </Button>
          )}
          <Button
            onClick={handleNext}
            className="ml-auto bg-gradient-hero"
            disabled={
              (step === 1 && !formData.firstName) ||
              (step === 2 && !formData.role) ||
              (step === 3 && !formData.useCase)
            }
          >
            {step === 3 ? 'Complete Setup' : 'Next'}
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Onboarding;