import React, { useEffect, useState } from 'react';
import { Pagination } from 'react-bootstrap';
import { getTransactions, getTransactionsById } from '../services/transactionService';

const TransactionTable = (props) => {
  const { role, username } = props;
  const [transactions, setTransactions] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    fetchTransactions(currentPage);
  }, [currentPage, role, username]);

  const fetchTransactions = async (page) => {
    try {
      let response = {};

      switch (role) {
        case 'admin':
          response = await getTransactions(page);
          break;
        case 'user':
          response = await getTransactionsById(page, username);
          break;
        default:
          break;
      }

      setTransactions(response.transactions);
      setTotalPages(response.totalPages);
    } catch (error) {
      console.error('Error fetching transactions', error);
    }
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const formatDateTime = (dateTime) => {
    const date = new Date(dateTime);
    const options = {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
      timeZone: 'Asia/Bangkok',
    };

    return new Intl.DateTimeFormat('en-GB', options).format(date).replace(',', '');
  };

  return (
    <div className="mt-3">
      <h4 className="text-secondary text-center">📋Transaction History</h4>
      <table className="table table-hover table-dark table-bordered shadow-sm text-center">
        <thead>
          <tr>
            <th>#</th>
            <th>Username</th>
            <th>Point</th>
            <th>Type</th>
            <th>Date</th>
          </tr>
        </thead>
        <tbody>
          {transactions &&
            transactions.map((transaction, index) => (
              <tr key={transaction._id}>
                <td>{index + 1 + (currentPage - 1) * itemsPerPage}</td>
                <td>{transaction.username}</td>
                <td>{transaction.point}</td>
                <td>{transaction.type}</td>
                <td>{formatDateTime(transaction.date)}</td>
              </tr>
            ))}
          {(!transactions || !transactions.length) && (
            <tr className="text-center">
              <td colSpan={5}>No records</td>
            </tr>
          )}
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

export default TransactionTable;
