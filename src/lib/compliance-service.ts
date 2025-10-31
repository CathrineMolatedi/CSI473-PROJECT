import { SecurityOfficer, Resident, UserStatus, PaymentStatus } from './types';
import { notificationService } from './notification-service';

export class ComplianceService {
  checkOfficerCompliance(officer: SecurityOfficer): { compliant: boolean; reason?: string } {
    const targetScans = officer.targetScans || 20;
    const scansThisWeek = officer.scansThisWeek || 0;
    const complianceRate = (scansThisWeek / targetScans) * 100;
    
    if (complianceRate < 70) {
      return {
        compliant: false,
        reason: `Low patrol compliance: ${complianceRate.toFixed(1)}% of target scans completed`
      };
    }

    return { compliant: true };
  }

  checkResidentPayment(resident: Resident): { compliant: boolean; daysOverdue?: number } {
    const today = new Date();
    const dueDate = new Date(resident.subscriptionEndDate || new Date());
    const daysOverdue = Math.floor((today.getTime() - dueDate.getTime()) / (1000 * 60 * 60 * 24));
    
    if (daysOverdue > 60) {
      return { compliant: false, daysOverdue };
    }

    if (daysOverdue > 0) {
      notificationService.sendPaymentReminder(resident.email, resident.username, daysOverdue);
    }

    return { compliant: true };
  }

  async performComplianceCheck(): Promise<void> {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    
    for (const user of users) {
      if (user.userType === 'officer' && user.status === UserStatus.ACTIVE) {
        const compliance = this.checkOfficerCompliance(user);
        if (!compliance.compliant) {
          user.status = UserStatus.SUSPENDED;
          await notificationService.sendSuspensionAlert(user.email, user.username, compliance.reason!);
          
          const admins = users.filter((u: any) => u.userType === 'admin');
          for (const admin of admins) {
            await notificationService.sendEmail(
              admin.email,
              'Officer Suspension Alert',
              `Officer ${user.username} has been automatically suspended. Reason: ${compliance.reason}`
            );
          }
        }
      }

      if (user.userType === 'resident' && user.status === UserStatus.ACTIVE) {
        const paymentCompliance = this.checkResidentPayment(user);
        if (!paymentCompliance.compliant && paymentCompliance.daysOverdue! > 60) {
          user.status = UserStatus.SUSPENDED;
          await notificationService.sendSuspensionAlert(
            user.email, 
            user.username, 
            `Payment overdue by ${paymentCompliance.daysOverdue} days`
          );
        }
      }
    }

    localStorage.setItem('users', JSON.stringify(users));
  }

  getComplianceReport() {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const officers = users.filter((u: any) => u.userType === 'officer');
    const residents = users.filter((u: any) => u.userType === 'resident');
    
    const officerStats = officers.map((officer: any) => ({
      name: officer.username,
      complianceRate: ((officer.scansThisWeek / (officer.targetScans || 20)) * 100).toFixed(1),
      status: officer.status
    }));

    const residentStats = residents.map((resident: any) => ({
      name: resident.username,
      paymentStatus: resident.paymentStatus || PaymentStatus.ACTIVE,
      subscriptionEndDate: resident.subscriptionEndDate
    }));

    return {
      officers: officerStats,
      residents: residentStats,
      generatedAt: new Date().toISOString()
    };
  }
}

export const complianceService = new ComplianceService();