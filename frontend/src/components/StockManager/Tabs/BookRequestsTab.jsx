// Stock manager tab for book request handling.
import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBook } from "@fortawesome/free-solid-svg-icons";
import StatsCard from "../Common/StatsCard";
import StatusBadge from "../Common/StatusBadge";
import ActionButtons from "../Common/ActionButtons";

const BookRequestsTab = ({
  stats,
  requests,
  onViewRequestDetails,
  onApproveRequest,
  onRejectRequest,
  onChangeTab,
}) => {
  return (
    <>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="mb-0">Book Requests from Users</h2>
        <div className="d-flex gap-2">
          <button
            className="btn btn-outline-primary"
            onClick={() => onChangeTab("book-requests")}
          >
            All ({stats.total})
          </button>
          <button
            className="btn btn-outline-warning"
            onClick={() => onChangeTab("book-requests")}
          >
            Pending ({stats.pending})
          </button>
        </div>
      </div>

      {/* Request Statistics */}
      <div className="row mb-4">
        <div className="col-md-3 col-sm-6 mb-3">
          <StatsCard number={stats.total} label="Total Requests" />
        </div>
        <div className="col-md-3 col-sm-6 mb-3">
          <StatsCard number={stats.pending} label="Pending" variant="warning" />
        </div>
        <div className="col-md-3 col-sm-6 mb-3">
          <StatsCard
            number={stats.approved}
            label="Approved"
            variant="success"
          />
        </div>
        <div className="col-md-3 col-sm-6 mb-3">
          <StatsCard
            number={stats.rejected}
            label="Rejected"
            variant="danger"
          />
        </div>
      </div>

      <div className="stock-manager-dashboard-card">
        <div className="table-responsive">
          <table className="table table-hover stock-manager-table">
            <thead>
              <tr>
                <th>Request ID</th>
                <th>Book Details</th>
                <th>Requester</th>
                <th>Date</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {requests.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center py-5">
                    <FontAwesomeIcon
                      icon={faBook}
                      className="fa-3x text-muted mb-3"
                    />
                    <p>No book requests found</p>
                  </td>
                </tr>
              ) : (
                requests.map((request) => (
                  <tr key={request.id}>
                    <td>REQ{request.id.toString().slice(-6)}</td>
                    <td>
                      <div>
                        <strong>{request.bookTitle}</strong>
                        <div className="text-muted">{request.author}</div>
                        {request.isbn && (
                          <small className="text-muted">
                            ISBN: {request.isbn}
                          </small>
                        )}
                      </div>
                    </td>
                    <td>
                      <div>
                        <strong>{request.userName}</strong>
                        <div className="text-muted">{request.userEmail}</div>
                      </div>
                    </td>
                    <td>
                      {new Date(request.dateRequested).toLocaleDateString()}
                    </td>
                    <td>
                      <StatusBadge status={request.status} type="request" />
                    </td>
                    <td>
                      <ActionButtons
                        onView={() => onViewRequestDetails(request.id)}
                        onApprove={() => onApproveRequest(request.id)}
                        onReject={() => onRejectRequest(request.id)}
                        showView={true}
                        showApprove={request.status === "Pending"}
                        showReject={request.status === "Pending"}
                      />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default BookRequestsTab;
