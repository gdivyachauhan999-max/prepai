import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getSummary } from "../services/interviewApi";

function HistoryDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    getSummary(id)
      .then((res) => setSummary(res.data))
      .catch(() => setError("Could not load this interview."))
      .finally(() => setLoading(false));
  }, [id]);

  return (
    <div className="page">
      <button className="btn btn-ghost" onClick={() => navigate("/history")} style={{ marginBottom: "var(--space-5)" }}>
        ← Back to History
      </button>

      {loading && (
        <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-3)" }}>
          <div className="skeleton" style={{ height: "40px", width: "50%" }} />
          <div className="skeleton" style={{ height: "140px" }} />
          <div className="skeleton" style={{ height: "140px" }} />
        </div>
      )}

      {error && <div className="alert alert-error">{error}</div>}

      {summary && (
        <>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: "var(--space-6)" }}>
            <h1 style={{ margin: 0 }}>{summary.domain?.replace("_", " ")} Interview</h1>
            {summary.overallScore != null && (
              <span style={{ fontSize: "20px", fontWeight: 700, color: "var(--color-primary)" }}>
                {summary.overallScore.toFixed(1)} / 10
              </span>
            )}
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-4)" }}>
            {summary.questions.map((q, index) => (
              <div key={index} className="card">
                <p style={{ margin: "0 0 var(--space-2)", fontSize: "13px", fontWeight: 600, color: "var(--color-text-muted)" }}>
                  QUESTION {index + 1}
                </p>
                <h3 style={{ marginBottom: "var(--space-3)" }}>{q.text}</h3>
                <p style={{ marginBottom: "var(--space-4)" }}>
                  <span style={{ color: "var(--color-text-primary)", fontWeight: 600 }}>Your answer: </span>
                  {q.answer || "Not answered"}
                </p>
                {q.feedback && (
                  <div style={{ paddingTop: "var(--space-4)", borderTop: "1px solid var(--color-border)" }}>
                    <p style={{ margin: "0 0 var(--space-2)" }}>
                      <span style={{ color: "var(--color-text-primary)", fontWeight: 600 }}>Score: </span>
                      {q.feedback.score} / 10
                    </p>
                    <p style={{ margin: "0 0 var(--space-2)" }}>
                      <span style={{ color: "var(--color-text-primary)", fontWeight: 600 }}>Strengths: </span>
                      {q.feedback.strengths}
                    </p>
                    <p style={{ margin: "0 0 var(--space-2)" }}>
                      <span style={{ color: "var(--color-text-primary)", fontWeight: 600 }}>Weaknesses: </span>
                      {q.feedback.weaknesses}
                    </p>
                    <p style={{ margin: 0 }}>
                      <span style={{ color: "var(--color-text-primary)", fontWeight: 600 }}>Tip: </span>
                      {q.feedback.improvementTip}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export default HistoryDetail;