import React, { useContext } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { AuthContext } from '../contexts/AuthContext';
import getUserDataFromToken from '../services/userData';
import { useNavigate } from 'react-router-dom';


const Navbar = () => {
  const { auth, logout } = useContext(AuthContext);
  const userData = getUserDataFromToken();
  const navigate = useNavigate();

  const commonLinks = (
    <li className="nav-item">
      <a href="/dashboard" className="nav-link text-success">
        <i className="fas fa-home me-2"></i> Dashboard
      </a>
    </li>
  );

  const roleLinks = {
    user: <></>,
    admin: (
      <>
        <li className="nav-item">
          <a href="/register-user" className="nav-link text-success">
            <i className="fas fa-user-plus me-2"></i> Create User
          </a>
        </li>
        <li className="nav-item">
          <a href="/view-users" className="nav-link text-success">
            <i className="fas fa-user-cog me-2"></i> Manage Users
          </a>
        </li>
      </>
    ),
    manager: (
      <>
        <li className="nav-item">
          <a href="/register-employee" className="nav-link text-success">
            <i className="fas fa-tasks me-2"></i> Add Employee
          </a>
        </li>
        <li className="nav-item">
          <a href="/view-employees" className="nav-link text-success">
            <i className="fas fa-tasks me-2"></i> Manage Employees
          </a>
        </li>
      </>
    ),
  };

  const role = userData.role?.toLowerCase(); // Determine user role

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-success-subtle shadow-sm">
      <div className="container-fluid">
        <a className="navbar-brand text-success fw-bold" href="/">
          Employee Portal
        </a>
        <button
          className="navbar-toggler border-success"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav me-auto">
            {commonLinks}
            {roleLinks[role] || null}
          </ul>
          <ul className="navbar-nav ms-auto">
            <li className="nav-item">
              <button
                onClick={()=>{
                  logout();
                  navigate("/login");
                }}
                className="btn btn-outline-success fw-semibold"
              >
                <i className="fas fa-sign-out-alt me-2"></i> Logout
              </button>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
