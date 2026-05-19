// Admin system settings and diagnostics tab.
import React from "react";

// Admin system settings tab component.
const SystemTab = ({
  systemSettings,
  onSystemSettingsChange,
  onSaveSettings,
}) => {
  return (
    <>
      <h2 className="mb-4">System Settings</h2>
      <div className="admin-dashboard-card">
        <form className="settings-form" onSubmit={onSaveSettings}>
          <div className="row">
            <div className="col-md-6 mb-3">
              <label className="form-label">Platform Name</label>
              <input
                type="text"
                className="form-control"
                value={systemSettings.platformName}
                onChange={(e) =>
                  onSystemSettingsChange("platformName", e.target.value)
                }
              />
            </div>
            <div className="col-md-6 mb-3">
              <label className="form-label">Maintenance Mode</label>
              <select
                className="form-select"
                value={systemSettings.maintenanceMode}
                onChange={(e) =>
                  onSystemSettingsChange("maintenanceMode", e.target.value)
                }
              >
                <option value="Disabled">Disabled</option>
                <option value="Enabled">Enabled</option>
              </select>
            </div>
          </div>
          <div className="mb-3">
            <label className="form-label" id="form-email">
              Email Notifications
            </label>
            <div className="form-check">
              <input
                className="form-check-input"
                id="form-email-input"
                type="checkbox"
                checked={systemSettings.emailNotifications}
                onChange={(e) =>
                  onSystemSettingsChange("emailNotifications", e.target.checked)
                }
              />
              <label className="form-check-label">
                Send email notifications
              </label>
            </div>
          </div>
          <button type="submit" className="btn btn-primary">
            Save Settings
          </button>
        </form>
      </div>
    </>
  );
};

export default SystemTab;
