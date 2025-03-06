import React, { useEffect, useState } from 'react';
import { getUsers } from '../services/userService';
import CustomPagination from './CustomPagination';

const UserTable = () => {
  const [users, setUsers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    fetchUsers(currentPage);
  }, []);

  const fetchUsers = async (page) => {
    try {
      const response = await getUsers(page);
      console.log('response', response);
      setUsers(response.users);
      setTotalPages(response.totalPages);
      setCurrentPage(page);
    } catch (error) {
      console.error('Error fetching users', error);
    }
  };

  return (
    <div className="mt-3">
      <h4 className="text-secondary text-center">📋User List</h4>
      <table className="table table-hover variant table-bordered shadow-sm text-center">
        <thead>
          <tr>
            <th>#</th>
            <th>Username</th>
            <th>Point</th>
            <th>Point Bingo</th>
            <th>Bingo</th>
            <th>Close</th>
            <th>Attend</th>
            <th>Date</th>
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
                <td>{user.closeBingo}</td>
                <td>{user.attend}</td>
                <td>{user.updatedAt}</td>
              </tr>
            ))}
        </tbody>
      </table>

      <CustomPagination totalPages={totalPages} currentPage={currentPage} onPageChange={fetchUsers} />
    </div>
  );
};

export default UserTable;
