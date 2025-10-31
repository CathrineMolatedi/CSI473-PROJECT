import { Alert, AlertType } from './types';

// Notification Service for SMS, Email, and Push Notifications
export class NotificationService {
  
  // Send Email Notification
  async sendEmail(to: string, subject: string, body: string): Promise<boolean> {
    try {
      // In production, integrate with email service (SendGrid, AWS SES, etc.)
      console.log('Sending email to:', to, 'Subject:', subject);
      
      // Simulate API call
      await this.simulateNetworkCall();
      
      return true;
    } catch (error) {
      console.error('Email send failed:', error);
      return false;
    }
  }

  // Send SMS Notification
  async sendSMS(to: string, message: string): Promise<boolean> {
    try {
      // In production, integrate with SMS gateway (Twilio, Africa's Talking, etc.)
      console.log('Sending SMS to:', to, 'Message:', message);
      
      // Simulate API call
      await this.simulateNetworkCall();
      
      return true;
    } catch (error) {
      console.error('SMS send failed:', error);
      return false;
    }
  }

  // Send Push Notification
  async sendPushNotification(userId: string, title: string, body: string): Promise<boolean> {
    try {
      // In production, integrate with push service (Firebase Cloud Messaging, OneSignal, etc.)
      console.log('Sending push to:', userId, 'Title:', title);
      
      // Check if browser supports notifications
      if ('Notification' in window && Notification.permission === 'granted') {
        new Notification(title, { body });
      }
      
      return true;
    } catch (error) {
      console.error('Push notification failed:', error);
      return false;
    }
  }

  // Send 2FA Code via Email
  async send2FACode(email: string, code: string): Promise<boolean> {
    const subject = 'Your 2FA Code - NeighborGuard';
    const body = `
      Your two-factor authentication code is: ${code}
      
      This code will expire in 10 minutes.
      If you didn't request this code, please contact support immediately.
    `;
    
    return this.sendEmail(email, subject, body);
  }

  // Send Emergency Alert to All Users
  async sendEmergencyAlert(alert: Alert): Promise<void> {
    const promises: Promise<boolean>[] = [];

    // Send to all recipients via multiple channels
    for (const recipientId of alert.recipientIds) {
      // In production, fetch user details and send via their preferred channels
      promises.push(
        this.sendSMS(`+267${recipientId}`, alert.message),
        this.sendPushNotification(recipientId, 'EMERGENCY ALERT', alert.message)
      );
    }

    await Promise.allSettled(promises);
  }

  // Send Patrol Compliance Alert
  async sendPatrolComplianceAlert(officerEmail: string, officerPhone: string, complianceRate: number): Promise<void> {
    const message = `Alert: Your patrol compliance rate is ${complianceRate}%. Please complete your assigned checkpoints.`;
    
    await Promise.all([
      this.sendEmail(officerEmail, 'Patrol Compliance Warning', message),
      this.sendSMS(officerPhone, message)
    ]);
  }

  // Send Payment Overdue Notification
  async sendPaymentOverdueNotification(memberEmail: string, memberPhone: string, daysOverdue: number): Promise<void> {
    const message = `Your subscription payment is ${daysOverdue} days overdue. Please make a payment to avoid account suspension.`;
    
    await Promise.all([
      this.sendEmail(memberEmail, 'Payment Overdue - NeighborGuard', message),
      this.sendSMS(memberPhone, message)
    ]);
  }

  // Send Account Approval Notification
  async sendApprovalNotification(email: string, approved: boolean): Promise<void> {
    const subject = approved ? 'Account Approved' : 'Account Registration Update';
    const message = approved
      ? 'Congratulations! Your NeighborGuard account has been approved. You can now log in.'
      : 'Your account registration is pending review. You will be notified once approved.';
    
    await this.sendEmail(email, subject, message);
  }

  // Request Notification Permission (for browser push)
  async requestNotificationPermission(): Promise<boolean> {
    if ('Notification' in window) {
      const permission = await Notification.requestPermission();
      return permission === 'granted';
    }
    return false;
  }

  private simulateNetworkCall(): Promise<void> {
    return new Promise((resolve) => {
      setTimeout(resolve, 300);
    });
  }
}

export const notificationService = new NotificationService();
