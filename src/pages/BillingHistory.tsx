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
  DollarSign
} from 'lucide-react';
import { Button } from '../components/UI/Button';
import { Card } from '../components/UI/Card';
import { TopBar } from '../components/Layout/TopBar';
import { Footer } from '../components/Layout/Footer';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';
import { useSubscriptionStore } from '../stores/subscriptionStore';
import { supabase } from '../lib/supabase';

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

  useEffect(() => {
    if (user) {
      loadBillingData();
    }
  }, [user]);

  const loadBillingData = async () => {
    if (!user) return;

    try {
      setLoading(true);

      // In a real implementation, this would fetch from your billing provider (Stripe, RevenueCat, etc.)
      // For now, we'll create mock data based on the user's subscription
      const mockBillingHistory: BillingRecord[] = [
        {
          id: 'inv_001',
          date: '2024-12-15',
          amount: 9.99,
          status: 'paid',
          description: 'Reflect+ Monthly Subscription',
          invoice_url: 'https://example.com/invoice/inv_001.pdf',
          payment_method: '**** 4242',
          plan_name: 'Reflect+',
          billing_period: 'monthly',
        },
        {
          id: 'inv_002',
          date: '2024-11-15',
          amount: 9.99,
          status: 'paid',
          description: 'Reflect+ Monthly Subscription',
          invoice_url: 'https://example.com/invoice/inv_002.pdf',
          payment_method: '**** 4242',
          plan_name: 'Reflect+',
          billing_period: 'monthly',
        },
        {
          id: 'inv_003',
          date: '2024-10-15',
          amount: 9.99,
          status: 'paid',
          description: 'Reflect+ Monthly Subscription',
          invoice_url: 'https://example.com/invoice/inv_003.pdf',
          payment_method: '**** 4242',
          plan_name: 'Reflect+',
          billing_period: 'monthly',
        },
      ];

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
        setBillingHistory(mockBillingHistory);
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

  const handleDownloadInvoice = async (invoiceId: string, invoiceUrl?: string) => {
    setDownloadingInvoice(invoiceId);
    
    try {
      // In a real implementation, this would download the actual invoice
      // For now, we'll simulate the download
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (invoiceUrl) {
        // Create a mock PDF download
        const link = document.createElement('a');
        link.href = '#'; // In real implementation, this would be the actual invoice URL
        link.download = `invoice-${invoiceId}.pdf`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
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
              <Button
                onClick={() => navigate('/subscription')}
                variant="outline"
                size="sm"
              >
                Manage Plan
              </Button>
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
        {paymentMethods.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mb-8"
          >
            <Card>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-neutral-800">Payment Methods</h3>
                <Button variant="outline" size="sm">
                  Add Method
                </Button>
              </div>
              
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
                    <Button variant="ghost" size="sm">
                      Edit
                    </Button>
                  </div>
                ))}
              </div>
            </Card>
          </motion.div>
        )}

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