// Stock manager modal for viewing request details.
import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBook, faCheck, faTimes } from "@fortawesome/free-solid-svg-icons";
import StatusBadge from "../Common/StatusBadge";

// Renders the modal for reviewing a book request and taking action.
const RequestDetailsModal = ({
  show,
  onClose,
  selectedRequest,
  stock_managerNotes,
  onNotesChange,
  onApprove,
  onReject,
}) => {
  if (!show || !selectedRequest) return null;

  return (
    <>
      <div
        className="modal fade show"
        style={{ display: "block", backgroundColor: "rgba(0,0,0,0.5)" }}
        tabIndex="-1"
      >
        <div className="modal-dialog stock-manager-modal modal-lg">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">
                <FontAwesomeIcon icon={faBook} className="me-2" />
                Request Details
              </h5>
              <button
                type="button"
                className="btn-close"
                onClick={onClose}
              ></button>
            </div>
            <div className="modal-body">
              <div className="mb-3">
                <h6>Book Information</h6>
                <p>
                  <strong>Title:</strong> {selectedRequest.bookTitle}
                </p>
                <p>
                  <strong>Author:</strong> {selectedRequest.author}
                </p>
                {selectedRequest.isbn && (
                  <p>
                    <strong>ISBN:</strong> {selectedRequest.isbn}
                  </p>
                )}
                <p>
                  <strong>Category:</strong>{" "}
                  {selectedRequest.category || "Not specified"}
                </p>
              </div>
              <div className="mb-3">
                <h6>Requester Information</h6>
                <p>
                  <strong>Name:</strong> {selectedRequest.userName}
                </p>
                <p>
                  <strong>Email:</strong> {selectedRequest.userEmail}
                </p>
                <p>
                  <strong>Requested:</strong>{" "}
                  {new Date(selectedRequest.dateRequested).toLocaleString()}
                </p>
                <p>
                  <strong>Status:</strong>
                  <StatusBadge
                    status={selectedRequest.status}
                    type="request"
                    className="ms-2"
                  />
                </p>
              </div>
              {selectedRequest.reason && (
                <div className="mb-3">
                  <h6>Request Reason</h6>
                  <p>{selectedRequest.reason}</p>
                </div>
              )}
              {selectedRequest.stock_managerNotes && (
                <div className="mb-3">
                  <h6>Stock Manager Notes</h6>
                  <p>{selectedRequest.stock_managerNotes}</p>
                </div>
              )}
              <div className="mb-3">
                <h6>Add Notes</h6>
                <textarea
                  className="form-control"
                  rows="3"
                  placeholder="Add notes about this request..."
                  value={stock_managerNotes}
                  onChange={(e) => onNotesChange(e.target.value)}
                ></textarea>
              </div>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={onClose}
              >
                Close
              </button>
              {selectedRequest.status === "Pending" && (
                <>
                  <button
                    type="button"
                    className="btn btn-success"
                    onClick={() =>
                      onApprove(selectedRequest.id, stock_managerNotes)
                    }
                  >
                    <FontAwesomeIcon icon={faCheck} className="me-2" />
                    Approve
                  </button>
                  <button
                    type="button"
                    className="btn btn-danger"
                    onClick={() =>
                      onReject(selectedRequest.id, stock_managerNotes)
                    }
                  >
                    <FontAwesomeIcon icon={faTimes} className="me-2" />
                    Reject
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
      <div className="modal-backdrop fade show"></div>
    </>
  );
};

export default RequestDetailsModal;
