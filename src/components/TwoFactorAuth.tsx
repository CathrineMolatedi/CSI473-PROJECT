import React, { useState } from 'react';
import { authService } from '../services/auth-service';

const TwoFactorAuth: React.FC<{ onSuccess: () => void }> = ({ onSuccess }) => {
    const [code, setCode] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            await authService.verifyTwoFactorCode(code);
            onSuccess();
        } catch (err) {
            setError('Invalid code. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="two-factor-auth">
            <h2>Two-Factor Authentication</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="code">Enter the code sent to your device:</label>
                    <input
                        type="text"
                        id="code"
                        value={code}
                        onChange={(e) => setCode(e.target.value)}
                        required
                    />
                </div>
                {error && <p className="error">{error}</p>}
                <button type="submit" disabled={loading}>
                    {loading ? 'Verifying...' : 'Verify Code'}
                </button>
            </form>
        </div>
    );
};

export default TwoFactorAuth;