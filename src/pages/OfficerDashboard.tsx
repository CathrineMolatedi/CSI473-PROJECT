import React from 'react';
import { useAuth } from '../hooks/useAuth';
import { Scanner } from '../components/Scanner';
import { NotificationService } from '../services/notification-service';
import { ReportGenerator } from '../services/report-generator';

const OfficerDashboard: React.FC = () => {
    const { user } = useAuth();

    const handleGenerateReport = async () => {
        const report = await ReportGenerator.generatePatrolReport(user.id);
        NotificationService.sendReport(report);
    };

    return (
        <div className="officer-dashboard">
            <h1>Officer Dashboard</h1>
            <p>Welcome, {user.name}</p>
            <Scanner />
            <button onClick={handleGenerateReport}>Generate Patrol Report</button>
        </div>
    );
};

export default OfficerDashboard;