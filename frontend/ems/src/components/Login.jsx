import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import api from '../services/api';
import getUserDataFromToken from '../services/userData';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useContext(AuthContext);
  const userData = getUserDataFromToken();
  const navigate = useNavigate();

  useEffect(() => {
    if (userData !== null) {
      navigate("/dashboard");
    }
  }, [userData, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post('/user/login/', { email, password });
      if (response.status === 200) {
        login(response.data.token);
        navigate('/dashboard');
      }
      alert(response.data.message);
    } catch (error) {
      console.log('Login failed: ', error);
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100 bg-success-subtle">
      <div
        className="card shadow p-4"
        style={{
          width: '100%',
          maxWidth: '400px',
          border: '1px solid var(--bs-success)',
        }}
      >
        <h2 className="text-center mb-4 text-success">Welcome Back!</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="email" className="form-label text-success">
              Email
            </label>
            <input
              type="email"
              id="email"
              className="form-control border-success"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="mb-3">
            <label htmlFor="password" className="form-label text-success">
              Password
            </label>
            <input
              type="password"
              id="password"
              className="form-control border-success"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="btn btn-success w-100">
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
