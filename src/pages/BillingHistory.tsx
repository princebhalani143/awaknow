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
  Trash
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
  const [newCardNumber, setNewCardNumber] = useState('');
  const [newCardExpiry, setNewCardExpiry] = useState('');
  const [newCardCvv, setNewCardCvv] = useState('');
  const [newCardName, setNewCardName] = useState('');
  const [isDefault, setIsDefault] = useState(false);

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

  const handleAddPaymentMethod = () => {
    // Validate inputs
    if (newCardNumber.length < 16 || !newCardExpiry || newCardCvv.length < 3 || !newCardName) {
      return;
    }

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
      return;
    }

    // Remove the method
    const updatedMethods = paymentMethods.filter(m => m.id !== methodId);
    
    // If we deleted the default, make another one default
    if (method.is_default && updatedMethods.length > 0) {
      updatedMethods[0].is_default = true;
    }

    setPaymentMethods(updatedMethods);
  };

  const getCardBrand = (cardNumber: string): string => {
    // Very basic card brand detection
    if (cardNumber.startsWith('4')) return 'Visa';
    if (cardNumber.startsWith('5')) return 'Mastercard';
    if (cardNumber.startsWith('3')) return 'Amex';
    if (cardNumber.startsWith('6')) return 'Discover';
    return 'Card';
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
      // In a real implementation, this would download the actual invoice
      // For now, we'll generate a simple PDF invoice
      
      // Create a mock invoice with proper formatting
      const invoiceData = billingHistory.find(record => record.id === invoiceId);
      if (!invoiceData) throw new Error('Invoice not found');
      
      // Generate PDF content
      const invoiceContent = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8" />
          <title>Invoice ${invoiceId}</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              margin: 0;
              padding: 0;
              color: #333;
            }
            .invoice-box {
              max-width: 800px;
              margin: auto;
              padding: 30px;
              border: 1px solid #eee;
              box-shadow: 0 0 10px rgba(0, 0, 0, 0.15);
              font-size: 16px;
              line-height: 24px;
            }
            .invoice-box table {
              width: 100%;
              line-height: inherit;
              text-align: left;
              border-collapse: collapse;
            }
            .invoice-box table td {
              padding: 5px;
              vertical-align: top;
            }
            .invoice-box table tr td:nth-child(2) {
              text-align: right;
            }
            .invoice-box table tr.top table td {
              padding-bottom: 20px;
            }
            .invoice-box table tr.top table td.title {
              font-size: 45px;
              line-height: 45px;
              color: #333;
            }
            .invoice-box table tr.information table td {
              padding-bottom: 40px;
            }
            .invoice-box table tr.heading td {
              background: #eee;
              border-bottom: 1px solid #ddd;
              font-weight: bold;
            }
            .invoice-box table tr.details td {
              padding-bottom: 20px;
            }
            .invoice-box table tr.item td {
              border-bottom: 1px solid #eee;
            }
            .invoice-box table tr.item.last td {
              border-bottom: none;
            }
            .invoice-box table tr.total td:nth-child(2) {
              border-top: 2px solid #eee;
              font-weight: bold;
            }
          </style>
        </head>
        <body>
          <div class="invoice-box">
            <table>
              <tr class="top">
                <td colspan="2">
                  <table>
                    <tr>
                      <td class="title">
                        <img src="https://awaknow.org/favicon.svg" alt="AwakNow Logo" style="width: 100%; max-width: 300px" />
                      </td>
                      <td>
                        Invoice #: ${invoiceId}<br />
                        Created: ${new Date().toLocaleDateString()}<br />
                        Due: ${new Date().toLocaleDateString()}
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
              <tr class="information">
                <td colspan="2">
                  <table>
                    <tr>
                      <td>
                        AwakNow, Inc.<br />
                        123 Wellness Way<br />
                        San Francisco, CA 94103
                      </td>
                      <td>
                        ${user?.email}<br />
                        Customer ID: ${user?.id.substring(0, 8)}
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
              <tr class="heading">
                <td>Payment Method</td>
                <td></td>
              </tr>
              <tr class="details">
                <td>${invoiceData.payment_method}</td>
                <td></td>
              </tr>
              <tr class="heading">
                <td>Item</td>
                <td>Price</td>
              </tr>
              <tr class="item">
                <td>${invoiceData.description}</td>
                <td>$${invoiceData.amount.toFixed(2)}</td>
              </tr>
              <tr class="total">
                <td></td>
                <td>Total: $${invoiceData.amount.toFixed(2)}</td>
              </tr>
            </table>
            <div style="margin-top: 40px; font-size: 14px; color: #777; text-align: center;">
              <p>Thank you for your business with AwakNow!</p>
              <p>If you have any questions, please contact us at support@awaknow.org</p>
            </div>
          </div>
        </body>
        </html>
      `;
      
      // Create a Blob from the HTML content
      const blob = new Blob([invoiceContent], { type: 'text/html' });
      
      // Create a download link
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = `invoice-${invoiceId}.html`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
    } catch (error) {
      console.error('Error downloading invoice:', error);
    } finally {
      setDownloadingInvoice(null);
    }
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
                          onClick={() => handleDeletePaymentMethod(method.id)}
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
                  <div className="flex space-x-3">
                    <Button
                      variant="outline"
                      className="flex-1"
                      onClick={() => setShowAddPaymentMethod(false)}
                    >
                      Cancel
                    </Button>
                    <Button
                      className="flex-1"
                      onClick={handleAddPaymentMethod}
                      disabled={newCardNumber.length < 16 || !newCardExpiry || newCardCvv.length < 3 || !newCardName}
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
                      
                      {record.invoice_url && (
                        <Button
                          onClick={() => handleDownloadInvoice(record.id, record.invoice_url)}
                          variant="ghost"
                          size="sm"
                          icon={Download}
                          loading={downloadingInvoice === record.id}
                        >
                          Invoice
                        </Button>
                      )}
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