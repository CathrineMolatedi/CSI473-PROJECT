import { PatrolScan, Payment, SecurityOfficer, Member, Alert } from './types';

// Report Generation Service
export class ReportGenerator {
  
  // Generate Daily Patrol Report
  generateDailyPatrolReport(
    date: Date,
    scans: PatrolScan[],
    officers: SecurityOfficer[]
  ): string {
    const report = {
      title: 'Daily Patrol Report',
      date: date.toLocaleDateString(),
      totalScans: scans.length,
      uniqueHouses: new Set(scans.map(s => s.houseId)).size,
      activeOfficers: officers.filter(o => 
        scans.some(s => s.officerId === o.id)
      ).length,
      officerPerformance: officers.map(officer => {
        const officerScans = scans.filter(s => s.officerId === officer.id);
        return {
          name: officer.username,
          badge: officer.badgeNumber,
          scans: officerScans.length,
          compliance: officer.complianceRate
        };
      })
    };

    return this.formatReport(report);
  }

  // Generate Weekly Summary Report
  generateWeeklySummaryReport(
    startDate: Date,
    endDate: Date,
    scans: PatrolScan[],
    officers: SecurityOfficer[],
    alerts: Alert[]
  ): string {
    const report = {
      title: 'Weekly Summary Report',
      period: `${startDate.toLocaleDateString()} - ${endDate.toLocaleDateString()}`,
      totalScans: scans.length,
      averageScansPerDay: Math.round(scans.length / 7),
      totalOfficers: officers.length,
      activeOfficers: new Set(scans.map(s => s.officerId)).size,
      totalAlerts: alerts.length,
      emergencyAlerts: alerts.filter(a => a.type === 'EMERGENCY').length,
      topPerformers: this.getTopPerformers(officers, scans, 3),
      complianceIssues: officers.filter(o => o.complianceRate < 70).length
    };

    return this.formatReport(report);
  }

  // Generate Monthly Financial Report
  generateMonthlyFinancialReport(
    month: number,
    year: number,
    payments: Payment[],
    members: Member[]
  ): string {
    const successfulPayments = payments.filter(p => p.isSuccessful);
    const totalRevenue = successfulPayments.reduce((sum, p) => sum + p.amount, 0);
    const overdueMembers = members.filter(m => m.paymentOverdue);

    const report = {
      title: 'Monthly Financial Report',
      period: `${this.getMonthName(month)} ${year}`,
      totalRevenue: `BWP ${totalRevenue.toFixed(2)}`,
      totalPayments: payments.length,
      successfulPayments: successfulPayments.length,
      failedPayments: payments.length - successfulPayments.length,
      activeMembers: members.filter(m => !m.paymentOverdue).length,
      overdueMembers: overdueMembers.length,
      overdueAmount: `BWP ${(overdueMembers.length * 50).toFixed(2)}`,
      averagePaymentPerMember: `BWP ${(totalRevenue / Math.max(members.length, 1)).toFixed(2)}`
    };

    return this.formatReport(report);
  }

  // Generate System Performance Report
  generateSystemPerformanceReport(
    scans: PatrolScan[],
    officers: SecurityOfficer[],
    members: Member[],
    alerts: Alert[]
  ): string {
    const syncedScans = scans.filter(s => s.status === 'COMPLETED').length;
    const pendingScans = scans.filter(s => s.status === 'PENDING_SYNC').length;

    const report = {
      title: 'System Performance Report',
      generatedAt: new Date().toLocaleString(),
      totalUsers: officers.length + members.length,
      activeOfficers: officers.filter(o => o.status === 'ACTIVE').length,
      suspendedOfficers: officers.filter(o => o.status === 'SUSPENDED').length,
      activeMembers: members.filter(m => !m.paymentOverdue).length,
      totalScans: scans.length,
      syncedScans,
      pendingScans,
      syncRate: `${((syncedScans / Math.max(scans.length, 1)) * 100).toFixed(1)}%`,
      totalAlerts: alerts.length,
      averageComplianceRate: `${Math.round(
        officers.reduce((sum, o) => sum + o.complianceRate, 0) / Math.max(officers.length, 1)
      )}%`
    };

    return this.formatReport(report);
  }

  // Generate Compliance Audit Report
  generateComplianceAuditReport(
    officers: SecurityOfficer[],
    scansMap: Map<string, PatrolScan[]>
  ): string {
    const auditResults = officers.map(officer => {
      const scans = scansMap.get(officer.id) || [];
      return {
        officer: officer.username,
        badge: officer.badgeNumber,
        assigned: officer.assignedHouses.length,
        scanned: new Set(scans.map(s => s.houseId)).size,
        compliance: officer.complianceRate,
        status: officer.status,
        lastScan: scans.length > 0
          ? new Date(Math.max(...scans.map(s => s.timestamp.getTime()))).toLocaleString()
          : 'No scans'
      };
    });

    const report = {
      title: 'Compliance Audit Report',
      generatedAt: new Date().toLocaleString(),
      totalOfficers: officers.length,
      compliantOfficers: auditResults.filter(a => a.compliance >= 70).length,
      nonCompliantOfficers: auditResults.filter(a => a.compliance < 70).length,
      suspendedOfficers: auditResults.filter(a => a.status === 'SUSPENDED').length,
      officerDetails: auditResults.sort((a, b) => b.compliance - a.compliance)
    };

    return this.formatReport(report);
  }

  // Export Report as PDF (placeholder - requires PDF library)
  async exportAsPDF(reportContent: string, filename: string): Promise<void> {
    // In production, use a library like jsPDF or pdfmake
    console.log('Exporting report as PDF:', filename);
    console.log(reportContent);
    
    // For now, create a downloadable text file
    const blob = new Blob([reportContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${filename}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  // Helper Methods
  private formatReport(data: any): string {
    return JSON.stringify(data, null, 2);
  }

  private getTopPerformers(
    officers: SecurityOfficer[],
    scans: PatrolScan[],
    limit: number
  ): Array<{ name: string; scans: number; compliance: number }> {
    const performance = officers.map(officer => ({
      name: officer.username,
      scans: scans.filter(s => s.officerId === officer.id).length,
      compliance: officer.complianceRate
    }));

    return performance
      .sort((a, b) => b.compliance - a.compliance)
      .slice(0, limit);
  }

  private getMonthName(month: number): string {
    const months = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];
    return months[month - 1] || 'Unknown';
  }
}

export const reportGenerator = new ReportGenerator();
