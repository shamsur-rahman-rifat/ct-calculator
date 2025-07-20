import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import API, { setAuthToken } from '../services/api';

export default function Login() {
  const [form, setForm] = useState({ roll: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      navigate('/dashboard');
    }
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await API.post('login', form);
      const token = res.data.token;
      localStorage.setItem('token', token);
      setAuthToken(token);
      alert('Login Successful');
      navigate('/dashboard');
    } catch (err) {
      setError('Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center min-vh-100 bg-light p-3">
      <div className="card shadow p-4 w-100" style={{ maxWidth: '400px' }}>
        <h3 className="text-center mb-4">Login</h3>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="roll" className="form-label">Roll Number</label>
            <input
              id="roll"
              className="form-control"
              type="number"
              value={form.roll}
              onChange={(e) => setForm({ ...form, roll: e.target.value })}
              placeholder="Enter roll number"
              required
            />
          </div>
          <div className="mb-3">
            <label htmlFor="password" className="form-label">Password</label>
            <input
              id="password"
              className="form-control"
              type="password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              placeholder="Enter password"
              required
            />
          </div>

          {error && <div className="alert alert-danger">{error}</div>}

          <div className="d-grid mb-3">
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </div>
        </form>

        <div className="text-center mt-2">
          <Link to="/register" className="d-block mb-1 text-decoration-none">
            Don’t have an account? <strong>Register</strong>
          </Link>
          <Link to="/forgot" className="text-decoration-none">
            <small>Forgot Password?</small>
          </Link>
        </div>
      </div>
    </div>
  );
}
