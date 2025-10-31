import { PatrolScan, SecurityOfficer, UserStatus } from './types';
import { notificationService } from './notification-service';

// Compliance Monitoring and Automatic Suspension System
export class ComplianceMonitor {
  private readonly MIN_COMPLIANCE_RATE = 70; // 70% minimum
  private readonly SUSPENSION_DURATION_DAYS = 7;

  // Calculate Officer Compliance Rate
  calculateComplianceRate(
    assignedHouses: string[],
    scans: PatrolScan[]
  ): number {
    if (assignedHouses.length === 0) return 100;

    const scannedHouses = new Set(scans.map(scan => scan.houseId));
    const scannedCount = assignedHouses.filter(houseId => 
      scannedHouses.has(houseId)
    ).length;

    return Math.round((scannedCount / assignedHouses.length) * 100);
  }

  // Check and Enforce Compliance
  async checkCompliance(
    officer: SecurityOfficer,
    todayScans: PatrolScan[]
  ): Promise<{
    compliant: boolean;
    complianceRate: number;
    action: 'none' | 'warning' | 'suspended';
  }> {
    const complianceRate = this.calculateComplianceRate(
      officer.assignedHouses,
      todayScans
    );

    // Update officer's compliance rate
    officer.complianceRate = complianceRate;

    if (complianceRate < this.MIN_COMPLIANCE_RATE) {
      // Automatically suspend officer
      await this.suspendOfficer(officer, complianceRate);
      
      return {
        compliant: false,
        complianceRate,
        action: 'suspended'
      };
    } else if (complianceRate < 85) {
      // Send warning
      await this.sendComplianceWarning(officer, complianceRate);
      
      return {
        compliant: true,
        complianceRate,
        action: 'warning'
      };
    }

    return {
      compliant: true,
      complianceRate,
      action: 'none'
    };
  }

  // Suspend Officer
  private async suspendOfficer(
    officer: SecurityOfficer,
    complianceRate: number
  ): Promise<void> {
    const suspensionEndDate = new Date();
    suspensionEndDate.setDate(
      suspensionEndDate.getDate() + this.SUSPENSION_DURATION_DAYS
    );

    officer.status = UserStatus.SUSPENDED;
    officer.suspensionEndDate = suspensionEndDate;

    // Send notifications to officer
    const message = `Your account has been automatically suspended due to low patrol compliance (${complianceRate}%). Suspension will be lifted on ${suspensionEndDate.toLocaleDateString()}.`;
    
    await Promise.all([
      notificationService.sendEmail(
        officer.email,
        'Account Suspended - Low Compliance',
        message
      ),
      notificationService.sendSMS(officer.phoneNumber, message)
    ]);

    // Notify administrators
    await this.notifyAdministrators(officer, complianceRate);
  }

  // Send Compliance Warning
  private async sendComplianceWarning(
    officer: SecurityOfficer,
    complianceRate: number
  ): Promise<void> {
    await notificationService.sendPatrolComplianceAlert(
      officer.email,
      officer.phoneNumber,
      complianceRate
    );
  }

  // Notify Administrators of Suspension
  private async notifyAdministrators(
    officer: SecurityOfficer,
    complianceRate: number
  ): Promise<void> {
    // In production, fetch admin emails from database
    const adminEmail = 'admin@neighborguard.com';
    
    const message = `Officer ${officer.username} (Badge: ${officer.badgeNumber}) has been automatically suspended due to ${complianceRate}% compliance rate.`;
    
    await notificationService.sendEmail(
      adminEmail,
      'Officer Auto-Suspended',
      message
    );
  }

  // Check for Expired Suspensions and Reinstate Officers
  async checkAndReinstateOfficers(officers: SecurityOfficer[]): Promise<SecurityOfficer[]> {
    const now = new Date();
    const reinstatedOfficers: SecurityOfficer[] = [];

    for (const officer of officers) {
      if (
        officer.status === UserStatus.SUSPENDED &&
        officer.suspensionEndDate &&
        officer.suspensionEndDate <= now
      ) {
        await this.reinstateOfficer(officer);
        reinstatedOfficers.push(officer);
      }
    }

    return reinstatedOfficers;
  }

  // Reinstate Officer
  private async reinstateOfficer(officer: SecurityOfficer): Promise<void> {
    officer.status = UserStatus.ACTIVE;
    officer.suspensionEndDate = null;

    const message = 'Your suspension period has ended. Your account has been reactivated. Please ensure you maintain compliance with patrol requirements.';
    
    await Promise.all([
      notificationService.sendEmail(
        officer.email,
        'Account Reactivated',
        message
      ),
      notificationService.sendSMS(officer.phoneNumber, message)
    ]);
  }

  // Generate Compliance Report
  generateComplianceReport(
    officers: SecurityOfficer[],
    scansMap: Map<string, PatrolScan[]>
  ): {
    totalOfficers: number;
    compliantOfficers: number;
    nonCompliantOfficers: number;
    averageComplianceRate: number;
    officerDetails: Array<{
      officerId: string;
      name: string;
      complianceRate: number;
      status: string;
    }>;
  } {
    const details = officers.map(officer => {
      const scans = scansMap.get(officer.id) || [];
      const complianceRate = this.calculateComplianceRate(
        officer.assignedHouses,
        scans
      );

      return {
        officerId: officer.id,
        name: officer.username,
        complianceRate,
        status: officer.status
      };
    });

    const compliantCount = details.filter(
      d => d.complianceRate >= this.MIN_COMPLIANCE_RATE
    ).length;

    const averageCompliance = details.length > 0
      ? Math.round(
          details.reduce((sum, d) => sum + d.complianceRate, 0) / details.length
        )
      : 0;

    return {
      totalOfficers: officers.length,
      compliantOfficers: compliantCount,
      nonCompliantOfficers: officers.length - compliantCount,
      averageComplianceRate: averageCompliance,
      officerDetails: details
    };
  }
}

export const complianceMonitor = new ComplianceMonitor();
