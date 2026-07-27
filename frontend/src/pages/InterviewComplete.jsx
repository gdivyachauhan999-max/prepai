import { useLocation, useNavigate, useParams } from "react-router-dom";

function InterviewComplete() {
  const location = useLocation();
  const navigate = useNavigate();
  const { id } = useParams();

  const overallScore = location.state?.overallScore;
  const domain = location.state?.domain;

  const getScoreColor = (score) => {
    if (score >= 8) return "var(--color-success)";
    if (score >= 5) return "var(--color-warning)";
    return "var(--color-danger)";
  };

  return (
    <div className="page page-center">
      <div className="card page-narrow" style={{ textAlign: "center", width: "100%" }}>
        <p style={{ fontSize: "13px", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "4px" }}>
          Interview Complete
        </p>
        <h1 style={{ marginBottom: "var(--space-2)" }}>{domain?.replace("_", " ")}</h1>

        <div style={{ margin: "var(--space-6) 0" }}>
          <span style={{ fontSize: "56px", fontWeight: 700, color: getScoreColor(overallScore) }}>
            {overallScore != null ? overallScore.toFixed(1) : "--"}
          </span>
          <span style={{ fontSize: "20px", color: "var(--color-text-secondary)" }}> / 10</span>
        </div>

        <div style={{ display: "flex", gap: "var(--space-3)", justifyContent: "center" }}>
          <button className="btn btn-secondary" onClick={() => navigate(`/history/${id}`)}>
            View Full Summary
          </button>
          <button className="btn btn-primary" onClick={() => navigate("/dashboard")}>
            Back to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
}

export default InterviewComplete;