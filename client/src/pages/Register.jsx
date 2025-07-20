import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import API from '../services/api';

export default function Register() {
  const [form, setForm] = useState({ email: '', roll: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);
    try {
      const res = await API.post('registration', form);
      setSuccess('✅ Registration successful! Redirecting to login...');
      setTimeout(() => navigate('/'), 2000);
    } catch (err) {
      setError('❌ Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center min-vh-100 bg-light p-3">
      <div className="card shadow p-4 w-100" style={{ maxWidth: '400px' }}>
        <div className="card-header bg-primary text-white text-center">
          <h4 className="mb-0">Create Account</h4>
        </div>
        <div className="card-body bg-light-subtle">
          {success && <div className="alert alert-success">{success}</div>}
          {error && <div className="alert alert-danger">{error}</div>}

          <form onSubmit={handleSubmit} className="table table-striped p-3">
            <div className="mb-3">
              <label className="form-label">Email Address</label>
              <input
                type="email"
                className="form-control"
                placeholder="Enter your email"
                required
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Roll Number</label>
              <input
                type="number"
                className="form-control"
                placeholder="Enter your roll number"
                required
                value={form.roll}
                onChange={(e) => setForm({ ...form, roll: e.target.value })}
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Password</label>
              <input
                type="password"
                className="form-control"
                placeholder="Enter a strong password"
                required
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
              />
            </div>

            <button type="submit" className="btn btn-success w-100" disabled={loading}>
              {loading ? 'Registering...' : 'Register'}
            </button>
          </form>

          <div className="text-center mt-3">
            <small>
              Already have an account?{' '}
              <Link to="/" className="text-decoration-none">
                Login
              </Link>
            </small>
          </div>
        </div>
      </div>
    </div>
  );
}