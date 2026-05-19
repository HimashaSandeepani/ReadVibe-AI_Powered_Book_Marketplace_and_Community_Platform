// Stock manager modal for updating tracking information.
import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faShippingFast } from "@fortawesome/free-solid-svg-icons";

// Renders the order tracking update modal for the stock manager.
const TrackingModal = ({
  show,
  onClose,
  selectedOrder,
  trackingUpdate,
  onTrackingUpdate,
  onSave,
}) => {
  if (!show || !selectedOrder) return null;

  // Updates a single tracking field in the form state.
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    onTrackingUpdate((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Submits the tracking update form.
  const handleSubmit = (e) => {
    e.preventDefault();
    onSave();
  };

  return (
    <>
      <div
        className="modal fade show"
        style={{ display: "block", backgroundColor: "rgba(0,0,0,0.5)" }}
        tabIndex="-1"
      >
        <div className="modal-dialog stock-manager-modal">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">
                <FontAwesomeIcon icon={faShippingFast} className="me-2" />
                Update Order Tracking
              </h5>
              <button
                type="button"
                className="btn-close"
                onClick={onClose}
              ></button>
            </div>
            <div className="modal-body">
              <div className="mb-3">
                <p>
                  <strong>Order ID:</strong> {selectedOrder.id}
                </p>
                <p>
                  <strong>Customer:</strong> {selectedOrder.customer}
                </p>
                <p>
                  <strong>Current Status:</strong> {selectedOrder.status}
                </p>
              </div>
              <form id="trackingForm" onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label className="form-label">Status *</label>
                  <select
                    className="form-select"
                    name="status"
                    value={trackingUpdate.status}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="Processing">Processing</option>
                    <option value="Shipped">Shipped</option>
                    <option value="Out for Delivery">Out for Delivery</option>
                    <option value="Delivered">Delivered</option>
                    <option value="Returned">Returned</option>
                  </select>
                </div>
                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Courier</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="e.g., Aramex, DHL"
                      name="courier"
                      value={trackingUpdate.courier}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Tracking Number</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Tracking number"
                      name="trackingNumber"
                      value={trackingUpdate.trackingNumber}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
                <div className="mb-3">
                  <label className="form-label">Location</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Current location"
                    name="location"
                    value={trackingUpdate.location}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Notes</label>
                  <textarea
                    className="form-control"
                    rows="3"
                    placeholder="Additional notes"
                    name="note"
                    value={trackingUpdate.note}
                    onChange={handleInputChange}
                  ></textarea>
                </div>
              </form>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={onClose}
              >
                Cancel
              </button>
              <button
                type="submit"
                form="trackingForm"
                className="btn btn-primary"
              >
                Save Tracking Update
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="modal-backdrop fade show"></div>
    </>
  );
};

export default TrackingModal;
