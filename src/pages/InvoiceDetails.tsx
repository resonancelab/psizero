import { useParams, useNavigate } from "react-router-dom";
import PageLayout from "@/components/layout/PageLayout";
import Section from "@/components/layout/Section";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, Download, Mail } from "lucide-react";

const InvoiceDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // Mock invoice data - replace with actual data fetching
  const invoice = {
    id: id || "INV-001",
    date: "Nov 15, 2024",
    dueDate: "Nov 15, 2024",
    status: "Paid",
    total: "$49.00",
    plan: "Pro Plan",
    period: "Nov 15 - Dec 15, 2024",
    paymentMethod: "•••• 4242",
  };

  return (
    <PageLayout>
      <Section padding="lg">
        <div className="max-w-3xl mx-auto">
          <div className="mb-6">
            <Button 
              variant="ghost" 
              onClick={() => navigate("/billing")}
              className="mb-4"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Billing
            </Button>
            
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-3xl font-bold text-foreground mb-2">
                  Invoice {invoice.id}
                </h1>
                <p className="text-muted-foreground">
                  Issued on {invoice.date}
                </p>
              </div>
              <Badge 
                variant="secondary" 
                className="bg-api-success/10 text-api-success"
              >
                {invoice.status}
              </Badge>
            </div>
          </div>

          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Invoice Details</CardTitle>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <Mail className="h-4 w-4 mr-2" />
                    Email
                  </Button>
                  <Button variant="outline" size="sm">
                    <Download className="h-4 w-4 mr-2" />
                    Download PDF
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium mb-2">Bill To</h4>
                  <div className="text-sm text-muted-foreground space-y-1">
                    <p>John Doe</p>
                    <p>john@example.com</p>
                    <p>123 Main St</p>
                    <p>New York, NY 10001</p>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-medium mb-2">Invoice Information</h4>
                  <div className="text-sm space-y-1">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Invoice Date:</span>
                      <span>{invoice.date}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Due Date:</span>
                      <span>{invoice.dueDate}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Payment Method:</span>
                      <span>{invoice.paymentMethod}</span>
                    </div>
                  </div>
                </div>
              </div>

              <Separator />

              <div>
                <h4 className="font-medium mb-4">Items</h4>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-medium">{invoice.plan}</p>
                      <p className="text-sm text-muted-foreground">
                        Billing period: {invoice.period}
                      </p>
                    </div>
                    <span className="font-medium">{invoice.total}</span>
                  </div>
                </div>
              </div>

              <Separator />

              <div className="flex justify-between items-center text-lg font-semibold">
                <span>Total</span>
                <span>{invoice.total}</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </Section>
    </PageLayout>
  );
};

export default InvoiceDetails;