import { useState, useEffect } from 'react';
import { useAuth } from '../lib/auth-context';
import { notificationService } from '../lib/notification-service';
import { useNavigate } from 'react-router-dom';

export default function TwoFactorAuth() {
  const [code, setCode] = useState(['', '', '', '', '', '']);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [resendTimer, setResendTimer] = useState(60);
  const { verify2FA } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Send initial 2FA code
    const email = localStorage.getItem('pendingUser') 
      ? JSON.parse(localStorage.getItem('pendingUser')!).email 
      : '';
    
    if (email) {
      const generatedCode = Math.floor(100000 + Math.random() * 900000).toString();
      localStorage.setItem('2fa_code', generatedCode);
      notificationService.send2FACode(email, generatedCode);
    }

    // Start countdown timer
    const timer = setInterval(() => {
      setResendTimer((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleInputChange = (index: number, value: string) => {
    if (value.length > 1) return;
    if (!/^\d*$/.test(value)) return;

    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);

    // Auto-focus next input
    if (value && index < 5) {
      const nextInput = document.getElementById(`code-${index + 1}`);
      nextInput?.focus();
    }

    // Auto-submit when all fields are filled
    if (index === 5 && value) {
      handleVerify(newCode.join(''));
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !code[index] && index > 0) {
      const prevInput = document.getElementById(`code-${index - 1}`);
      prevInput?.focus();
    }
  };

  const handleVerify = async (fullCode?: string) => {
    const codeToVerify = fullCode || code.join('');
    
    if (codeToVerify.length !== 6) {
      setError('Please enter the complete 6-digit code');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // In production, verify with backend
      const storedCode = localStorage.getItem('2fa_code');
      
      if (codeToVerify === storedCode) {
        const success = await verify2FA(codeToVerify);
        if (success) {
          localStorage.removeItem('2fa_code');
          navigate('/dashboard/admin');
        } else {
          setError('Verification failed. Please try again.');
        }
      } else {
        setError('Invalid code. Please check and try again.');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (resendTimer > 0) return;

    const email = localStorage.getItem('pendingUser')
      ? JSON.parse(localStorage.getItem('pendingUser')!).email
      : '';

    if (email) {
      const generatedCode = Math.floor(100000 + Math.random() * 900000).toString();
      localStorage.setItem('2fa_code', generatedCode);
      await notificationService.send2FACode(email, generatedCode);
      setResendTimer(60);
      setError('');
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h1>Two-Factor Authentication</h1>
        <p className="text-center text-white mb-6">
          We've sent a 6-digit code to your email.
          <br />
          Please enter it below to continue.
        </p>

        <div className="flex justify-center gap-2 mb-6">
          {code.map((digit, index) => (
            <input
              key={index}
              id={`code-${index}`}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={(e) => handleInputChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              className="w-12 h-14 text-center text-2xl font-bold border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
              disabled={loading}
            />
          ))}
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <button
          onClick={() => handleVerify()}
          disabled={loading || code.some(d => !d)}
          className="btn-login w-full"
        >
          {loading ? 'Verifying...' : 'Verify Code'}
        </button>

        <div className="login-footer">
          <p>
            Didn't receive the code?{' '}
            {resendTimer > 0 ? (
              <span className="text-white opacity-60">
                Resend in {resendTimer}s
              </span>
            ) : (
              <button
                onClick={handleResend}
                className="text-white underline font-semibold"
              >
                Resend Code
              </button>
            )}
          </p>
        </div>
      </div>
    </div>
  );
}
