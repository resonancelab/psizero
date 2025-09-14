import { useNavigate } from "react-router-dom";
import PageLayout from "@/components/layout/PageLayout";
import Section from "@/components/layout/Section";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { XCircle, RefreshCw, ArrowLeft } from "lucide-react";

const PaymentFailed = () => {
  const navigate = useNavigate();

  return (
    <PageLayout>
      <Section padding="lg">
        <div className="max-w-2xl mx-auto text-center">
          <Card>
            <CardHeader className="text-center pb-2">
              <div className="mx-auto w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center mb-4">
                <XCircle className="h-8 w-8 text-destructive" />
              </div>
              <CardTitle className="text-2xl text-foreground">
                Payment Failed
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6 text-center">
              <p className="text-muted-foreground">
                We couldn't process your payment. Please check your payment details and try again.
              </p>
              
              <div className="bg-muted/30 rounded-lg p-4 text-left">
                <h4 className="font-medium mb-2">Common reasons for payment failure:</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Insufficient funds</li>
                  <li>• Expired or invalid card details</li>
                  <li>• Card blocked by your bank</li>
                  <li>• Billing address mismatch</li>
                </ul>
              </div>

              <div className="flex flex-col gap-3">
                <Button 
                  onClick={() => navigate("/plans")}
                  className="w-full"
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Try Again
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => navigate("/contact")}
                  className="w-full"
                >
                  Contact Support
                </Button>
                <Button 
                  variant="ghost" 
                  onClick={() => navigate("/")}
                  className="w-full"
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Home
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </Section>
    </PageLayout>
  );
};

export default PaymentFailed;