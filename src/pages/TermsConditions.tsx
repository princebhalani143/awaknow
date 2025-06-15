import React from 'react';
import { motion } from 'framer-motion';
import { FileText, ArrowLeft, Scale, AlertTriangle, Users, Shield } from 'lucide-react';
import { Button } from '../components/UI/Button';
import { Card } from '../components/UI/Card';
import { TopBar } from '../components/Layout/TopBar';
import { Footer } from '../components/Layout/Footer';
import { useNavigate } from 'react-router-dom';
import { ProtectedEmail } from '../utils/emailProtection';

export const TermsConditions: React.FC = () => {
  const navigate = useNavigate();

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
            onClick={() => navigate(-1)}
            variant="ghost"
            icon={ArrowLeft}
            className="!p-2"
          />
          <h1 className="text-3xl font-bold text-neutral-800">Terms & Conditions</h1>
          <div className="w-10"></div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="space-y-8"
        >
          {/* Introduction */}
          <Card>
            <div className="flex items-center space-x-4 mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-xl flex items-center justify-center">
                <FileText className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-neutral-800">Terms of Service</h2>
                <p className="text-neutral-600">Last updated: {new Date().toLocaleDateString()}</p>
              </div>
            </div>
            <p className="text-neutral-700 leading-relaxed">
              Welcome to AwakNow. These Terms and Conditions ("Terms") govern your use of our emotional wellness platform 
              and AI-powered services available at <a href="https://awaknow.org" className="text-primary-600 hover:text-primary-700 underline">https://awaknow.org</a>. 
              By accessing or using AwakNow, you agree to be bound by these Terms. 
              Please read them carefully before using our services.
            </p>
          </Card>

          {/* Acceptance of Terms */}
          <Card>
            <div className="flex items-center space-x-3 mb-4">
              <Scale className="w-6 h-6 text-primary-500" />
              <h3 className="text-lg font-semibold text-neutral-800">Acceptance of Terms</h3>
            </div>
            <div className="space-y-3 text-neutral-700 text-sm">
              <p>By creating an account or using AwakNow, you acknowledge that you:</p>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>Are at least 18 years old or have parental/guardian consent</li>
                <li>Have the legal capacity to enter into these Terms</li>
                <li>Agree to comply with all applicable laws and regulations</li>
                <li>Understand that AwakNow is a wellness platform, not a substitute for professional medical care</li>
                <li>Consent to our use of tracking technologies (Google Analytics 4, GTM, Facebook, LinkedIn) for website improvement and marketing purposes</li>
              </ul>
            </div>
          </Card>

          {/* Service Description */}
          <Card>
            <h3 className="text-lg font-semibold text-neutral-800 mb-4">Service Description</h3>
            <div className="space-y-4 text-neutral-700 text-sm">
              <div>
                <h4 className="font-medium text-neutral-800 mb-2">AwakNow Platform</h4>
                <p>AwakNow provides AI-powered emotional wellness services including:</p>
                <ul className="list-disc list-inside mt-2 space-y-1 ml-4">
                  <li>Private reflection sessions with AI conversation partners</li>
                  <li>Conflict resolution tools and mediated discussions</li>
                  <li>Emotional tracking and wellness insights</li>
                  <li>Personalized recommendations and growth plans</li>
                  <li>Website analytics and marketing optimization through third-party tracking</li>
                </ul>
              </div>
              <div className="p-4 bg-warning-50 rounded-lg border border-warning-200">
                <div className="flex items-start space-x-3">
                  <AlertTriangle className="w-5 h-5 text-warning-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <strong className="text-warning-800">Important Notice:</strong>
                    <p className="text-warning-700 mt-1">
                      AwakNow is designed for wellness and personal growth. It is not intended to diagnose, treat, cure, 
                      or prevent any medical condition. If you are experiencing a mental health crisis, please contact 
                      emergency services or a qualified healthcare professional immediately.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          {/* User Responsibilities */}
          <Card>
            <div className="flex items-center space-x-3 mb-4">
              <Users className="w-6 h-6 text-secondary-500" />
              <h3 className="text-lg font-semibold text-neutral-800">User Responsibilities</h3>
            </div>
            <div className="space-y-4 text-neutral-700 text-sm">
              <div>
                <h4 className="font-medium text-neutral-800 mb-2">Account Security</h4>
                <ul className="list-disc list-inside space-y-1 ml-4">
                  <li>Maintain the confidentiality of your account credentials</li>
                  <li>Notify us immediately of any unauthorized access</li>
                  <li>Use strong, unique passwords for your account</li>
                  <li>Log out from shared or public devices</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium text-neutral-800 mb-2">Acceptable Use</h4>
                <p>You agree to use AwakNow only for lawful purposes and in accordance with these Terms. You will not:</p>
                <ul className="list-disc list-inside mt-2 space-y-1 ml-4">
                  <li>Share harmful, abusive, or inappropriate content</li>
                  <li>Attempt to reverse engineer or hack our systems</li>
                  <li>Use the platform to harm others or yourself</li>
                  <li>Violate any applicable laws or regulations</li>
                  <li>Share your account with others</li>
                  <li>Interfere with our tracking and analytics systems</li>
                </ul>
              </div>
            </div>
          </Card>

          {/* Privacy & Data */}
          <Card>
            <div className="flex items-center space-x-3 mb-4">
              <Shield className="w-6 h-6 text-success-500" />
              <h3 className="text-lg font-semibold text-neutral-800">Privacy & Data Protection</h3>
            </div>
            <div className="space-y-3 text-neutral-700 text-sm">
              <p>Your privacy is paramount to us. Our data practices are governed by:</p>
              <div className="grid md:grid-cols-2 gap-3">
                <div className="p-3 bg-primary-50 rounded-lg">
                  <strong className="text-primary-800">HIPAA Compliance:</strong> Health information is protected under HIPAA standards
                </div>
                <div className="p-3 bg-secondary-50 rounded-lg">
                  <strong className="text-secondary-800">GDPR Compliance:</strong> EU users have full data protection rights
                </div>
                <div className="p-3 bg-accent-50 rounded-lg">
                  <strong className="text-accent-800">CCPA Compliance:</strong> California users have enhanced privacy rights
                </div>
                <div className="p-3 bg-success-50 rounded-lg">
                  <strong className="text-success-800">Data Security:</strong> End-to-end encryption and secure storage
                </div>
              </div>
              <div className="p-3 bg-warning-50 rounded-lg">
                <strong className="text-warning-800">Marketing & Analytics:</strong> We use Google Analytics 4, Google Tag Manager, Facebook Pixel, LinkedIn Insight Tag, and other tracking technologies to improve our website and deliver relevant marketing content. You can opt out through our cookie preferences.
              </div>
              <p>
                For detailed information about our data practices, please review our{' '}
                <button
                  onClick={() => navigate('/privacy-policy')}
                  className="text-primary-600 hover:text-primary-700 underline"
                >
                  Privacy Policy
                </button>
                .
              </p>
            </div>
          </Card>

          {/* Subscription & Billing */}
          <Card>
            <h3 className="text-lg font-semibold text-neutral-800 mb-4">Subscription & Billing</h3>
            <div className="space-y-4 text-neutral-700 text-sm">
              <div>
                <h4 className="font-medium text-neutral-800 mb-2">Service Tiers</h4>
                <ul className="list-disc list-inside space-y-1 ml-4">
                  <li><strong>Free Tier:</strong> Limited sessions and basic features</li>
                  <li><strong>Premium Tiers:</strong> Unlimited sessions, advanced insights, priority support</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium text-neutral-800 mb-2">Billing Terms</h4>
                <ul className="list-disc list-inside space-y-1 ml-4">
                  <li>Subscriptions are billed monthly or annually in advance</li>
                  <li>Automatic renewal unless cancelled before the next billing cycle</li>
                  <li>Refunds available within 30 days of purchase</li>
                  <li>Price changes will be communicated 30 days in advance</li>
                </ul>
              </div>
            </div>
          </Card>

          {/* Intellectual Property */}
          <Card>
            <h3 className="text-lg font-semibold text-neutral-800 mb-4">Intellectual Property</h3>
            <div className="space-y-3 text-neutral-700 text-sm">
              <div>
                <h4 className="font-medium text-neutral-800 mb-2">Our Rights</h4>
                <p>AwakNow and all related content, features, and functionality are owned by us and protected by copyright, trademark, and other intellectual property laws.</p>
              </div>
              <div>
                <h4 className="font-medium text-neutral-800 mb-2">Your Content</h4>
                <p>You retain ownership of content you create. By using our services, you grant us a limited license to process your content to provide our services and improve our AI models (in anonymized form only). We may also use aggregated, anonymized data for marketing and website improvement purposes.</p>
              </div>
            </div>
          </Card>

          {/* Disclaimers */}
          <Card>
            <h3 className="text-lg font-semibold text-neutral-800 mb-4">Disclaimers & Limitations</h3>
            <div className="space-y-4 text-neutral-700 text-sm">
              <div className="p-4 bg-error-50 rounded-lg border border-error-200">
                <strong className="text-error-800">Medical Disclaimer:</strong>
                <p className="text-error-700 mt-1">
                  AwakNow is not a medical device or healthcare service. Our AI is designed for wellness support, 
                  not medical diagnosis or treatment. Always consult qualified healthcare professionals for medical concerns.
                </p>
              </div>
              <div>
                <h4 className="font-medium text-neutral-800 mb-2">Service Availability</h4>
                <p>We strive for 99.9% uptime but cannot guarantee uninterrupted service. We may temporarily suspend service for maintenance or updates.</p>
              </div>
              <div>
                <h4 className="font-medium text-neutral-800 mb-2">Third-Party Services</h4>
                <p>Our website uses third-party tracking and analytics services (Google, Facebook, LinkedIn, etc.). We are not responsible for the privacy practices or content of these third-party services.</p>
              </div>
              <div>
                <h4 className="font-medium text-neutral-800 mb-2">Limitation of Liability</h4>
                <p>Our liability is limited to the amount you paid for our services in the 12 months preceding any claim. We are not liable for indirect, incidental, or consequential damages.</p>
              </div>
            </div>
          </Card>

          {/* Termination */}
          <Card>
            <h3 className="text-lg font-semibold text-neutral-800 mb-4">Termination</h3>
            <div className="space-y-3 text-neutral-700 text-sm">
              <div>
                <h4 className="font-medium text-neutral-800 mb-2">By You</h4>
                <p>
                  You may terminate your account at any time through your account settings or by contacting{' '}
                  <ProtectedEmail
                    email="info@awaknow.org"
                    subject="Account Termination Request"
                    className="text-primary-600 hover:text-primary-700 underline"
                  />
                  .
                </p>
              </div>
              <div>
                <h4 className="font-medium text-neutral-800 mb-2">By Us</h4>
                <p>We may suspend or terminate accounts that violate these Terms, engage in harmful behavior, or for legal compliance reasons.</p>
              </div>
              <div>
                <h4 className="font-medium text-neutral-800 mb-2">Effect of Termination</h4>
                <p>Upon termination, your access will cease, but we may retain certain data as required by law or our Privacy Policy. Marketing and analytics data may be retained according to third-party platform policies.</p>
              </div>
            </div>
          </Card>

          {/* Governing Law */}
          <Card>
            <h3 className="text-lg font-semibold text-neutral-800 mb-4">Governing Law & Disputes</h3>
            <div className="space-y-3 text-neutral-700 text-sm">
              <p>These Terms are governed by applicable laws. Any disputes will be resolved through:</p>
              <ol className="list-decimal list-inside space-y-1 ml-4">
                <li>Good faith negotiation</li>
                <li>Mediation if negotiation fails</li>
                <li>Binding arbitration as a last resort</li>
              </ol>
              <p>EU users have additional rights under applicable consumer protection laws.</p>
            </div>
          </Card>

          {/* Changes to Terms */}
          <Card>
            <h3 className="text-lg font-semibold text-neutral-800 mb-4">Changes to Terms</h3>
            <p className="text-neutral-700 text-sm">
              We may update these Terms periodically to reflect changes in our services, legal requirements, or business practices. 
              Significant changes will be communicated via email or platform notification at least 30 days before taking effect. 
              Continued use after changes constitutes acceptance of the updated Terms.
            </p>
          </Card>

          {/* Contact Information */}
          <Card>
            <h3 className="text-lg font-semibold text-neutral-800 mb-4">Contact Us</h3>
            <div className="space-y-3 text-neutral-700 text-sm">
              <p>For questions about these Terms:</p>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <strong>Legal Team:</strong><br />
                  Email:{' '}
                  <ProtectedEmail
                    email="info@awaknow.org"
                    subject="Legal Inquiry"
                    className="text-primary-600 hover:text-primary-700 underline"
                  /><br />
                  Response time: Within 5 business days
                </div>
                <div>
                  <strong>Customer Support:</strong><br />
                  Email:{' '}
                  <ProtectedEmail
                    email="info@awaknow.org"
                    subject="Customer Support"
                    className="text-primary-600 hover:text-primary-700 underline"
                  /><br />
                  Response time: Within 24 hours
                </div>
              </div>
            </div>
          </Card>
        </motion.div>
      </div>

      <Footer />
    </div>
  );
};