import React from 'react';
import { Pagination } from 'react-bootstrap';

const CustomPagination = ({ totalPages, currentPage, onPageChange }) => {
  const generatePages = () => {
    const pages = [];
    const maxVisible = 5;

    let startPage = Math.max(1, currentPage - Math.floor(maxVisible / 2));
    let endPage = Math.min(totalPages, startPage + maxVisible - 1);

    if (endPage - startPage + 1 < maxVisible) {
      startPage = Math.max(1, endPage - maxVisible + 1);
    }

    if (startPage > 1) {
      pages.push(1);
      if (startPage > 2) {
        pages.push('...');
      }
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    if (endPage < totalPages) {
      if (endPage < totalPages - 1) {
        pages.push('...');
      }
      pages.push(totalPages);
    }

    return pages;
  };

  return (
    <Pagination className="justify-content-center">
      <Pagination.Item disabled={currentPage === 1} onClick={() => onPageChange(1)}>
        «
      </Pagination.Item>
      <Pagination.Item disabled={currentPage === 1} onClick={() => onPageChange(currentPage - 1)}>
        ‹
      </Pagination.Item>

      {generatePages().map((page, index) =>
        page === '...' ? (
          <Pagination.Item key={index} disabled>
            {page}
          </Pagination.Item>
        ) : (
          <Pagination.Item activeLabel="" key={index} active={page === currentPage} onClick={() => onPageChange(page)}>
            {page}
          </Pagination.Item>
        )
      )}

      <Pagination.Item disabled={currentPage === totalPages || totalPages === 0} onClick={() => onPageChange(currentPage + 1)}>
        ›
      </Pagination.Item>
      <Pagination.Item disabled={currentPage === totalPages || totalPages === 0} onClick={() => onPageChange(totalPages)}>
        »
      </Pagination.Item>
    </Pagination>
  );
};

export default CustomPagination;
