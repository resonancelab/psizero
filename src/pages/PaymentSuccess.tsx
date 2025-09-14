import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import PageLayout from "@/components/layout/PageLayout";
import Section from "@/components/layout/Section";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, ArrowRight } from "lucide-react";

const PaymentSuccess = () => {
  const navigate = useNavigate();

  return (
    <PageLayout>
      <Section padding="lg">
        <div className="max-w-2xl mx-auto text-center">
          <Card>
            <CardHeader className="text-center pb-2">
              <div className="mx-auto w-16 h-16 bg-api-success/10 rounded-full flex items-center justify-center mb-4">
                <CheckCircle className="h-8 w-8 text-api-success" />
              </div>
              <CardTitle className="text-2xl text-foreground">
                Payment Successful!
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6 text-center">
              <p className="text-muted-foreground">
                Your payment has been processed successfully. Your account has been upgraded.
              </p>
              
              <div className="bg-muted/30 rounded-lg p-4 space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Plan</span>
                  <Badge className="bg-api-secondary/10 text-api-secondary">Pro Plan</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Amount</span>
                  <span className="font-medium">$49.00</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Next billing</span>
                  <span className="font-medium">Dec 15, 2024</span>
                </div>
              </div>

              <div className="flex flex-col gap-3">
                <Button 
                  onClick={() => navigate("/dashboard")}
                  className="w-full"
                >
                  Go to Dashboard
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => navigate("/billing")}
                  className="w-full"
                >
                  View Billing Details
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </Section>
    </PageLayout>
  );
};

export default PaymentSuccess;