import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Download, Receipt } from "lucide-react";
import { Invoice } from "@/hooks/useDashboard";

interface InvoicesDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  invoices: Invoice[];
}

const InvoicesDialog = ({ open, onOpenChange, invoices }: InvoicesDialogProps) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid': return 'bg-api-success/10 text-api-success';
      case 'pending': return 'bg-api-warning/10 text-api-warning';
      case 'failed': return 'bg-destructive/10 text-destructive';
      case 'cancelled': return 'bg-muted/10 text-muted-foreground';
      default: return 'bg-muted/10 text-muted-foreground';
    }
  };

  const formatAmount = (amountCents: number, currency: string) => {
    const amount = amountCents / 100;
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency || 'USD',
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const downloadInvoice = (invoiceNumber: string) => {
    // In a real app, this would download the actual PDF
    const link = document.createElement('a');
    link.href = '#';
    link.download = `invoice-${invoiceNumber}.pdf`;
    link.click();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Receipt className="h-5 w-5 text-api-secondary" />
            All Invoices
          </DialogTitle>
          <DialogDescription>
            View and download all your invoices and payment history.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {invoices.length === 0 ? (
            <div className="text-center py-8">
              <Receipt className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No invoices found</p>
            </div>
          ) : (
            <div className="border rounded-lg overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Invoice</TableHead>
                    <TableHead>Plan</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {invoices.map((invoice) => (
                    <TableRow key={invoice.id}>
                      <TableCell className="font-mono text-sm">
                        {invoice.invoice_number}
                      </TableCell>
                      <TableCell>{invoice.plan_name}</TableCell>
                      <TableCell className="font-medium">
                        {formatAmount(invoice.amount_cents, invoice.currency)}
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(invoice.status)}>
                          {invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {formatDate(invoice.created_at)}
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => downloadInvoice(invoice.invoice_number)}
                          disabled={invoice.status !== 'paid'}
                        >
                          <Download className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default InvoicesDialog;