import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, 
  Download, 
  Calendar, 
  CreditCard, 
  FileText, 
  Receipt,
  CheckCircle,
  XCircle,
  Clock,
  DollarSign,
  RefreshCw,
  Plus,
  Edit,
  Trash,
  AlertTriangle
} from 'lucide-react';
import { Button } from '../components/UI/Button';
import { Card } from '../components/UI/Card';
import { TopBar } from '../components/Layout/TopBar';
import { Footer } from '../components/Layout/Footer';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';
import { useSubscriptionStore } from '../stores/subscriptionStore';
import { RevenueCatService } from '../services/revenueCatService';

interface BillingRecord {
  id: string;
  date: string;
  amount: number;
  status: 'paid' | 'pending' | 'failed' | 'refunded';
  description: string;
  invoice_url?: string;
  payment_method: string;
  plan_name: string;
  billing_period: 'monthly' | 'annual';
}

interface PaymentMethod {
  id: string;
  type: 'card' | 'paypal' | 'bank';
  last_four?: string;
  brand?: string;
  expires?: string;
  is_default: boolean;
}

export const BillingHistory: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { subscription, loading: subscriptionLoading } = useSubscriptionStore();
  const [billingHistory, setBillingHistory] = useState<BillingRecord[]>([]);
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [loading, setLoading] = useState(true);
  const [downloadingInvoice, setDownloadingInvoice] = useState<string | null>(null);
  const [restoring, setRestoring] = useState(false);
  const [showAddPaymentMethod, setShowAddPaymentMethod] = useState(false);
  const [showEditPaymentMethod, setShowEditPaymentMethod] = useState<string | null>(null);
  const [showConfirmDelete, setShowConfirmDelete] = useState<string | null>(null);
  const [newCardNumber, setNewCardNumber] = useState('');
  const [newCardExpiry, setNewCardExpiry] = useState('');
  const [newCardCvv, setNewCardCvv] = useState('');
  const [newCardName, setNewCardName] = useState('');
  const [isDefault, setIsDefault] = useState(false);
  const [cardError, setCardError] = useState('');

  useEffect(() => {
    if (user) {
      loadBillingData();
    }
  }, [user]);

  const loadBillingData = async () => {
    if (!user) return;

    try {
      setLoading(true);

      // Get purchase history from RevenueCat service
      const purchaseHistory = await RevenueCatService.getPurchaseHistory(user.id);
      
      // Convert purchase history to billing records
      const billingRecords: BillingRecord[] = purchaseHistory.map((purchase, index) => {
        const planName = purchase.packageIdentifier.includes('reflect_plus') 
          ? 'Reflect+' 
          : purchase.packageIdentifier.includes('resolve_together') 
            ? 'Resolve Together' 
            : 'Unknown Plan';
            
        return {
          id: `inv_${index + 1}`,
          date: purchase.purchaseDate,
          amount: purchase.price,
          status: 'paid',
          description: `${planName} ${purchase.periodType === 'annual' ? 'Annual' : 'Monthly'} Subscription`,
          invoice_url: `https://example.com/invoice/inv_${index + 1}.pdf`,
          payment_method: '**** 4242',
          plan_name: planName,
          billing_period: purchase.periodType === 'annual' ? 'annual' : 'monthly',
        };
      });

      // Get payment methods
      const mockPaymentMethods: PaymentMethod[] = [
        {
          id: 'pm_001',
          type: 'card',
          last_four: '4242',
          brand: 'Visa',
          expires: '12/26',
          is_default: true,
        },
      ];

      // Only show billing history if user has a paid subscription
      if (subscription && subscription.plan_id !== 'awaknow_free') {
        setBillingHistory(billingRecords);
        setPaymentMethods(mockPaymentMethods);
      } else {
        setBillingHistory([]);
        setPaymentMethods([]);
      }
    } catch (error) {
      console.error('Error loading billing data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRestorePurchases = async () => {
    if (!user) return;
    
    setRestoring(true);
    
    try {
      await RevenueCatService.restorePurchases(user.id);
      await loadBillingData();
    } catch (error) {
      console.error('Error restoring purchases:', error);
    } finally {
      setRestoring(false);
    }
  };

  const validateCardNumber = (cardNumber: string): boolean => {
    // Basic validation - remove spaces and check length
    const cleaned = cardNumber.replace(/\s+/g, '');
    if (cleaned.length < 13 || cleaned.length > 19) {
      setCardError('Card number must be between 13 and 19 digits');
      return false;
    }
    
    // Luhn algorithm check
    let sum = 0;
    let shouldDouble = false;
    
    // Loop through values starting from the rightmost digit
    for (let i = cleaned.length - 1; i >= 0; i--) {
      let digit = parseInt(cleaned.charAt(i));
      
      if (shouldDouble) {
        digit *= 2;
        if (digit > 9) digit -= 9;
      }
      
      sum += digit;
      shouldDouble = !shouldDouble;
    }
    
    const isValid = (sum % 10) === 0;
    if (!isValid) {
      setCardError('Invalid card number');
    } else {
      setCardError('');
    }
    
    return isValid;
  };

  const validateExpiry = (expiry: string): boolean => {
    // Format should be MM/YY
    const parts = expiry.split('/');
    if (parts.length !== 2) return false;
    
    const month = parseInt(parts[0], 10);
    const year = parseInt(parts[1], 10) + 2000; // Convert to 20YY
    
    // Check if month is valid
    if (month < 1 || month > 12) {
      setCardError('Invalid expiration month');
      return false;
    }
    
    // Check if date is in the future
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth() + 1; // JS months are 0-indexed
    
    if (year < currentYear || (year === currentYear && month < currentMonth)) {
      setCardError('Card has expired');
      return false;
    }
    
    setCardError('');
    return true;
  };

  const handleAddPaymentMethod = () => {
    // Validate inputs
    if (!validateCardNumber(newCardNumber)) {
      return;
    }
    
    if (!validateExpiry(newCardExpiry)) {
      return;
    }
    
    if (newCardCvv.length < 3) {
      setCardError('CVV must be at least 3 digits');
      return;
    }
    
    if (!newCardName.trim()) {
      setCardError('Cardholder name is required');
      return;
    }

    setCardError('');

    // Create a new payment method
    const newMethod: PaymentMethod = {
      id: `pm_${Math.random().toString(36).substring(2, 15)}`,
      type: 'card',
      last_four: newCardNumber.slice(-4),
      brand: getCardBrand(newCardNumber),
      expires: newCardExpiry,
      is_default: isDefault,
    };

    // If this is the default, update other payment methods
    const updatedMethods = isDefault 
      ? paymentMethods.map(method => ({
          ...method,
          is_default: false
        }))
      : [...paymentMethods];

    // Add the new method
    setPaymentMethods([...updatedMethods, newMethod]);
    
    // Reset form
    setNewCardNumber('');
    setNewCardExpiry('');
    setNewCardCvv('');
    setNewCardName('');
    setIsDefault(false);
    setShowAddPaymentMethod(false);
  };

  const handleEditPaymentMethod = (methodId: string) => {
    const method = paymentMethods.find(m => m.id === methodId);
    if (!method) return;

    // If making this the default, update other methods
    if (!method.is_default) {
      const updatedMethods = paymentMethods.map(m => ({
        ...m,
        is_default: m.id === methodId
      }));
      setPaymentMethods(updatedMethods);
    }

    setShowEditPaymentMethod(null);
  };

  const handleDeletePaymentMethod = (methodId: string) => {
    const method = paymentMethods.find(m => m.id === methodId);
    if (!method) return;

    // Don't allow deleting the default payment method if it's the only one
    if (method.is_default && paymentMethods.length === 1) {
      setCardError("You can't delete your only payment method");
      return;
    }

    // Remove the method
    const updatedMethods = paymentMethods.filter(m => m.id !== methodId);
    
    // If we deleted the default, make another one default
    if (method.is_default && updatedMethods.length > 0) {
      updatedMethods[0].is_default = true;
    }

    setPaymentMethods(updatedMethods);
    setShowConfirmDelete(null);
  };

  const getCardBrand = (cardNumber: string): string => {
    // Card brand detection based on first digit
    const firstDigit = cardNumber.replace(/\s+/g, '').charAt(0);
    
    switch (firstDigit) {
      case '4':
        return 'Visa';
      case '5':
        return 'Mastercard';
      case '3':
        return 'Amex';
      case '6':
        return 'Discover';
      default:
        return 'Card';
    }
  };

  const formatCardNumber = (value: string): string => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = matches && matches[0] || '';
    const parts = [];

    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }

    if (parts.length) {
      return parts.join(' ');
    } else {
      return value;
    }
  };

  const formatExpiry = (value: string): string => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    
    if (v.length >= 2) {
      return `${v.substring(0, 2)}/${v.substring(2, 4)}`;
    }
    
    return v;
  };

  const handleDownloadInvoice = async (invoiceId: string, invoiceUrl?: string) => {
    setDownloadingInvoice(invoiceId);
    
    try {
      // Get invoice data
      const invoiceData = billingHistory.find(record => record.id === invoiceId);
      if (!invoiceData) throw new Error('Invoice not found');
      
      // Generate HTML invoice content
      const invoiceContent = generateInvoiceHTML(invoiceData);
      
      // Create a Blob from the HTML content
      const blob = new Blob([invoiceContent], { type: 'text/html' });
      
      // Create a download link
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = `awaknow-invoice-${invoiceId}.html`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
    } catch (error) {
      console.error('Error downloading invoice:', error);
    } finally {
      setDownloadingInvoice(null);
    }
  };

  const generateInvoiceHTML = (invoice: BillingRecord): string => {
    const invoiceDate = new Date(invoice.date);
    const formattedDate = invoiceDate.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
    
    const dueDate = new Date(invoiceDate);
    dueDate.setDate(dueDate.getDate() + 14);
    const formattedDueDate = dueDate.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
    
    // Generate a unique invoice number
    const invoiceNumber = invoice.id.replace('inv_', 'AWK-');
    
    return `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Invoice ${invoiceNumber}</title>
        <style>
          body {
            font-family: 'Helvetica Neue', Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            margin: 0;
            padding: 0;
            background-color: #f9f9f9;
          }
          .invoice-container {
            max-width: 800px;
            margin: 40px auto;
            padding: 40px;
            background-color: #fff;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
            border-radius: 8px;
          }
          .invoice-header {
            display: flex;
            justify-content: space-between;
            margin-bottom: 40px;
            padding-bottom: 20px;
            border-bottom: 1px solid #eee;
          }
          .company-details h2 {
            color: #0ea5e9;
            margin: 0 0 5px 0;
          }
          .company-details p {
            margin: 0;
            color: #666;
            font-size: 14px;
          }
          .invoice-info {
            text-align: right;
          }
          .invoice-info h1 {
            color: #0ea5e9;
            margin: 0 0 10px 0;
            font-size: 28px;
          }
          .invoice-info p {
            margin: 0;
            font-size: 14px;
          }
          .client-details {
            display: flex;
            justify-content: space-between;
            margin-bottom: 40px;
          }
          .client-details div {
            flex: 1;
          }
          .client-details h3 {
            color: #0ea5e9;
            margin: 0 0 10px 0;
            font-size: 16px;
          }
          .client-details p {
            margin: 0;
            font-size: 14px;
            color: #666;
          }
          .invoice-table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 40px;
          }
          .invoice-table th {
            background-color: #f3f4f6;
            padding: 12px;
            text-align: left;
            font-weight: 600;
            color: #374151;
            font-size: 14px;
          }
          .invoice-table td {
            padding: 12px;
            border-bottom: 1px solid #eee;
            font-size: 14px;
          }
          .invoice-table .amount {
            text-align: right;
          }
          .invoice-summary {
            display: flex;
            justify-content: flex-end;
            margin-bottom: 40px;
          }
          .invoice-summary-table {
            width: 300px;
          }
          .invoice-summary-table td {
            padding: 8px 0;
          }
          .invoice-summary-table .label {
            font-weight: 600;
          }
          .invoice-summary-table .amount {
            text-align: right;
          }
          .invoice-summary-table .total {
            font-size: 18px;
            font-weight: 700;
            color: #0ea5e9;
          }
          .invoice-notes {
            margin-bottom: 40px;
            padding: 20px;
            background-color: #f9f9f9;
            border-radius: 4px;
          }
          .invoice-notes h3 {
            margin: 0 0 10px 0;
            font-size: 16px;
            color: #374151;
          }
          .invoice-notes p {
            margin: 0;
            font-size: 14px;
            color: #666;
          }
          .invoice-footer {
            text-align: center;
            font-size: 14px;
            color: #666;
            margin-top: 40px;
            padding-top: 20px;
            border-top: 1px solid #eee;
          }
          .payment-method {
            margin-bottom: 40px;
          }
          .payment-method h3 {
            margin: 0 0 10px 0;
            font-size: 16px;
            color: #374151;
          }
          .payment-method p {
            margin: 0;
            font-size: 14px;
            color: #666;
          }
          .status-badge {
            display: inline-block;
            padding: 4px 8px;
            border-radius: 4px;
            font-size: 12px;
            font-weight: 600;
            text-transform: uppercase;
          }
          .status-paid {
            background-color: #dcfce7;
            color: #16a34a;
          }
          .status-pending {
            background-color: #fef3c7;
            color: #d97706;
          }
          .status-failed {
            background-color: #fee2e2;
            color: #dc2626;
          }
          .status-refunded {
            background-color: #f3f4f6;
            color: #6b7280;
          }
          @media print {
            body {
              background-color: #fff;
            }
            .invoice-container {
              box-shadow: none;
              margin: 0;
              padding: 20px;
              max-width: 100%;
            }
            .no-print {
              display: none;
            }
          }
        </style>
      </head>
      <body>
        <div class="invoice-container">
          <div class="invoice-header">
            <div class="company-details">
              <h2>AwakNow</h2>
              <p>123 Wellness Way</p>
              <p>San Francisco, CA 94103</p>
              <p>support@awaknow.org</p>
            </div>
            <div class="invoice-info">
              <h1>INVOICE</h1>
              <p><strong>Invoice Number:</strong> ${invoiceNumber}</p>
              <p><strong>Date:</strong> ${formattedDate}</p>
              <p><strong>Due Date:</strong> ${formattedDueDate}</p>
              <p>
                <span class="status-badge status-${invoice.status}">
                  ${invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}
                </span>
              </p>
            </div>
          </div>
          
          <div class="client-details">
            <div>
              <h3>Billed To</h3>
              <p>${user?.email || 'Customer'}</p>
              <p>Customer ID: ${user?.id.substring(0, 8) || 'Unknown'}</p>
            </div>
            <div>
              <h3>Payment Method</h3>
              <p>${invoice.payment_method}</p>
              <p>Payment Date: ${formattedDate}</p>
            </div>
          </div>
          
          <table class="invoice-table">
            <thead>
              <tr>
                <th>Description</th>
                <th>Period</th>
                <th>Plan</th>
                <th class="amount">Amount</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>${invoice.description}</td>
                <td>${invoice.billing_period.charAt(0).toUpperCase() + invoice.billing_period.slice(1)}</td>
                <td>${invoice.plan_name}</td>
                <td class="amount">$${invoice.amount.toFixed(2)}</td>
              </tr>
            </tbody>
          </table>
          
          <div class="invoice-summary">
            <table class="invoice-summary-table">
              <tr>
                <td class="label">Subtotal</td>
                <td class="amount">$${invoice.amount.toFixed(2)}</td>
              </tr>
              <tr>
                <td class="label">Tax</td>
                <td class="amount">$0.00</td>
              </tr>
              <tr>
                <td class="label total">Total</td>
                <td class="amount total">$${invoice.amount.toFixed(2)}</td>
              </tr>
            </table>
          </div>
          
          <div class="payment-method">
            <h3>Payment Information</h3>
            <p>Payment Method: ${invoice.payment_method}</p>
            <p>Transaction ID: txn_${Math.random().toString(36).substring(2, 10)}</p>
          </div>
          
          <div class="invoice-notes">
            <h3>Notes</h3>
            <p>Thank you for your business! This subscription gives you access to premium features including AI-powered emotional wellness tools, unlimited sessions, and personalized insights.</p>
            <p>Your subscription will automatically renew on ${new Date(subscription?.current_period_end || '').toLocaleDateString()}. You can manage your subscription at any time from your account settings.</p>
          </div>
          
          <div class="invoice-footer">
            <p>AwakNow, Inc. • EIN: 12-3456789 • support@awaknow.org • awaknow.org</p>
          </div>
          
          <div class="no-print" style="text-align: center; margin-top: 30px;">
            <button onclick="window.print()" style="padding: 10px 20px; background-color: #0ea5e9; color: white; border: none; border-radius: 4px; cursor: pointer;">
              Print Invoice
            </button>
          </div>
        </div>
      </body>
      </html>
    `;
  };

  const getStatusIcon = (status: BillingRecord['status']) => {
    switch (status) {
      case 'paid':
        return <CheckCircle className="w-4 h-4 text-success-500" />;
      case 'pending':
        return <Clock className="w-4 h-4 text-warning-500" />;
      case 'failed':
        return <XCircle className="w-4 h-4 text-error-500" />;
      case 'refunded':
        return <XCircle className="w-4 h-4 text-neutral-500" />;
      default:
        return <Clock className="w-4 h-4 text-neutral-500" />;
    }
  };

  const getStatusColor = (status: BillingRecord['status']) => {
    switch (status) {
      case 'paid':
        return 'text-success-600 bg-success-50';
      case 'pending':
        return 'text-warning-600 bg-warning-50';
      case 'failed':
        return 'text-error-600 bg-error-50';
      case 'refunded':
        return 'text-neutral-600 bg-neutral-50';
      default:
        return 'text-neutral-600 bg-neutral-50';
    }
  };

  if (loading || subscriptionLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50 flex flex-col">
        <TopBar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="w-8 h-8 border-4 border-primary-200 border-t-primary-500 rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-neutral-600">Loading billing information...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50 flex flex-col">
      <TopBar />
      
      <div className="container mx-auto px-4 py-8 max-w-4xl flex-1">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex items-center justify-between mb-8"
        >
          <Button
            onClick={() => navigate('/subscription')}
            variant="ghost"
            icon={ArrowLeft}
            className="!p-2"
          />
          <div className="text-center">
            <h1 className="text-3xl font-bold text-neutral-800">Billing & History</h1>
            <p className="text-neutral-600">Manage your subscription and download invoices</p>
          </div>
          <div className="w-10"></div>
        </motion.div>

        {/* Current Subscription */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-8"
        >
          <Card>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-neutral-800">Current Subscription</h3>
              <div className="flex space-x-2">
                <Button
                  onClick={handleRestorePurchases}
                  variant="outline"
                  size="sm"
                  icon={RefreshCw}
                  loading={restoring}
                >
                  Restore
                </Button>
                <Button
                  onClick={() => navigate('/subscription')}
                  variant="outline"
                  size="sm"
                >
                  Manage Plan
                </Button>
              </div>
            </div>
            
            {subscription ? (
              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <div className="text-sm text-neutral-600">Plan</div>
                  <div className="font-medium text-neutral-800">{subscription.plan_name}</div>
                </div>
                <div>
                  <div className="text-sm text-neutral-600">Status</div>
                  <div className={`inline-flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium ${
                    subscription.status === 'active' ? 'text-success-600 bg-success-50' : 'text-warning-600 bg-warning-50'
                  }`}>
                    {getStatusIcon(subscription.status as any)}
                    <span className="capitalize">{subscription.status}</span>
                  </div>
                </div>
                <div>
                  <div className="text-sm text-neutral-600">Next Billing</div>
                  <div className="font-medium text-neutral-800">
                    {subscription.plan_id === 'awaknow_free' 
                      ? 'N/A' 
                      : new Date(subscription.current_period_end).toLocaleDateString()
                    }
                  </div>
                </div>
              </div>
            ) : (
              <p className="text-neutral-600">No subscription information available</p>
            )}
          </Card>
        </motion.div>

        {/* Payment Methods */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mb-8"
        >
          <Card>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-neutral-800">Payment Methods</h3>
              <Button 
                variant="outline" 
                size="sm"
                icon={Plus}
                onClick={() => setShowAddPaymentMethod(true)}
              >
                Add Method
              </Button>
            </div>
            
            {paymentMethods.length > 0 ? (
              <div className="space-y-3">
                {paymentMethods.map((method) => (
                  <div key={method.id} className="flex items-center justify-between p-3 border border-neutral-200 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <CreditCard className="w-5 h-5 text-neutral-500" />
                      <div>
                        <div className="font-medium text-neutral-800">
                          {method.brand} ending in {method.last_four}
                        </div>
                        <div className="text-sm text-neutral-600">
                          Expires {method.expires}
                          {method.is_default && (
                            <span className="ml-2 px-2 py-1 bg-primary-100 text-primary-700 rounded-full text-xs">
                              Default
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <Button 
                        variant="ghost" 
                        size="sm"
                        icon={Edit}
                        onClick={() => setShowEditPaymentMethod(method.id)}
                      >
                        Edit
                      </Button>
                      {!method.is_default && (
                        <Button 
                          variant="ghost" 
                          size="sm"
                          icon={Trash}
                          onClick={() => setShowConfirmDelete(method.id)}
                        >
                          Delete
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6">
                <div className="w-12 h-12 bg-neutral-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <CreditCard className="w-6 h-6 text-neutral-400" />
                </div>
                <p className="text-neutral-600 mb-4">No payment methods found</p>
                <Button 
                  variant="outline" 
                  size="sm"
                  icon={Plus}
                  onClick={() => setShowAddPaymentMethod(true)}
                >
                  Add Payment Method
                </Button>
              </div>
            )}

            {/* Add Payment Method Form */}
            {showAddPaymentMethod && (
              <div className="mt-6 p-4 border border-neutral-200 rounded-lg">
                <h4 className="font-medium text-neutral-800 mb-4">Add Payment Method</h4>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-1">
                      Card Number
                    </label>
                    <input
                      type="text"
                      value={formatCardNumber(newCardNumber)}
                      onChange={(e) => setNewCardNumber(e.target.value.replace(/\s/g, ''))}
                      placeholder="1234 5678 9012 3456"
                      className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                      maxLength={19}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-neutral-700 mb-1">
                        Expiry Date
                      </label>
                      <input
                        type="text"
                        value={formatExpiry(newCardExpiry)}
                        onChange={(e) => setNewCardExpiry(e.target.value.replace(/\D/g, ''))}
                        placeholder="MM/YY"
                        className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                        maxLength={5}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-neutral-700 mb-1">
                        CVV
                      </label>
                      <input
                        type="text"
                        value={newCardCvv}
                        onChange={(e) => setNewCardCvv(e.target.value.replace(/\D/g, ''))}
                        placeholder="123"
                        className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                        maxLength={4}
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-1">
                      Cardholder Name
                    </label>
                    <input
                      type="text"
                      value={newCardName}
                      onChange={(e) => setNewCardName(e.target.value)}
                      placeholder="John Doe"
                      className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="default-card"
                      checked={isDefault}
                      onChange={(e) => setIsDefault(e.target.checked)}
                      className="w-4 h-4 text-primary-600 border-neutral-300 rounded focus:ring-primary-500"
                    />
                    <label htmlFor="default-card" className="ml-2 text-sm text-neutral-700">
                      Set as default payment method
                    </label>
                  </div>
                  
                  {cardError && (
                    <div className="p-3 bg-error-50 border border-error-200 rounded-lg flex items-start space-x-2">
                      <AlertTriangle className="w-4 h-4 text-error-500 mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-error-700">{cardError}</span>
                    </div>
                  )}
                  
                  <div className="flex space-x-3">
                    <Button
                      variant="outline"
                      className="flex-1"
                      onClick={() => {
                        setShowAddPaymentMethod(false);
                        setCardError('');
                      }}
                    >
                      Cancel
                    </Button>
                    <Button
                      className="flex-1"
                      onClick={handleAddPaymentMethod}
                      disabled={!newCardNumber || !newCardExpiry || !newCardCvv || !newCardName}
                    >
                      Add Card
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {/* Edit Payment Method Form */}
            {showEditPaymentMethod && (
              <div className="mt-6 p-4 border border-neutral-200 rounded-lg">
                <h4 className="font-medium text-neutral-800 mb-4">Edit Payment Method</h4>
                <div className="space-y-4">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="edit-default-card"
                      checked={true}
                      onChange={() => {}}
                      className="w-4 h-4 text-primary-600 border-neutral-300 rounded focus:ring-primary-500"
                    />
                    <label htmlFor="edit-default-card" className="ml-2 text-sm text-neutral-700">
                      Set as default payment method
                    </label>
                  </div>
                  <div className="flex space-x-3">
                    <Button
                      variant="outline"
                      className="flex-1"
                      onClick={() => setShowEditPaymentMethod(null)}
                    >
                      Cancel
                    </Button>
                    <Button
                      className="flex-1"
                      onClick={() => handleEditPaymentMethod(showEditPaymentMethod)}
                    >
                      Save Changes
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {/* Confirm Delete Modal */}
            {showConfirmDelete && (
              <div className="mt-6 p-4 border border-error-200 bg-error-50 rounded-lg">
                <h4 className="font-medium text-error-800 mb-2">Confirm Deletion</h4>
                <p className="text-sm text-error-700 mb-4">
                  Are you sure you want to delete this payment method? This action cannot be undone.
                </p>
                <div className="flex space-x-3">
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={() => setShowConfirmDelete(null)}
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="error"
                    className="flex-1"
                    onClick={() => handleDeletePaymentMethod(showConfirmDelete)}
                  >
                    Delete
                  </Button>
                </div>
              </div>
            )}
          </Card>
        </motion.div>

        {/* Billing History */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <Card>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-neutral-800">Billing History</h3>
              {billingHistory.length > 0 && (
                <Button variant="outline" size="sm" icon={Download}>
                  Export All
                </Button>
              )}
            </div>

            {billingHistory.length > 0 ? (
              <div className="space-y-4">
                {billingHistory.map((record) => (
                  <div key={record.id} className="flex items-center justify-between p-4 border border-neutral-200 rounded-lg hover:bg-neutral-50 transition-colors">
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
                        <Receipt className="w-5 h-5 text-primary-600" />
                      </div>
                      <div>
                        <div className="font-medium text-neutral-800">{record.description}</div>
                        <div className="flex items-center space-x-4 text-sm text-neutral-600">
                          <span className="flex items-center space-x-1">
                            <Calendar className="w-3 h-3" />
                            <span>{new Date(record.date).toLocaleDateString()}</span>
                          </span>
                          <span className="flex items-center space-x-1">
                            <CreditCard className="w-3 h-3" />
                            <span>{record.payment_method}</span>
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-4">
                      <div className="text-right">
                        <div className="font-medium text-neutral-800">
                          ${record.amount.toFixed(2)}
                        </div>
                        <div className={`inline-flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(record.status)}`}>
                          {getStatusIcon(record.status)}
                          <span className="capitalize">{record.status}</span>
                        </div>
                      </div>
                      
                      <Button
                        onClick={() => handleDownloadInvoice(record.id, record.invoice_url)}
                        variant="ghost"
                        size="sm"
                        icon={Download}
                        loading={downloadingInvoice === record.id}
                      >
                        Invoice
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-neutral-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <FileText className="w-8 h-8 text-neutral-400" />
                </div>
                <h4 className="text-lg font-medium text-neutral-800 mb-2">No Billing History</h4>
                <p className="text-neutral-600 mb-6">
                  {subscription?.plan_id === 'awaknow_free' 
                    ? 'You\'re currently on the free plan. Upgrade to see billing history.'
                    : 'No billing records found for your account.'
                  }
                </p>
                {subscription?.plan_id === 'awaknow_free' && (
                  <Button
                    onClick={() => navigate('/subscription')}
                    icon={DollarSign}
                  >
                    Upgrade Plan
                  </Button>
                )}
              </div>
            )}
          </Card>
        </motion.div>
      </div>

      <Footer />
    </div>
  );
};