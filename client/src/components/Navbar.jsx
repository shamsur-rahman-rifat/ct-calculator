import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const token = localStorage.getItem('token');
  const [activePath, setActivePath] = useState(location.pathname);

  const isLoginPage = location.pathname === '/';
  const isRegisterPage = location.pathname === '/register';

  useEffect(() => {
    setActivePath(location.pathname);
  }, [location]);

  const handleLogout = () => {
    const confirmLogout = window.confirm('Are you sure you want to logout?');
    if (confirmLogout) {
      localStorage.removeItem('token');
      navigate('/');
    }
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-white shadow-sm sticky-top vw-100">
      <div className="container-fluid px-4">
        <Link className="navbar-brand fw-bold text-primary fs-2" to="/">
          CT Calculator
        </Link>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNavDropdown"
          aria-controls="navbarNavDropdown"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse justify-content-end" id="navbarNavDropdown">
          <ul className="navbar-nav align-items-center gap-3">

            {token ? (
              <li className="nav-item">
                <button className="btn btn-lg btn-outline-danger" onClick={handleLogout}>
                  <i className="bi bi-box-arrow-right me-1"></i> Logout
                </button>
              </li>
            ) : (
              <>
                {!isRegisterPage && (
                  <li className="nav-item">
                    <Link className="btn btn-lg btn-outline-primary" to="/register">
                      <i className="bi bi-person-plus me-1"></i> Register
                    </Link>
                  </li>
                )}

                {!isLoginPage && (
                  <li className="nav-item">
                    <Link className="btn btn-lg btn-outline-primary" to="/">
                      <i className="bi bi-box-arrow-in-right me-1"></i> Login
                    </Link>
                  </li>
                )}
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
}
