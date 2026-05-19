// Admin dashboard overview tab.
import { useEffect, useState } from "react";
import StatsCards from "./StatsCards";
import { fetchLiveChatThreadsSummary } from "../../utils/liveChat";

// Formats a timestamp into a relative time label.
const formatRelativeTime = (value) => {
  if (!value) return "Recently";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Recently";

  const diffMs = Date.now() - date.getTime();
  const diffMinutes = Math.max(1, Math.floor(diffMs / 60000));

  if (diffMinutes < 60) {
    return `${diffMinutes} minute${diffMinutes === 1 ? "" : "s"} ago`;
  }

  const diffHours = Math.floor(diffMinutes / 60);
  if (diffHours < 24) {
    return `${diffHours} hour${diffHours === 1 ? "" : "s"} ago`;
  }

  const diffDays = Math.floor(diffHours / 24);
  return `${diffDays} day${diffDays === 1 ? "" : "s"} ago`;
};

// Maps admin statuses to Bootstrap variants.
const getStatusClass = (status) => {
  switch (status) {
    case "Active":
      return "success";
    case "New":
      return "warning";
    case "Flagged":
      return "danger";
    default:
      return "secondary";
  }
};

// Admin dashboard tab component.
const DashboardTab = ({ users, posts, liveChatCount = 0, liveChatThreads = [] }) => {
  const [apiLiveChatCount, setApiLiveChatCount] = useState(0);

  useEffect(() => {
    let isMounted = true;

    // Loads the live chat count from the API.
    const loadLiveChatCount = async () => {
      try {
        const summary = await fetchLiveChatThreadsSummary();
        if (!isMounted) return;

        setApiLiveChatCount(Number(summary.totalCount) || summary.threads.length || 0);
      } catch {
        if (!isMounted) return;
        setApiLiveChatCount(0);
      }
    };

    void loadLiveChatCount();

    return () => {
      isMounted = false;
    };
  }, []);

  const userStats = {
    total: users.length,
    newThisMonth: users.filter((user) => {
      const joinDate = new Date(user.joinDate);
      const now = new Date();
      const thirtyDaysAgo = new Date(now.setDate(now.getDate() - 30));
      return joinDate >= thirtyDaysAgo;
    }).length,
  };

  const postStats = {
    total: posts.length,
  };

  const liveChatStats = {
    total: Math.max(
      Number(apiLiveChatCount) || 0,
      Number(liveChatCount) || 0,
      Array.isArray(liveChatThreads) ? liveChatThreads.length : 0,
    ),
  };

  const recentActivity = [
    ...users.map((user) => ({
      user: user.username || user.name || user.email || "User",
      activity: "Account created",
      time: formatRelativeTime(user.joinDate),
      status: (user.status || "active").toLowerCase() === "active" ? "Active" : "New",
      sortKey: new Date(user.joinDate || 0).getTime(),
    })),
    ...posts.map((post) => ({
      user: post.user || post.postedBy || "User",
      activity: post.status === "Flagged" ? "Community post flagged" : "Posted in community",
      time: formatRelativeTime(post.timestamp),
      status: post.status || "Active",
      sortKey: new Date(post.timestamp || 0).getTime(),
    })),
    ...liveChatThreads.map((thread) => {
      const latestMessage = Array.isArray(thread.messages) && thread.messages.length > 0
        ? thread.messages[thread.messages.length - 1]
        : null;
      const activityTime =
        latestMessage?.timestamp || thread.updatedAt || thread.createdAt || null;

      return {
        user: thread.userName || thread.userEmail || "User",
        activity: latestMessage?.senderRole === "admin" ? "Admin replied in live chat" : "Started live chat",
        time: formatRelativeTime(activityTime),
        status: latestMessage?.senderRole === "user" ? "Active" : "New",
        sortKey: new Date(activityTime || 0).getTime(),
      };
    }),
  ]
    .filter((entry) => Number.isFinite(entry.sortKey))
    .sort((left, right) => right.sortKey - left.sortKey)
    .slice(0, 5);

  return (
    <>
      <h2 className="mb-4">Admin Dashboard</h2>

      <StatsCards userStats={userStats} postStats={postStats} liveChatStats={liveChatStats} />

      <div className="admin-dashboard-card">
        <h4 className="mb-4">Recent Platform Activity</h4>
        <div className="table-responsive">
          <table className="table table-hover admin-table">
            <thead>
              <tr>
                <th>User</th>
                <th>Activity</th>
                <th>Time</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {recentActivity.map((activity, index) => (
                <tr key={index}>
                  <td>{activity.user}</td>
                  <td>{activity.activity}</td>
                  <td>{activity.time}</td>
                  <td>
                    <span className={`badge bg-${getStatusClass(activity.status)}`}>
                      {activity.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default DashboardTab;
