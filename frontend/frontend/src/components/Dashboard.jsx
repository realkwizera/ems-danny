import React, { useEffect, useState } from 'react';
import { Pie } from 'react-chartjs-2';
import api from '../services/api';
import getUserDataFromToken from '../services/userData';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

// Register necessary chart elements
ChartJS.register(ArcElement, Tooltip, Legend);

const Dashboard = () => {
  const [roleCounts, setRoleCounts] = useState({});
  const userData = getUserDataFromToken();
  const [systemUsers, setSystemUsers] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const result = await api.get("/user/users/");
        if (result.status === 200) {
          setSystemUsers(result.data.data);
          console.log(result.data.data.role);
          const counts = result.data.data.reduce((acc, user) => {
            acc[user.role] = (acc[user.role] || 0) + 1;
            return acc;
          }, {});
          setRoleCounts(counts);
        }
      } catch (error) {
        console.error("Failed to fetch users:", error);
      }
    };
    fetchUsers();
  }, []);

  // useEffect(() => {
  //   if (systemUsers) {
  //     const counts = systemUsers.filter((acc, user) => {
  //       acc[user.role] = (acc[user.role] || 0) + 1;
  //       return acc;
  //     }, {});
  //     setRoleCounts(counts);
  //   }
  // }, [systemUsers]);

  const chartData = {
    labels: ['Admin', 'Manager', 'User'],
    datasets: [
      {
        label: 'User Roles',
        data: [
          roleCounts.Admin || 0,
          roleCounts.Manager || 0,
          roleCounts.User || 0,
        ],
        backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56'],
        hoverBackgroundColor: ['#FF6384', '#36A2EB', '#FFCE56'],
      },
    ],
  };

  return (
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

      <div className='d-flex w-50 justify-content-between align-items-center'>
        {userData.role === 'Admin' && (
          <div className="container mt-4">
            <h3>User Roles Summary</h3>
            <Pie data={chartData} />
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
