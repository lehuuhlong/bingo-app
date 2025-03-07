import React, { useEffect, useState } from 'react';
import ProgressBar from 'react-bootstrap/ProgressBar';
import { getStatisticsNumber } from '../services/statisticsService';
import CustomPagination from './CustomPagination';

const BingoStatistics = () => {
  const [numbers, setNumbers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [maxCount, setMaxCount] = useState(1);

  useEffect(() => {
    fetchStatistics(1);
  }, []);

  const fetchStatistics = async (page) => {
    try {
      const response = await getStatisticsNumber(page);
      setNumbers(response.statistics);
      setTotalPages(response.totalPages);
      if (page === 1) setMaxCount(Math.max(...response.statistics.map((num) => num.count)));
      setCurrentPage(page);
    } catch (error) {
      console.error('Error fetching numbers', error);
    }
  };

  const calculatePercentage = (count) => {
    if (maxCount === 0) return 0;
    return (count / maxCount) * 100;
  };

  return (
    <div className="mt-3">
      <h4 className="text-secondary text-center">📊Bingo Number Statistics</h4>
      <div className="mb-3">
        {numbers &&
          numbers.map((number) => (
            <div className="d-flex justify-content-center mb-2" key={number._id}>
              <div
                key={number._id}
                className="mr-1 mb-1 rounded-circle d-flex align-items-center justify-content-center number-ball-statistics bg-warning text-dark"
                style={{
                  width: '50px',
                  height: '50px',
                  fontSize: '1.05rem',
                  boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
                }}
              >
                <strong
                  style={{
                    margin: 0,
                  }}
                >
                  {number.number}
                </strong>
              </div>
              <div className="mr-3 ml-3" style={{ width: '300px', marginTop: '20px' }}>
                <ProgressBar striped variant="warning" now={calculatePercentage(number.count)} />
              </div>
              <div className="d-flex align-items-center">
                <strong className="text-secondary" style={{ fontSize: '1rem' }}>
                  {number.count} times
                </strong>
              </div>
            </div>
          ))}
      </div>
      <CustomPagination totalPages={totalPages} currentPage={currentPage} onPageChange={fetchStatistics} />
    </div>
  );
};

export default BingoStatistics;
