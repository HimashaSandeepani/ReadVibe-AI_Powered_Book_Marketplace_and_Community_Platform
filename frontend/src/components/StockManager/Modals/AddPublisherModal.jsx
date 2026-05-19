// Stock manager modal for adding a publisher.
import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";

// Renders the add or edit publisher modal for the stock manager.
const AddPublisherModal = ({
  show,
  onClose,
  newPublisher,
  onInputChange,
  onSubmit,
  isEditing = false,
}) => {
  if (!show) return null;

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
                <FontAwesomeIcon icon={faPlus} className="me-2" />
                {isEditing ? "Edit Publisher" : "Add New Publisher"}
              </h5>
              <button
                type="button"
                className="btn-close"
                onClick={onClose}
              ></button>
            </div>
            <div className="modal-body">
              <form id="addPublisherForm" onSubmit={onSubmit}>
                <div className="row">
                  <div className="col-md-12 mb-3">
                    <label className="form-label">Publisher Name *</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Enter publisher name"
                      name="name"
                      value={newPublisher.name}
                      onChange={onInputChange}
                      required
                    />
                  </div>
                </div>
                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Email *</label>
                    <input
                      type="email"
                      className="form-control"
                      placeholder="Email address"
                      name="email"
                      value={newPublisher.email}
                      onChange={onInputChange}
                      required
                    />
                  </div>
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Phone</label>
                    <input
                      type="tel"
                      className="form-control"
                      placeholder="+94 XX XXX XXXX"
                      name="phone"
                      value={newPublisher.phone}
                      onChange={onInputChange}
                    />
                  </div>
                </div>
                <div className="mb-3">
                  <label className="form-label">Address</label>
                  <textarea
                    className="form-control"
                    rows="2"
                    placeholder="Publisher address"
                    name="address"
                    value={newPublisher.address}
                    onChange={onInputChange}
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
                form="addPublisherForm"
                className="btn btn-primary"
              >
                {isEditing ? "Update Publisher" : "Add Publisher"}
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="modal-backdrop fade show"></div>
    </>
  );
};

export default AddPublisherModal;
