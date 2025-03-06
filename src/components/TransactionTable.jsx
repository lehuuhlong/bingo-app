import React, { useEffect, useState } from 'react';
import { getTransactions, getTransactionsById } from '../services/transactionService';
import CustomPagination from './CustomPagination';

const TransactionTable = (props) => {
  const { user } = props;
  const [transactions, setTransactions] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    fetchTransactions(1);
  }, []);

  const fetchTransactions = async (page) => {
    try {
      let response = {};

      switch (user?.role) {
        case 'admin':
          response = await getTransactions(page);
          break;
        case 'user':
          response = await getTransactionsById(page, user?.username);
          break;
        default:
          break;
      }

      setTransactions(response.transactions);
      setTotalPages(response.totalPages);
      setCurrentPage(page);
    } catch (error) {
      console.error('Error fetching transactions', error);
    }
  };

  return (
    <div className="mt-3">
      <h4 className="text-secondary text-center">📋Transaction History</h4>
      <table className="table table-hover variant table-bordered shadow-sm text-center">
        <thead className="table-secondary">
          <tr>
            <th>#</th>
            <th>Username</th>
            <th>Point</th>
            <th>Type</th>
            <th>Date</th>
            <th>Note</th>
            {user?.role === 'admin' && <th>Last Modified Time</th>}
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
                <td>{transaction.createdAt}</td>
                <td>{transaction.note}</td>
                {user?.role === 'admin' && <td>{transaction.updatedAt}</td>}
              </tr>
            ))}
          {(!transactions || !transactions.length) && (
            <tr className="text-center">
              <td colSpan={6}>No records</td>
            </tr>
          )}
        </tbody>
      </table>

      <CustomPagination totalPages={totalPages} currentPage={currentPage} onPageChange={fetchTransactions} />
    </div>
  );
};

export default TransactionTable;
