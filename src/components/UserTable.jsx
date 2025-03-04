import React, { useEffect, useState } from 'react';
import { Pagination } from 'react-bootstrap';
import { getUsers } from '../services/userService';

const UserTable = () => {
  const [users, setUsers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    fetchUsers(currentPage);
  }, [currentPage]);

  const fetchUsers = async (page) => {
    try {
      const response = await getUsers(page);
      setUsers(response.users);
      setTotalPages(response.totalPages);
    } catch (error) {
      console.error('Error fetching users', error);
    }
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <div className="mt-3">
      <h4 className="text-secondary text-center">📋User List</h4>
      <table className="table table-hover table-dark table-bordered shadow-sm text-center">
        <thead>
          <tr>
            <th>#</th>
            <th>Username</th>
            <th>Point</th>
            <th>Point Bingo</th>
            <th>Bingo</th>
            <th>Attend</th>
          </tr>
        </thead>
        <tbody>
          {users &&
            users.map((user, index) => (
              <tr key={user._id}>
                <td>{index + 1 + (currentPage - 1) * itemsPerPage}</td>
                <td>{user.username}</td>
                <td>{user.point}</td>
                <td>{user.pointBingo}</td>
                <td>{user.bingoCount}</td>
                <td>{user.attend}</td>
              </tr>
            ))}
        </tbody>
      </table>

      <Pagination className="justify-content-center">
        {[...Array(totalPages).keys()].map((number) => (
          <Pagination.Item key={number + 1} activeLabel="" active={number + 1 === currentPage} onClick={() => handlePageChange(number + 1)}>
            {number + 1}
          </Pagination.Item>
        ))}
      </Pagination>
    </div>
  );
};

export default UserTable;
