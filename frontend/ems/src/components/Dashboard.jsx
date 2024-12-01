import React, { useEffect, useState } from 'react';
import api from '../services/api';
import getUserDataFromToken from '../services/userData';

const Dashboard = () => {
  const [employees, setEmployees] = useState([]);
  const userData = getUserDataFromToken();


  return (
    <>
      <div className="container py-5" style={{ backgroundColor: '#f8f9fa' }}>
        <div
          className="p-5 rounded-3 shadow-lg"
          style={{ backgroundColor: '#ffffff', borderLeft: '4px solid #0dcaf0' }}
        >
          <h1 className="text-secondary mb-4">
            Welcome to the {userData.role}'s Dashboard
          </h1>
          <p className="text-muted">
            This is your central hub for managing tasks and viewing details about employees and operations.
          </p>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
