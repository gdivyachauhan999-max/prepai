import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getHistoryList } from "../services/interviewApi";
import NavBar from "../components/NavBar";

function ScoreBadge({ score }) {
  if (score == null) return <span style={{ color: "var(--color-text-muted)", fontSize: "13px" }}>In progress</span>;
  const color = score >= 8 ? "var(--color-success)" : score >= 5 ? "var(--color-warning)" : "var(--color-danger)";
  return (
    <span style={{ color, fontWeight: 700, fontSize: "15px" }}>
      {score.toFixed(1)} <span style={{ fontWeight: 400, fontSize: "12px", color: "var(--color-text-muted)" }}>/ 10</span>
    </span>
  );
}

function History() {
  const [interviews, setInterviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    getHistoryList()
      .then((res) => setInterviews(res.data))
      .catch(() => setError("Could not load interview history. Please refresh."))
      .finally(() => setLoading(false));
  }, []);

  return (
    <>
      <NavBar active="history" />
      <div className="page">
        <h1>Interview History</h1>
        <p style={{ marginBottom: "var(--space-6)" }}>Review your past mock interviews and feedback.</p>

        {error && <div className="alert alert-error">{error}</div>}

        {loading && (
          <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-3)" }}>
            <div className="skeleton" style={{ height: "72px" }} />
            <div className="skeleton" style={{ height: "72px" }} />
            <div className="skeleton" style={{ height: "72px" }} />
          </div>
        )}

        {!loading && interviews.length === 0 && (
          <div className="card" style={{ textAlign: "center", padding: "var(--space-7)" }}>
            <p style={{ marginBottom: "var(--space-4)" }}>No interviews yet.</p>
            <button className="btn btn-primary" onClick={() => navigate("/domain-select")}>
              Start Your First Interview
            </button>
          </div>
        )}

        <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-3)" }}>
          {interviews.map((item) => (
            <div
              key={item.interviewId}
              className="card"
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                cursor: "pointer",
                transition: "border-color var(--transition)",
              }}
              onClick={() => navigate(`/history/${item.interviewId}`)}
              onMouseEnter={(e) => (e.currentTarget.style.borderColor = "var(--color-primary)")}
              onMouseLeave={(e) => (e.currentTarget.style.borderColor = "var(--color-border)")}
            >
              <div>
                <h3 style={{ margin: 0 }}>{item.domain?.replace("_", " ")}</h3>
                <p style={{ margin: "4px 0 0", fontSize: "13px" }}>
                  {item.completedAt ? new Date(item.completedAt).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" }) : "In progress"}
                </p>
              </div>
              <ScoreBadge score={item.overallScore} />
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

export default History;