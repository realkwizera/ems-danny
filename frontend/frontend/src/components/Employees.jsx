import React, { useContext, useEffect, useState } from 'react';
import api from '../services/api';
import { AuthContext } from '../contexts/AuthContext';
import Navbar from './navbar';

const Employees = () => {
  const { logout } = useContext(AuthContext);
  const [employees, setEmployees] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const employeesPerPage = 5;
  const [sortConfig, setSortConfig] = useState({ key: 'firstName', direction: 'ascending' });

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    setLoading(true);
    try {
      const response = await api.get('/employee/');
      if (response.status === 200) {
        setEmployees(response.data.data);
      }
    } catch (error) {
      alert(error.response?.data?.message || 'Error fetching employees');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = (employee) => {
    setSelectedEmployee(employee);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/employee/${id}`);
      setEmployees((prev) => prev.filter((employee) => employee.id !== id));
      alert('Employee deleted successfully!');
    } catch (error) {
      alert(error.response?.data?.message || 'Error deleting employee');
    }
  };

  const handleSaveUpdate = async () => {
    try {
      const response = await api.put(`/employee/${selectedEmployee.id}`, selectedEmployee);
      if (response.status === 200) {
        setEmployees((prev) =>
          prev.map((emp) => (emp.id === selectedEmployee.id ? selectedEmployee : emp))
        );
        setShowModal(false);
        alert('Employee updated successfully!');
      }
    } catch (error) {
      alert(error.response?.data?.message || 'Error updating employee');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSelectedEmployee((prev) => ({ ...prev, [name]: value }));
  };

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const filteredEmployees = employees.filter((employee) => {
    return (
      employee.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.email.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  const sortEmployees = (employees) => {
    const { key, direction } = sortConfig;
    return [...employees].sort((a, b) => {
      if (a[key] < b[key]) return direction === 'ascending' ? -1 : 1;
      if (a[key] > b[key]) return direction === 'ascending' ? 1 : -1;
      return 0;
    });
  };

  const sortedEmployees = sortEmployees(filteredEmployees);

  const totalPages = Math.ceil(sortedEmployees.length / employeesPerPage);
  const currentEmployees = sortedEmployees.slice(
    (currentPage - 1) * employeesPerPage,
    currentPage * employeesPerPage
  );

  const handlePagination = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleSort = (key) => {
    setSortConfig((prevState) => ({
      key,
      direction: prevState.key === key && prevState.direction === 'ascending' ? 'descending' : 'ascending',
    }));
  };

  return (
    <>
      <div className="container py-4">
        <h3>Employees</h3>
        <input
          type="text"
          placeholder="Search employees..."
          value={searchTerm}
          onChange={handleSearch}
          className="form-control mb-3"
        />
        {loading ? (
          <div className="text-center">
            <div className="spinner-border text-primary" role="status"></div>
            <p>Loading employees...</p>
          </div>
        ) : (
          <>
            <table className="table table-striped">
              <thead>
                <tr>
                  <th onClick={() => handleSort('firstName')}>First Name</th>
                  <th onClick={() => handleSort('lastName')}>Last Name</th>
                  <th onClick={() => handleSort('email')}>Email</th>
                  <th onClick={() => handleSort('phone')}>Phone</th>
                  <th>CV</th>
                  <th onClick={() => handleSort('dob')}>Date of Birth</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {currentEmployees.map((employee) => (
                  <tr key={employee.id}>
                    <td>{employee.firstName}</td>
                    <td>{employee.lastName}</td>
                    <td>{employee.email}</td>
                    <td>{employee.phone}</td>
                    <td>
                      <a href={`../../../../cvs/${employee.cv}`} download={employee.cv}>
                        Download
                      </a>
                    </td>
                    <td>{new Date(employee.dob).toLocaleDateString()}</td>
                    <td>
                      <button className="btn btn-warning btn-sm me-2" onClick={() => handleUpdate(employee)}>
                        Update
                      </button>
                      <button className="btn btn-danger btn-sm" onClick={() => handleDelete(employee.id)}>
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
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
        )}

        {/* Update Modal */}
        {showModal && (
          <div className="modal show d-block" tabIndex="-1">
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Update Employee</h5>
                  <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
                </div>
                <div className="modal-body">
                  <form>
                    <div className="mb-3">
                      <label htmlFor="firstName" className="form-label">First Name</label>
                      <input
                        type="text"
                        className="form-control"
                        id="firstName"
                        name="firstName"
                        value={selectedEmployee.firstName}
                        onChange={handleChange}
                      />
                    </div>
                    <div className="mb-3">
                      <label htmlFor="lastName" className="form-label">Last Name</label>
                      <input
                        type="text"
                        className="form-control"
                        id="lastName"
                        name="lastName"
                        value={selectedEmployee.lastName}
                        onChange={handleChange}
                      />
                    </div>
                    <div className="mb-3">
                      <label htmlFor="email" className="form-label">Email</label>
                      <input
                        type="email"
                        className="form-control"
                        id="email"
                        name="email"
                        value={selectedEmployee.email}
                        onChange={handleChange}
                      />
                    </div>
                    <div className="mb-3">
                      <label htmlFor="phone" className="form-label">Phone</label>
                      <input
                        type="text"
                        className="form-control"
                        id="phone"
                        name="phone"
                        value={selectedEmployee.phone}
                        onChange={handleChange}
                      />
                    </div>
                    <div className="mb-3">
                      <label htmlFor="dob" className="form-label">Date of Birth</label>
                      <input
                        type="date"
                        className="form-control"
                        id="dob"
                        name="dob"
                        value={selectedEmployee.dob}
                        onChange={handleChange}
                      />
                    </div>
                  </form>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>
                    Close
                  </button>
                  <button type="button" className="btn btn-primary" onClick={handleSaveUpdate}>
                    Save Changes
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Employees;
