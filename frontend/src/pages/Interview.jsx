import { useState } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { submitAnswer } from "../services/interviewApi";

function Interview() {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const [currentQuestion, setCurrentQuestion] = useState(location.state?.question || null);
  const [domain] = useState(location.state?.domain || "");
  const [answerText, setAnswerText] = useState("");
  const [feedback, setFeedback] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (!currentQuestion) {
    return (
      <div className="page page-center">
        <div className="card page-narrow" style={{ textAlign: "center" }}>
          <p>No active question found. Please start a new interview.</p>
          <button className="btn btn-primary" onClick={() => navigate("/domain-select")}>
            Start New Interview
          </button>
        </div>
      </div>
    );
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!answerText.trim()) return;

    setError("");
    setLoading(true);

    try {
      const response = await submitAnswer(id, currentQuestion.id, answerText);
      const { feedback: newFeedback, nextQuestion, completed, overallScore } = response.data;
      setFeedback(newFeedback);

      if (completed) {
        setTimeout(() => {
          navigate(`/interview/${id}/complete`, { state: { overallScore, domain } });
        }, 100);
      } else {
        setTimeout(() => {
          setCurrentQuestion(nextQuestion);
          setAnswerText("");
          setFeedback(null);
        }, 4000);
      }
    } catch (err) {
      const message = err.response?.data?.message || "Something went wrong submitting your answer.";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const progress = (currentQuestion.orderIndex / 5) * 100;

  return (
    <div className="page">
      <div style={{ marginBottom: "var(--space-5)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
          <span style={{ fontSize: "13px", color: "var(--color-text-secondary)" }}>
            Question {currentQuestion.orderIndex} of 5
          </span>
          <span style={{ fontSize: "13px", color: "var(--color-text-secondary)" }}>{domain?.replace("_", " ")}</span>
        </div>
        <div style={{ height: "4px", background: "var(--color-surface)", borderRadius: "2px", overflow: "hidden" }}>
          <div
            style={{
              height: "100%",
              width: `${progress}%`,
              background: "var(--color-primary)",
              transition: "width 400ms ease",
            }}
          />
        </div>
      </div>

      <div className="card" style={{ marginBottom: "var(--space-4)" }}>
        <h2 style={{ margin: 0 }}>{currentQuestion.text}</h2>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      {!feedback && (
        <form onSubmit={handleSubmit}>
          <textarea
            className="input"
            value={answerText}
            onChange={(e) => setAnswerText(e.target.value)}
            rows={8}
            placeholder="Type your answer here..."
            disabled={loading}
            required
            autoFocus
          />
          <button type="submit" className="btn btn-primary btn-lg" disabled={loading} style={{ marginTop: "var(--space-4)" }}>
            {loading ? (
              <>
                <span className="spinner" /> Getting AI feedback...
              </>
            ) : (
              "Submit Answer"
            )}
          </button>
        </form>
      )}

      {feedback && (
        <div className="card" style={{ animation: "fadeIn 300ms ease" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "var(--space-3)", marginBottom: "var(--space-4)" }}>
            <div
              style={{
                width: "56px",
                height: "56px",
                borderRadius: "50%",
                background: "var(--color-primary)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "18px",
                fontWeight: 700,
                flexShrink: 0,
              }}
            >
              {feedback.score}
            </div>
            <div>
              <p style={{ margin: 0, fontSize: "13px" }}>Score</p>
              <strong style={{ fontSize: "16px" }}>{feedback.score} / 10</strong>
            </div>
          </div>
          <p><strong style={{ color: "var(--color-text-primary)" }}>Strengths:</strong> {feedback.strengths}</p>
          <p><strong style={{ color: "var(--color-text-primary)" }}>Weaknesses:</strong> {feedback.weaknesses}</p>
          <p style={{ marginBottom: 0 }}><strong style={{ color: "var(--color-text-primary)" }}>Tip:</strong> {feedback.improvementTip}</p>
          <p style={{ marginTop: "var(--space-4)", marginBottom: 0, fontSize: "13px", fontStyle: "italic", display: "flex", alignItems: "center", gap: "8px" }}>
            <span className="spinner" style={{ width: "12px", height: "12px" }} /> Loading next question...
          </p>
        </div>
      )}
    </div>
  );
}

export default Interview;