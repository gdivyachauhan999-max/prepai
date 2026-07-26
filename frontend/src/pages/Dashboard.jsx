import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getDashboardSummary } from "../services/interviewApi";

function Dashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    getDashboardSummary()
      .then((res) => setSummary(res.data))
      .catch(() => setError("Could not load dashboard stats."))
      .finally(() => setLoading(false));
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div style={{ maxWidth: "700px", margin: "40px auto", padding: "24px" }}>
      <nav style={{ display: "flex", justifyContent: "space-between", marginBottom: "40px" }}>
        <strong>PrepAI</strong>
        <div>
          <button onClick={() => navigate("/history")} style={{ marginRight: "12px" }}>
            History
          </button>
          <button onClick={handleLogout}>Logout</button>
        </div>
      </nav>

      <h1>Welcome, {user?.name}!</h1>

      {loading && <p>Loading your stats...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      {summary && (
        <>
          <div style={{ display: "flex", gap: "16px", margin: "24px 0" }}>
            <div style={{ border: "1px solid #ccc", borderRadius: "8px", padding: "16px", flex: 1 }}>
              <p style={{ color: "#888", margin: 0 }}>Total Interviews</p>
              <h2 style={{ margin: "4px 0" }}>{summary.totalInterviews}</h2>
            </div>
            <div style={{ border: "1px solid #ccc", borderRadius: "8px", padding: "16px", flex: 1 }}>
              <p style={{ color: "#888", margin: 0 }}>Average Score</p>
              <h2 style={{ margin: "4px 0" }}>
                {summary.averageScore != null ? summary.averageScore.toFixed(1) : "--"} / 10
              </h2>
            </div>
          </div>

          {summary.byDomain && Object.keys(summary.byDomain).length > 0 && (
            <div style={{ marginBottom: "24px" }}>
              <h3>Score by Domain</h3>
              {Object.entries(summary.byDomain).map(([domain, score]) => (
                <p key={domain}>
                  {domain}: {score.toFixed(1)} / 10
                </p>
              ))}
            </div>
          )}
        </>
      )}

      <button
        onClick={() => navigate("/domain-select")}
        style={{ padding: "14px 28px", fontSize: "16px", marginTop: "12px" }}
      >
        Start New Mock Interview
      </button>
    </div>
  );
}

export default Dashboard;