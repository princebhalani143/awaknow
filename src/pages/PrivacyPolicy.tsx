import React from 'react';
import { motion } from 'framer-motion';
import { Shield, ArrowLeft, Eye, Lock, Database, Globe } from 'lucide-react';
import { Button } from '../components/UI/Button';
import { Card } from '../components/UI/Card';
import { TopBar } from '../components/Layout/TopBar';
import { Footer } from '../components/Layout/Footer';
import { useNavigate } from 'react-router-dom';

export const PrivacyPolicy: React.FC = () => {
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
          <h1 className="text-3xl font-bold text-neutral-800">Privacy Policy</h1>
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
                <Shield className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-neutral-800">Your Privacy Matters</h2>
                <p className="text-neutral-600">Last updated: {new Date().toLocaleDateString()}</p>
              </div>
            </div>
            <p className="text-neutral-700 leading-relaxed">
              At AwakNow, we are committed to protecting your privacy and ensuring the security of your personal information. 
              This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our 
              emotional wellness platform. We comply with GDPR, CCPA, HIPAA, and other applicable privacy regulations.
            </p>
          </Card>

          {/* Information We Collect */}
          <Card>
            <div className="flex items-center space-x-3 mb-4">
              <Database className="w-6 h-6 text-primary-500" />
              <h3 className="text-lg font-semibold text-neutral-800">Information We Collect</h3>
            </div>
            <div className="space-y-4 text-neutral-700">
              <div>
                <h4 className="font-medium text-neutral-800 mb-2">Personal Information</h4>
                <ul className="list-disc list-inside space-y-1 text-sm">
                  <li>Name and email address (provided during registration)</li>
                  <li>Account preferences and settings</li>
                  <li>Communication preferences</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium text-neutral-800 mb-2">Health Information (HIPAA Protected)</h4>
                <ul className="list-disc list-inside space-y-1 text-sm">
                  <li>Emotional wellness session data</li>
                  <li>Reflection entries and AI conversation transcripts</li>
                  <li>Emotional state tracking and sentiment analysis</li>
                  <li>Voice recordings (when explicitly consented)</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium text-neutral-800 mb-2">Technical Information</h4>
                <ul className="list-disc list-inside space-y-1 text-sm">
                  <li>Device information and browser type</li>
                  <li>IP address and location data (anonymized)</li>
                  <li>Usage patterns and session analytics</li>
                  <li>Cookies and similar tracking technologies</li>
                </ul>
              </div>
            </div>
          </Card>

          {/* How We Use Information */}
          <Card>
            <div className="flex items-center space-x-3 mb-4">
              <Eye className="w-6 h-6 text-secondary-500" />
              <h3 className="text-lg font-semibold text-neutral-800">How We Use Your Information</h3>
            </div>
            <div className="space-y-3 text-neutral-700 text-sm">
              <div className="p-3 bg-primary-50 rounded-lg">
                <strong className="text-primary-800">Service Provision:</strong> To provide personalized AI-powered emotional wellness sessions and insights
              </div>
              <div className="p-3 bg-secondary-50 rounded-lg">
                <strong className="text-secondary-800">Account Management:</strong> To create and manage your account, authenticate access, and provide customer support
              </div>
              <div className="p-3 bg-accent-50 rounded-lg">
                <strong className="text-accent-800">Improvement:</strong> To analyze usage patterns and improve our AI models and platform functionality
              </div>
              <div className="p-3 bg-neutral-50 rounded-lg">
                <strong className="text-neutral-800">Communication:</strong> To send important updates, security alerts, and service notifications (with your consent)
              </div>
            </div>
          </Card>

          {/* Data Protection & Security */}
          <Card>
            <div className="flex items-center space-x-3 mb-4">
              <Lock className="w-6 h-6 text-success-500" />
              <h3 className="text-lg font-semibold text-neutral-800">Data Protection & Security</h3>
            </div>
            <div className="space-y-4 text-neutral-700">
              <div>
                <h4 className="font-medium text-neutral-800 mb-2">Security Measures</h4>
                <ul className="list-disc list-inside space-y-1 text-sm">
                  <li>End-to-end encryption for all sensitive data</li>
                  <li>Secure cloud infrastructure with SOC 2 compliance</li>
                  <li>Regular security audits and penetration testing</li>
                  <li>Multi-factor authentication and access controls</li>
                  <li>HIPAA-compliant data handling procedures</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium text-neutral-800 mb-2">Data Retention</h4>
                <p className="text-sm">
                  We retain your personal data only as long as necessary to provide our services and comply with legal obligations. 
                  Health information is retained according to HIPAA requirements. You can request data deletion at any time.
                </p>
              </div>
            </div>
          </Card>

          {/* Your Rights */}
          <Card>
            <div className="flex items-center space-x-3 mb-4">
              <Globe className="w-6 h-6 text-warning-500" />
              <h3 className="text-lg font-semibold text-neutral-800">Your Privacy Rights</h3>
            </div>
            <div className="grid md:grid-cols-2 gap-4 text-sm">
              <div className="space-y-3">
                <div className="p-3 bg-primary-50 rounded-lg">
                  <strong className="text-primary-800">GDPR Rights (EU Users):</strong>
                  <ul className="list-disc list-inside mt-2 space-y-1 text-primary-700">
                    <li>Right to access your data</li>
                    <li>Right to rectification</li>
                    <li>Right to erasure ("right to be forgotten")</li>
                    <li>Right to data portability</li>
                    <li>Right to object to processing</li>
                  </ul>
                </div>
              </div>
              <div className="space-y-3">
                <div className="p-3 bg-secondary-50 rounded-lg">
                  <strong className="text-secondary-800">CCPA Rights (California Users):</strong>
                  <ul className="list-disc list-inside mt-2 space-y-1 text-secondary-700">
                    <li>Right to know what data is collected</li>
                    <li>Right to delete personal information</li>
                    <li>Right to opt-out of data sales</li>
                    <li>Right to non-discrimination</li>
                  </ul>
                </div>
              </div>
            </div>
            <div className="mt-4 p-4 bg-success-50 rounded-lg">
              <p className="text-success-800 text-sm">
                <strong>Exercise Your Rights:</strong> Contact us at privacy@awaknow.com to exercise any of these rights. 
                We will respond within 30 days and verify your identity before processing requests.
              </p>
            </div>
          </Card>

          {/* Cookies & Tracking */}
          <Card>
            <h3 className="text-lg font-semibold text-neutral-800 mb-4">Cookies & Tracking Technologies</h3>
            <div className="space-y-3 text-neutral-700 text-sm">
              <p>We use cookies and similar technologies to enhance your experience:</p>
              <div className="grid md:grid-cols-3 gap-3">
                <div className="p-3 bg-neutral-50 rounded-lg">
                  <strong>Essential Cookies:</strong> Required for basic functionality and security
                </div>
                <div className="p-3 bg-neutral-50 rounded-lg">
                  <strong>Analytics Cookies:</strong> Help us understand usage patterns (with consent)
                </div>
                <div className="p-3 bg-neutral-50 rounded-lg">
                  <strong>Preference Cookies:</strong> Remember your settings and preferences
                </div>
              </div>
              <p className="text-xs text-neutral-600">
                You can manage cookie preferences through our cookie consent banner or your browser settings.
              </p>
            </div>
          </Card>

          {/* Third-Party Services */}
          <Card>
            <h3 className="text-lg font-semibold text-neutral-800 mb-4">Third-Party Services</h3>
            <div className="space-y-3 text-neutral-700 text-sm">
              <p>We work with trusted partners who help us provide our services:</p>
              <ul className="list-disc list-inside space-y-1">
                <li><strong>Supabase:</strong> Secure database and authentication services</li>
                <li><strong>AI Providers:</strong> For emotional analysis and conversation capabilities</li>
                <li><strong>Analytics Services:</strong> For usage insights and platform improvement</li>
              </ul>
              <p className="text-xs text-neutral-600">
                All third-party services are bound by strict data processing agreements and privacy standards.
              </p>
            </div>
          </Card>

          {/* International Transfers */}
          <Card>
            <h3 className="text-lg font-semibold text-neutral-800 mb-4">International Data Transfers</h3>
            <p className="text-neutral-700 text-sm">
              Your data may be processed in countries outside your residence. We ensure adequate protection through:
            </p>
            <ul className="list-disc list-inside mt-2 space-y-1 text-neutral-700 text-sm">
              <li>Standard Contractual Clauses (SCCs) for EU data transfers</li>
              <li>Adequacy decisions where applicable</li>
              <li>Additional safeguards for sensitive health information</li>
            </ul>
          </Card>

          {/* Contact Information */}
          <Card>
            <h3 className="text-lg font-semibold text-neutral-800 mb-4">Contact Us</h3>
            <div className="space-y-3 text-neutral-700 text-sm">
              <p>For privacy-related questions or to exercise your rights:</p>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <strong>Privacy Officer:</strong><br />
                  Email: privacy@awaknow.com<br />
                  Response time: Within 30 days
                </div>
                <div>
                  <strong>Data Protection Officer (EU):</strong><br />
                  Email: dpo@awaknow.com<br />
                  For GDPR-related inquiries
                </div>
              </div>
            </div>
          </Card>

          {/* Updates */}
          <Card>
            <h3 className="text-lg font-semibold text-neutral-800 mb-4">Policy Updates</h3>
            <p className="text-neutral-700 text-sm">
              We may update this Privacy Policy periodically. We will notify you of significant changes via email 
              or through our platform. Your continued use of AwakNow after changes constitutes acceptance of the updated policy.
            </p>
          </Card>
        </motion.div>
      </div>

      <Footer />
    </div>
  );
};