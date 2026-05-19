// Sidebar navigation for the admin panel.
import React from "react";

// Admin sidebar navigation component.
const AdminSidebar = ({ activeTab, onTabChange, liveChatCount }) => {
  const tabs = [
    { id: "dashboard", label: "Dashboard", icon: "tachometer-alt" },
    { id: "users", label: "User Management", icon: "users" },
    { id: "posts", label: "Community Posts", icon: "comments" },
    { id: "home-community-posts", label: "Home Community Posts", icon: "home" },
    { id: "live-chat", label: "Live Chat", icon: "comment-dots" },
    { id: "analytics", label: "Analytics", icon: "chart-bar" },
    { id: "status", label: "Manage Status", icon: "list" },
    { id: "system", label: "System Settings", icon: "cog" },
  ];

  return (
    <div className="admin-sidebar">
      <h5 className="mb-4">Admin Panel</h5>
      <ul className="nav nav-pills flex-column admin-panel-nav">
        {tabs.map((tab) => (
          <li className="nav-item" key={tab.id}>
            <button
              className={`nav-link ${activeTab === tab.id ? "active" : ""}`}
              onClick={() => onTabChange(tab.id)}
            >
              <i className={`fas fa-${tab.icon} me-2`}></i>
              {tab.label}
              {tab.id === "live-chat" && liveChatCount > 0 && (
                <span className="badge bg-primary ms-2">{liveChatCount}</span>
              )}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AdminSidebar;
