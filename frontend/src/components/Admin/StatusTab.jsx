// Admin status and health overview tab.
import React, { useMemo, useState } from "react";

// Admin tab for managing custom status labels.
const StatusTab = ({ statuses = [], onSaveStatus, onDeleteStatus }) => {
  const [statusInput, setStatusInput] = useState("");
  const [selectedStatusId, setSelectedStatusId] = useState(null);

  const selectedStatus = useMemo(
    () => statuses.find((s) => s.id === selectedStatusId) || null,
    [statuses, selectedStatusId],
  );

  // Saves the current status entry.
  const handleSave = () => {
    const name = (statusInput || "").trim();
    if (!name) return;

    if (onSaveStatus) {
      onSaveStatus(name, selectedStatus ? selectedStatus.id : null);
    }
    setStatusInput("");
    setSelectedStatusId(null);
  };

  // Deletes the selected status entry.
  const handleDelete = () => {
    if (!selectedStatus || !onDeleteStatus) return;
    onDeleteStatus(selectedStatus.id);
    setStatusInput("");
    setSelectedStatusId(null);
  };

  // Clears the status form and selection.
  const handleCancel = () => {
    setStatusInput("");
    setSelectedStatusId(null);
  };

  return (
    <div className="card shadow-sm">
      <div className="card-header d-flex align-items-center py-2">
        <h5 className="mb-0">Manage Status</h5>
      </div>
      <div
        className="card-body"
        style={{ maxHeight: "480px", overflowY: "auto" }}
      >
        <div className="mb-3">
          <label className="form-label">Status name</label>
          <input
            type="text"
            className="form-control"
            placeholder="e.g. Active, Pending, Disabled"
            value={statusInput}
            onChange={(e) => setStatusInput(e.target.value)}
          />
        </div>
        <div className="d-flex justify-content-between align-items-center mb-3">
          <div className="d-flex gap-2">
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              onClick={handleCancel}
            >
              Cancel
            </button>
            <button
              type="button"
              className="btn btn-primary btn-sm"
              onClick={handleSave}
            >
              Save
            </button>
          </div>
          <button
            type="button"
            className="btn btn-outline-danger btn-sm"
            disabled={!selectedStatus}
            onClick={handleDelete}
          >
            Delete
          </button>
        </div>
        <div className="table-responsive">
          <table className="table table-hover table-sm align-middle mb-0">
            <thead style={{ backgroundColor: "#0d6efd", color: "#ffffff" }}>
              <tr>
                <th className="ps-3">Status</th>
                <th style={{ width: "120px" }}>Active</th>
              </tr>
            </thead>
            <tbody>
              {statuses.length === 0 ? (
                <tr>
                  <td colSpan={2} className="text-muted small ps-3 py-2">
                    No statuses defined.
                  </td>
                </tr>
              ) : (
                statuses.map((status) => (
                  <tr
                    key={status.id}
                    className={
                      selectedStatus && selectedStatus.id === status.id
                        ? "table-primary"
                        : ""
                    }
                    role="button"
                    style={{ cursor: "pointer" }}
                    onClick={() => {
                      setSelectedStatusId(status.id);
                      setStatusInput(status.status || "");
                    }}
                  >
                    <td className="small py-2 ps-3">{status.status}</td>
                    <td className="small py-2">
                      <span
                        className={`badge ${status.isActive ? "bg-success" : "bg-secondary"}`}
                      >
                        {status.isActive ? "Yes" : "No"}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default StatusTab;
