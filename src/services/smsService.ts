// Free SMS service using a mock implementation
// In production, you would integrate with services like Twilio, AWS SNS, or other providers
// For now, we'll simulate the SMS sending process

interface SMSResponse {
  success: boolean;
  message: string;
  verificationCode?: string;
}

// Mock SMS service for development/testing
export class FreeSMSService {
  private static instance: FreeSMSService;
  private verificationCodes: Map<string, { code: string; timestamp: number }> = new Map();

  static getInstance(): FreeSMSService {
    if (!FreeSMSService.instance) {
      FreeSMSService.instance = new FreeSMSService();
    }
    return FreeSMSService.instance;
  }

  async sendVerificationCode(phoneNumber: string): Promise<SMSResponse> {
    try {
      // Generate a 6-digit verification code
      const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
      
      // Store the code with timestamp (expires in 10 minutes)
      this.verificationCodes.set(phoneNumber, {
        code: verificationCode,
        timestamp: Date.now()
      });

      // In a real implementation, you would send the SMS here
      // For development, we'll log it to console
      console.log(`SMS Verification Code for ${phoneNumber}: ${verificationCode}`);
      
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      return {
        success: true,
        message: 'Verification code sent successfully',
        verificationCode // Only for development - remove in production
      };
    } catch (error) {
      return {
        success: false,
        message: 'Failed to send verification code'
      };
    }
  }

  async verifyCode(phoneNumber: string, code: string): Promise<boolean> {
    const stored = this.verificationCodes.get(phoneNumber);
    
    if (!stored) {
      return false;
    }

    // Check if code has expired (10 minutes)
    const isExpired = Date.now() - stored.timestamp > 10 * 60 * 1000;
    if (isExpired) {
      this.verificationCodes.delete(phoneNumber);
      return false;
    }

    // Verify the code
    const isValid = stored.code === code;
    if (isValid) {
      this.verificationCodes.delete(phoneNumber);
    }

    return isValid;
  }
}

// Alternative: Integration with free SMS services
// You can integrate with services like:
// 1. TextBelt (free tier available)
// 2. SMS77 (free credits)
// 3. Vonage (free trial)
// 4. MessageBird (free trial)

export const smsService = FreeSMSService.getInstance();