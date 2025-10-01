import React from "react";

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  const pageNumbers = [];
  for (let i = 1; i <= totalPages; i++) {
    pageNumbers.push(i);
  }

  return (
    <nav aria-label="Page navigation">
      <ul className="pagination justify-content-center mt-4">
        {currentPage > 1 && (
          <>
            <li className="page-item">
              <button
                className="page-link"
                onClick={() => onPageChange(1)}
                aria-label="First"
              >
                &laquo;
              </button>
            </li>
            <li className="page-item">
              <button
                className="page-link"
                onClick={() => onPageChange(currentPage - 1)}
                aria-label="Previous"
              >
                &lsaquo;
              </button>
            </li>
          </>
        )}

        {pageNumbers.map(
          (number) =>
            number >= currentPage - 2 &&
            number <= currentPage + 2 && (
              <li
                key={number}
                className={`page-item ${
                  currentPage === number ? "active" : ""
                }`}
              >
                <button
                  className="page-link"
                  onClick={() => onPageChange(number)}
                >
                  {number}
                </button>
              </li>
            )
        )}

        {currentPage < totalPages && (
          <>
            <li className="page-item">
              <button
                className="page-link"
                onClick={() => onPageChange(currentPage + 1)}
                aria-label="Next"
              >
                &rsaquo;
              </button>
            </li>
            <li className="page-item">
              <button
                className="page-link"
                onClick={() => onPageChange(totalPages)}
                aria-label="Last"
              >
                &raquo;
              </button>
            </li>
          </>
        )}
      </ul>
    </nav>
  );
};

export default Pagination;
