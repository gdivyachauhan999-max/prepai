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
    <div style={{ maxWidth: "700px", margin: "40px auto", padding: "24px" }}>
      <button onClick={() => navigate("/history")} style={{ marginBottom: "24px" }}>
        Back to History
      </button>

      {loading && <p>Loading...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      {summary && (
        <>
          <h1>
            {summary.domain} Interview {summary.overallScore != null && `— ${summary.overallScore.toFixed(1)} / 10`}
          </h1>

          {summary.questions.map((q, index) => (
            <div
              key={index}
              style={{
                border: "1px solid #ccc",
                borderRadius: "8px",
                padding: "16px",
                marginBottom: "16px",
              }}
            >
              <p>
                <strong>Q{index + 1}: {q.text}</strong>
              </p>
              <p style={{ color: "#555" }}>Your answer: {q.answer || "Not answered"}</p>
              {q.feedback && (
                <div style={{ marginTop: "8px", paddingTop: "8px", borderTop: "1px solid #eee" }}>
                  <p>Score: {q.feedback.score} / 10</p>
                  <p>Strengths: {q.feedback.strengths}</p>
                  <p>Weaknesses: {q.feedback.weaknesses}</p>
                  <p>Tip: {q.feedback.improvementTip}</p>
                </div>
              )}
            </div>
          ))}
        </>
      )}
    </div>
  );
}

export default HistoryDetail;