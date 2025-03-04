import React, { useEffect, useState } from 'react';
import { Pagination } from 'react-bootstrap';
import { getTransactions } from '../services/transactionService';

const TransactionTable = () => {
  const [transactions, setTransactions] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    fetchTransactions(currentPage);
  }, [currentPage]);

  const fetchTransactions = async (page) => {
    try {
      const response = await getTransactions(page);
      setTransactions(response.transactions);
      setTotalPages(response.totalPages);
    } catch (error) {
      console.error('Error fetching transactions', error);
    }
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleFormatDate = (date) => {
    const dateFormat = new Date(date);
    return dateFormat.toISOString().replace('T', ' ').replace(/\.\d+Z/, '');
  } 

  return (
    <div className="mt-3">
      <h4 className="text-center">Transaction History</h4>
      <table className="table table-striped table-bordered shadow-sm">
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
          {transactions.map((transaction, index) => (
            <tr key={transaction._id}>
              <td>{index + 1 + (currentPage - 1) * itemsPerPage}</td>
              <td>{transaction.username}</td>
              <td>{transaction.point}</td>
              <td>{transaction.type}</td>
              <td>{handleFormatDate(transaction.date)}</td>
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

export default TransactionTable;
