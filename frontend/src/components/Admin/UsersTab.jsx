// Admin user management tab.
import React from "react";

const UsersTab = ({
  users,
  activeUserSubTab,
  onSetActiveUserSubTab,
  onShowAddUserModal,
}) => {
  const subTabs = [
    { id: "all", label: "All Users", count: users.length },
    {
      id: "users",
      label: "Regular Users",
      count: users.filter((u) => u.role === "user").length,
    },
    {
      id: "admins",
      label: "Administrators",
      count: users.filter((u) => u.role === "admin").length,
    },
    {
      id: "stock",
      label: "Stock Managers",
      count: users.filter((u) => u.role === "stock").length,
    },
  ];

  return (
    <>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="mb-0">User Management</h2>
        <button className="btn btn-primary" onClick={onShowAddUserModal}>
          <i className="fas fa-plus me-2"></i>Add User
        </button>
      </div>

      <div className="mb-4">
        <ul className="nav nav-tabs user-subtabs">
          {subTabs.map((tab) => (
            <li className="nav-item" key={tab.id}>
              <button
                className={`nav-link ${activeUserSubTab === tab.id ? "active" : ""}`}
                onClick={() => onSetActiveUserSubTab(tab.id)}
              >
                {tab.label} ({tab.count})
              </button>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
};

export default UsersTab;
