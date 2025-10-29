import React from 'react';
import { useAuth } from '../hooks/useAuth';
import { NotificationService } from '../services/notification-service';
import { ReportGenerator } from '../services/report-generator';
import './AdminDashboard.css';

const AdminDashboard: React.FC = () => {
    const { user } = useAuth();

    const handleGenerateReport = async () => {
        const report = await ReportGenerator.generateAdminReport();
        NotificationService.sendNotification(user.email, 'Your report has been generated', report);
    };

    return (
        <div className="admin-dashboard">
            <h1>Admin Dashboard</h1>
            <p>Welcome, {user.name}!</p>
            <button onClick={handleGenerateReport}>Generate Report</button>
            {/* Additional admin functionalities can be added here */}
        </div>
    );
};

export default AdminDashboard;