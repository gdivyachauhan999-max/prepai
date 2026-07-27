import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getDashboardSummary } from "../services/interviewApi";
import NavBar from "../components/NavBar";

function StatCard({ label, value, accent }) {
  return (
    <div className="card" style={{ flex: 1 }}>
      <p style={{ margin: 0, fontSize: "13px", textTransform: "uppercase", letterSpacing: "0.04em" }}>{label}</p>
      <h2 style={{ margin: "8px 0 0", fontSize: "32px", color: accent || "var(--color-text-primary)" }}>{value}</h2>
    </div>
  );
}

function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    getDashboardSummary()
      .then((res) => setSummary(res.data))
      .catch(() => setError("Could not load dashboard stats. Please refresh."))
      .finally(() => setLoading(false));
  }, []);

  return (
    <>
      <NavBar active="dashboard" />
      <div className="page">
        <h1>Welcome back, {user?.name?.split(" ")[0]}</h1>
        <p style={{ marginBottom: "var(--space-6)" }}>Here's how your practice is going.</p>

        {error && <div className="alert alert-error">{error}</div>}

        {loading && (
          <div style={{ display: "flex", gap: "var(--space-4)", marginBottom: "var(--space-6)" }}>
            <div className="skeleton" style={{ flex: 1, height: "90px" }} />
            <div className="skeleton" style={{ flex: 1, height: "90px" }} />
          </div>
        )}

        {!loading && summary && (
          <>
            <div style={{ display: "flex", gap: "var(--space-4)", marginBottom: "var(--space-6)" }}>
              <StatCard label="Total Interviews" value={summary.totalInterviews} />
              <StatCard
                label="Average Score"
                value={summary.averageScore != null ? `${summary.averageScore.toFixed(1)} / 10` : "—"}
                accent="var(--color-primary)"
              />
            </div>

            {summary.byDomain && Object.keys(summary.byDomain).length > 0 && (
              <div className="card" style={{ marginBottom: "var(--space-6)" }}>
                <h3 style={{ marginBottom: "var(--space-4)" }}>Score by Domain</h3>
                {Object.entries(summary.byDomain).map(([domain, score]) => (
                  <div
                    key={domain}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      padding: "10px 0",
                      borderBottom: "1px solid var(--color-border)",
                    }}
                  >
                    <span style={{ fontSize: "14px" }}>{domain.replace("_", " ")}</span>
                    <strong>{score.toFixed(1)} / 10</strong>
                  </div>
                ))}
              </div>
            )}

            {summary.totalInterviews === 0 && (
              <div className="card" style={{ textAlign: "center", padding: "var(--space-7)" }}>
                <p style={{ marginBottom: "var(--space-4)" }}>
                  No interviews yet — start your first mock interview to see stats here.
                </p>
              </div>
            )}
          </>
        )}

        <button
          className="btn btn-primary btn-lg"
          onClick={() => navigate("/domain-select")}
          style={{ marginTop: "var(--space-2)" }}
        >
          Start New Mock Interview
        </button>
      </div>
    </>
  );
}

export default Dashboard;