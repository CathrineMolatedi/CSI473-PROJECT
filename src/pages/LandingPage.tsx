import React from 'react';
import { Link } from 'react-router-dom';
import './LandingPage.css';

const LandingPage: React.FC = () => {
    return (
        <div className="landing-page">
            <header className="landing-header">
                <h1>Welcome to the Neighborhood Watch Member Patrol System</h1>
                <p>Your safety is our priority. Join us in keeping our community safe.</p>
            </header>
            <main className="landing-main">
                <section className="landing-features">
                    <h2>Features</h2>
                    <ul>
                        <li>Real-time patrol updates</li>
                        <li>Community forum for discussions</li>
                        <li>Two-factor authentication for secure access</li>
                        <li>QR code scanning for quick reporting</li>
                    </ul>
                </section>
                <section className="landing-actions">
                    <h2>Get Started</h2>
                    <Link to="/login" className="landing-button">Login</Link>
                    <Link to="/register" className="landing-button">Register</Link>
                </section>
            </main>
            <footer className="landing-footer">
                <p>&copy; {new Date().getFullYear()} Neighborhood Watch. All rights reserved.</p>
            </footer>
        </div>
    );
};

export default LandingPage;