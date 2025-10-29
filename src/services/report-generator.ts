import { PatrolReport } from '../types'; // Assuming PatrolReport is defined in types/index.ts

class ReportGenerator {
    private reports: PatrolReport[];

    constructor() {
        this.reports = [];
    }

    addReport(report: PatrolReport): void {
        this.reports.push(report);
    }

    generateSummary(): string {
        const totalReports = this.reports.length;
        const summary = `Total Patrol Reports: ${totalReports}\n`;

        const reportDetails = this.reports.map((report, index) => {
            return `Report ${index + 1}: ${report.description} - ${report.date}`;
        }).join('\n');

        return summary + reportDetails;
    }

    exportReports(): string {
        return JSON.stringify(this.reports, null, 2);
    }
}

export default new ReportGenerator();