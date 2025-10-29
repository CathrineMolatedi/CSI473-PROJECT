import React from 'react';
import { useAuth } from '../hooks/useAuth';
import { NotificationService } from '../services/notification-service';
import { GeolocationService } from '../services/geolocation-service';
import './ResidentDashboard.css';

const ResidentDashboard: React.FC = () => {
    const { user } = useAuth();
    const [location, setLocation] = React.useState<string | null>(null);
    const [notifications, setNotifications] = React.useState<string[]>([]);

    React.useEffect(() => {
        const fetchLocation = async () => {
            const userLocation = await GeolocationService.getUserLocation();
            setLocation(userLocation);
        };

        const fetchNotifications = async () => {
            const userNotifications = await NotificationService.getUserNotifications(user.id);
            setNotifications(userNotifications);
        };

        fetchLocation();
        fetchNotifications();
    }, [user.id]);

    return (
        <div className="resident-dashboard">
            <h1>Welcome, {user.name}</h1>
            <div className="location-info">
                <h2>Your Location:</h2>
                <p>{location ? location : 'Fetching location...'}</p>
            </div>
            <div className="notifications">
                <h2>Your Notifications:</h2>
                <ul>
                    {notifications.length > 0 ? (
                        notifications.map((notification, index) => (
                            <li key={index}>{notification}</li>
                        ))
                    ) : (
                        <li>No new notifications</li>
                    )}
                </ul>
            </div>
        </div>
    );
};

export default ResidentDashboard;