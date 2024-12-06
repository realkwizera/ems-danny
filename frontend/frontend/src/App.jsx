import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import ProtectedRoute from './components/ProtectedRoute';
import { AuthProvider } from './contexts/AuthContext';
import getUserDataFromToken from './services/userData';
import Employees from './components/Employees';
import Navbar from './components/navbar';
import EmployeeRegisterForm from './components/EmployeeRegisterForm';
import SignUpForm from './components/SignUpForm';
import Users from './components/Users';

const App = () => {
  const userData = getUserDataFromToken()
  console.log(userData)
  return (
    <AuthProvider>
      <Router>
        <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />

          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Navbar/>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route path='/view-employees' element={<><Navbar/><Employees/></>}/>
          <Route path='/register-employee' element={<><Navbar/><EmployeeRegisterForm/></>}/>
          <Route path='/register-user' element={<><Navbar/><SignUpForm/></>}/>
          <Route path='/view-users' element={<><Navbar/><Users/></>}/>
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;
