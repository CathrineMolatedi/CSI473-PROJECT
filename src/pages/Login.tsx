import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../lib/auth-context';

export default function Login() {
  const navigate = useNavigate();
  const { login, require2FA, userType, isAuthenticated } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    userType: 'officer'
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    // Redirect if 2FA is required
    if (require2FA) {
      navigate('/2fa');
    }
    // Redirect if already authenticated
    else if (isAuthenticated && userType) {
      navigate(`/dashboard/${userType}`);
    }
  }, [require2FA, isAuthenticated, userType, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      await login(formData.email, formData.password, formData.userType);
      
      // If not admin (no 2FA required), redirect directly
      if (formData.userType !== 'admin') {
        navigate(`/dashboard/${formData.userType}`);
      }
      // Admin will be redirected to 2FA by useEffect
    } catch (err) {
      setError('Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h1>NeighborGuard Login</h1>
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}
        
        <form className="login-form" onSubmit={handleSubmit}>
          <select
            className="form-input"
            value={formData.userType}
            onChange={(e) => setFormData({ ...formData, userType: e.target.value })}
          >
            <option value="officer">Security Officer</option>
            <option value="resident">Resident</option>
            <option value="admin">Administrator</option>
          </select>
          
          <input
            type="email"
            placeholder="Email Address"
            className="form-input"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            required
          />
          
          <input
            type="password"
            placeholder="Password"
            className="form-input"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            required
          />
          
          <button type="submit" className="btn-login" disabled={loading}>
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
        
        <div className="login-footer">
          <p>
            Don't have an account? <Link to="/register">Sign up here</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
