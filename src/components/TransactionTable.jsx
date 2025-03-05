import React, { useEffect, useState } from 'react';
import { getTransactions, getTransactionsById } from '../services/transactionService';
import CustomPagination from './CustomPagination';

const TransactionTable = (props) => {
  const { user } = props;
  const [transactions, setTransactions] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [display, setDisplay] = useState(true);
  const itemsPerPage = 10;

  useEffect(() => {
    fetchTransactions(currentPage);
  }, [currentPage, user]);

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

  const handleDisplay = () => {
    setDisplay(!display);
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
      <h4 className="text-secondary text-center">
        📋Transaction History <span style={{ cursor: 'pointer' }}>ℹ️</span>
      </h4>
      {display && (
        <>
          <table className="table table-hover variant table-bordered shadow-sm text-center">
            <thead className="table-secondary">
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

          <CustomPagination totalPages={totalPages} currentPage={currentPage} onPageChange={fetchTransactions} />
        </>
      )}
    </div>
  );
};

export default TransactionTable;
