// Admin modal for editing an existing user.
import React, { useState } from "react";

// Builds the edit-user form state from the selected user.
const buildFormState = (user) => ({
  username: user?.username || "",
  email: user?.email || "",
  role: user?.role || "user",
  status: user?.status || "active",
});

// Admin edit-user modal component.
const EditUserModalContent = ({ user, onClose, onSubmit }) => {
  const [formData, setFormData] = useState(() => buildFormState(user));

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  return (
    <>
      <div
        className="modal fade show"
        style={{ display: "block", backgroundColor: "rgba(0,0,0,0.5)" }}
        tabIndex="-1"
      >
        <div className="modal-dialog admin-modal">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Edit User: {user.username}</h5>
              <button
                type="button"
                className="btn-close"
                onClick={onClose}
              ></button>
            </div>
            <div className="modal-body">
              <form id="editUserForm" onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label className="form-label">Username *</label>
                  <input
                    type="text"
                    className="form-control"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Email *</label>
                  <input
                    type="email"
                    className="form-control"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Role *</label>
                  {user.role === "admin" ? (
                    <input
                      type="text"
                      className="form-control"
                      value="Admin"
                      readOnly
                    />
                  ) : (
                    <select
                      className="form-select"
                      name="role"
                      value={formData.role}
                      onChange={handleChange}
                      required
                    >
                      <option value="user">User</option>
                      <option value="stock">Stock Manager</option>
                    </select>
                  )}
                </div>
                <div className="mb-3">
                  <label className="form-label">Status *</label>
                  <select
                    className="form-select"
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    required
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                    <option value="suspended">Suspended</option>
                  </select>
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
                form="editUserForm"
                className="btn btn-primary"
              >
                Update User
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="modal-backdrop fade show"></div>
    </>
  );
};

const EditUserModal = ({ show, onClose, user, onSubmit }) => {
  if (!show || !user) {
    return null;
  }

  const modalKey = user.id || user.username || "edit-user";

  return (
    <EditUserModalContent
      key={modalKey}
      user={user}
      onClose={onClose}
      onSubmit={onSubmit}
    />
  );
};

export default EditUserModal;
