import { useEffect, useState } from 'react';
import API, { setAuthToken } from '../services/api';
import { useNavigate } from 'react-router-dom';


export default function Dashboard() {
  const [profile, setProfile] = useState(null);
  const [form, setForm] = useState({ name: '', ct1: '', ct2: '', ct3: '', ct4: '' });
  const [ctList, setCtList] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errors, setErrors] = useState({});
  const [alert, setAlert] = useState({ type: '', message: '' });

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) setAuthToken(token);

    const init = async () => {
      try {
        const profileRes = await API.post('profileDetails');
        const user = profileRes.data?.data?.[0] || null;
        setProfile(user);

        const ctRes = await API.post('view');
        const list = ctRes.data?.data || [];
        setCtList(Array.isArray(list) ? list : []);
      } catch (err) {
        console.error('Dashboard load error:', err);
        setAlert({ type: 'danger', message: 'Failed to load data. Make sure your server is running and token is valid.' });
      } finally {
        setLoading(false);
      }
    };

    init();
  }, []);

  function getBestThreeTotal(item) {
    const scores = [Number(item.ct1), Number(item.ct2), Number(item.ct3), Number(item.ct4)];
    scores.sort((a, b) => b - a); // Descending sort
    return scores.slice(0, 3).reduce((sum, val) => sum + val, 0);
  }

  const validateForm = () => {
    const newErrors = {};
    if (!form.name.trim()) newErrors.name = 'Subject name is required';
    ['ct1', 'ct2', 'ct3', 'ct4'].forEach(ct => {
      const val = form[ct];
      if (val === '') {
        newErrors[ct] = 'Score is required';
      } else if (isNaN(val) || val < 0 || val > 100) {
        newErrors[ct] = 'Score must be between 0 and 100';
      }
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      if (editingId) {
        await API.post(`update/${editingId}`, form);
        setAlert({ type: 'success', message: 'CT Mark updated successfully!' });
      } else {
        await API.post('add', form);
        setAlert({ type: 'success', message: 'CT Mark added successfully!' });
      }

      setForm({ name: '', ct1: '', ct2: '', ct3: '', ct4: '' });
      setEditingId(null);
      setErrors({});

      const updated = await API.post('view');
      const list = updated.data?.data || [];
      setCtList(Array.isArray(list) ? list : []);
    } catch (err) {
      console.error(err);
      setAlert({ type: 'danger', message: 'Error saving CT mark.' });
    }
  };

  const handleEdit = (item) => {
    setForm({
      name: item.name,
      ct1: item.ct1,
      ct2: item.ct2,
      ct3: item.ct3,
      ct4: item.ct4,
    });
    setEditingId(item._id);
    setErrors({});
    setAlert({ type: '', message: '' });
  };


const handleDelete = async (id) => {
  const confirmDelete = window.confirm('Are you sure you want to delete this CT mark?');
  if (!confirmDelete) return;

  try {
    await API.post(`remove/${id}`);
    setAlert({ type: 'success', message: 'CT mark deleted successfully!' });
    const refreshed = await API.post('view');
    const list = refreshed.data?.data || [];
    setCtList(Array.isArray(list) ? list : []);
  } catch (err) {
    console.error(err);
    setAlert({ type: 'danger', message: 'Failed to delete mark.' });
  }
};

  const navigate = useNavigate();

  if (loading) return (
    <div className="d-flex justify-content-center align-items-center mt-5">
      <div className="spinner-border text-primary" role="status" aria-label="Loading">
        <span className="visually-hidden">Loading...</span>
      </div>
    </div>
  );

  return (
    <div className="container vh-100 vw-100 mt-5">
      <h2 className="mb-4 text-center">Dashboard</h2>

      {alert.message && (
        <div className={`alert alert-${alert.type} alert-dismissible fade show`} role="alert">
          {alert.message}
          <button type="button" className="btn-close" onClick={() => setAlert({ type: '', message: '' })} aria-label="Close"></button>
        </div>
      )}

      {profile ? (
        <div className="mb-4 border p-3 rounded bg-light d-flex justify-content-between align-items-center flex-wrap">
          <div>
            <p className="mb-1"><strong>Email:</strong> {profile.email}</p>
            <p className="mb-0"><strong>Roll:</strong> {profile.roll}</p>
          </div>
          <button className="btn btn-lg btn-outline-primary mt-2 mt-md-0" onClick={() => navigate('/profile')}>Update</button>
        </div>
      ) : (
        <p className="text-center text-muted">No profile info found.</p>
      )}

      <div className="card shadow-sm mb-5">
        <div className="card-header bg-primary text-white">
          <h4 className="mb-0">{editingId ? 'Update CT Mark' : 'Add CT Mark'}</h4>
        </div>
        <div className="card-body">
          <form onSubmit={handleSubmit} noValidate>
            <div className="mb-3">
              <label htmlFor="subjectName" className="form-label">Subject Name</label>
              <input
                id="subjectName"
                type="text"
                className={`form-control ${errors.name ? 'is-invalid' : ''}`}
                placeholder="Enter Subject Name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                required
              />
              {errors.name && <div className="invalid-feedback">{errors.name}</div>}
            </div>

            <div className="row">
              {['ct1', 'ct2', 'ct3', 'ct4'].map((ct, idx) => (
                <div className="col-md-3 mb-3" key={idx}>
                  <label htmlFor={ct} className="form-label">{ct.toUpperCase()}</label>
                  <input
                    id={ct}
                    type="number"
                    min="0"
                    max="100"
                    className={`form-control ${errors[ct] ? 'is-invalid' : ''}`}
                    placeholder={`Enter ${ct.toUpperCase()} Score`}
                    value={form[ct]}
                    onChange={(e) => setForm({ ...form, [ct]: e.target.value })}
                    required
                  />
                  {errors[ct] && <div className="invalid-feedback">{errors[ct]}</div>}
                </div>
              ))}
            </div>

            <button type="submit" className="btn btn-success">
              {editingId ? 'Update' : 'Add'}
            </button>
            {editingId && (
              <button
                type="button"
                className="btn btn-secondary ms-2"
                onClick={() => {
                  setForm({ name: '', ct1: '', ct2: '', ct3: '', ct4: '' });
                  setEditingId(null);
                  setErrors({});
                }}
              >
                Cancel
              </button>
            )}
          </form>
        </div>
      </div>

      <h4 className="mb-3 text-center">Your CT Marks</h4>

      {Array.isArray(ctList) && ctList.length > 0 ? (
<div className="table-responsive shadow-sm rounded mb-5">
  <table className="table table-hover table-striped table-bordered align-middle mb-0">
    <thead className="table-primary position-sticky top-0">
      <tr>
        <th>Subject</th>
        <th>CT1</th>
        <th>CT2</th>
        <th>CT3</th>
        <th>CT4</th>
        <th>Best 3</th>
        <th>Actions</th>
      </tr>
    </thead>
    <tbody>
      {ctList.map((item) => (
        <tr key={item._id}>
          <td>{item.name}</td>
          <td>{item.ct1}</td>
          <td>{item.ct2}</td>
          <td>{item.ct3}</td>
          <td>{item.ct4}</td>
          <td><strong>{getBestThreeTotal(item)}</strong></td>
          <td>
            <div className="d-flex flex-column flex-md-row gap-2">
              <button
                className="btn btn-sm btn-warning"
                onClick={() => handleEdit(item)}
              >
                Edit
              </button>
              <button
                className="btn btn-sm btn-danger"
                onClick={() => handleDelete(item._id)}
              >
                Delete
              </button>
            </div>
          </td>
        </tr>
      ))}
    </tbody>
  </table>
</div>
      ) : (
        <p className="text-center text-muted">No CT marks found.</p>
      )}
    </div>
  );
}
