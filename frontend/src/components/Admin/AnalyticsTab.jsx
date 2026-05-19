// Admin analytics dashboard tab.
import React from "react";
import { calculateUserStats, calculatePostStats } from "./utils";

// Admin analytics dashboard tab component.
const AnalyticsTab = ({ users, posts }) => {
  const userStats = calculateUserStats(users);
  const postStats = calculatePostStats(posts);

  return (
    <>
      <h2 className="mb-4">Platform Analytics</h2>
      <div className="row">
        <div className="col-md-6">
          <div className="admin-dashboard-card">
            <h5>User Growth</h5>
            <div className="analytics-placeholder">
              <i className="fas fa-chart-line fa-3x text-primary mb-3"></i>
              <p className="text-muted">Total Users: {userStats.total}</p>
              <p className="text-muted">Active Users: {userStats.active}</p>
              <p className="text-muted">
                New Users (Last 30 days): {userStats.newThisMonth}
              </p>
            </div>
          </div>
        </div>
        <div className="col-md-6">
          <div className="admin-dashboard-card">
            <h5>Community Activity</h5>
            <div className="analytics-placeholder">
              <i className="fas fa-comments fa-3x text-primary mb-3"></i>
              <p className="text-muted">Total Posts: {postStats.total}</p>
              <p className="text-muted">Total Likes: {postStats.totalLikes}</p>
              <p className="text-muted">
                Total Comments: {postStats.totalComments}
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AnalyticsTab;
