// Marketplace pagination controls for book result pages.
import React from "react";
import { Pagination } from "react-bootstrap";

// Renders marketplace pagination controls for filtered book results.
const PaginationSection = ({
  currentPage,
  totalPages,
  paginate,
  filteredBooks,
  booksPerPage,
  filters,
}) => {
  if (
    filters.category === "all" &&
    totalPages > 1 &&
    filteredBooks.length > booksPerPage
  ) {
    return (
      <div className="mt-4">
        <Pagination className="justify-content-center">
          <Pagination.Prev
            disabled={currentPage === 1}
            onClick={() => paginate(currentPage - 1)}
          />

          {[...Array(Math.min(5, totalPages))].map((_, index) => {
            let pageNumber;
            if (totalPages <= 5) {
              pageNumber = index + 1;
            } else if (currentPage <= 3) {
              pageNumber = index + 1;
            } else if (currentPage >= totalPages - 2) {
              pageNumber = totalPages - 4 + index;
            } else {
              pageNumber = currentPage - 2 + index;
            }

            return (
              <Pagination.Item
                key={pageNumber}
                active={pageNumber === currentPage}
                onClick={() => paginate(pageNumber)}
              >
                {pageNumber}
              </Pagination.Item>
            );
          })}

          <Pagination.Next
            disabled={currentPage === totalPages}
            onClick={() => paginate(currentPage + 1)}
          />
        </Pagination>

        <div className="text-center text-muted small mt-2">
          Page {currentPage} of {totalPages} • {filteredBooks.length} books
        </div>
      </div>
    );
  }

  return null;
};

export default PaginationSection;
