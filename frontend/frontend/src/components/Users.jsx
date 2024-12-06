import React, { useEffect, useState } from 'react';
import api from '../services/api';
import Navbar from './navbar';

const Users = () => {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 5;

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await api.get('/user/users/');  // Adjusted API endpoint to fetch users
      if (response.status === 200) {
        setUsers(response.data.data);
        setLoading(false);
      }
    } catch (error) {
      console.log(error.response?.data?.message || 'Error fetching users');
      setLoading(false);
    }
  };

  const handleUpdate = (user) => {
    setSelectedUser(user);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/user/${id}`);  // Adjusted API endpoint for user deletion
      setUsers((prev) => prev.filter((user) => user.id !== id));
    } catch (error) {
      console.log(error.response?.data?.message || 'Error deleting user');
    }
  };

  const handleSaveUpdate = async () => {
    try {
      const response = await api.put(`/user/${selectedUser.id}`, selectedUser);  // Adjusted API endpoint for user update
      if (response.status === 200) {
        setUsers((prev) =>
          prev.map((usr) => (usr.id === selectedUser.id ? selectedUser : usr))
        );
        setShowModal(false);
      }
    } catch (error) {
      console.log(error.response?.data?.message || 'Error updating user');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSelectedUser((prev) => ({ ...prev, [name]: value }));
  };

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const filteredUsers = users.filter((user) => {
    return (
      user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

  const currentUsers = filteredUsers.slice(
    (currentPage - 1) * usersPerPage,
    currentPage * usersPerPage
  );

  const handlePagination = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <>
      <h3>Users</h3>
      <input
        type="text"
        placeholder="Search users..."
        value={searchTerm}
        onChange={handleSearch}
        className="form-control mb-3"
      />
      <table className="table table-striped">
        <thead>
          <tr>
            <th>First Name</th>
            <th>Last Name</th>
            <th>Email</th>
            <th>Role</th>
            
          </tr>
        </thead>
        <tbody>
          {currentUsers.map((user) => (
            <tr key={user.id}>
              <td>{user.firstName}</td>
              <td>{user.lastName}</td>
              <td>{user.email}</td>
              <td>{user.role}</td>
              
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination */}
      <nav>
        <ul className="pagination justify-content-center">
          <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
            <button className="page-link" onClick={() => handlePagination(currentPage - 1)}>
              Previous
            </button>
          </li>
          {[...Array(totalPages).keys()].map((pageNum) => (
            <li key={pageNum + 1} className={`page-item ${currentPage === pageNum + 1 ? 'active' : ''}`}>
              <button className="page-link" onClick={() => handlePagination(pageNum + 1)}>
                {pageNum + 1}
              </button>
            </li>
          ))}
          <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
            <button className="page-link" onClick={() => handlePagination(currentPage + 1)}>
              Next
            </button>
          </li>
        </ul>
      </nav>

      
    </>
  );
};

export default Users;
