import { useState } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { submitAnswer } from "../services/interviewApi";

function Interview() {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const [currentQuestion, setCurrentQuestion] = useState(location.state?.question || null);
  const [domain, setDomain] = useState(location.state?.domain || "");
  const [answerText, setAnswerText] = useState("");
  const [feedback, setFeedback] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (!currentQuestion) {
    return (
      <div style={{ maxWidth: "600px", margin: "60px auto", padding: "24px" }}>
        <p>No active question found. Please start a new interview.</p>
        <button onClick={() => navigate("/domain-select")}>Start New Interview</button>
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
          navigate(`/interview/${id}/complete`, {
            state: { overallScore, domain },
          });
        }, 100);
      } else {
        setFeedback(newFeedback);
        setTimeout(() => {
          setCurrentQuestion(nextQuestion);
          setAnswerText("");
          setFeedback(null);
        }, 4000);
      }
    } catch (err) {
      const message =
        err.response?.data?.message || "Something went wrong submitting your answer.";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: "700px", margin: "60px auto", padding: "24px" }}>
      <p style={{ color: "#888" }}>
        Question {currentQuestion.orderIndex} of 5 &mdash; {domain}
      </p>

      <h2>{currentQuestion.text}</h2>

      {error && <p style={{ color: "red" }}>{error}</p>}

      {!feedback && (
        <form onSubmit={handleSubmit}>
          <textarea
            value={answerText}
            onChange={(e) => setAnswerText(e.target.value)}
            rows={8}
            style={{ width: "100%", padding: "12px", fontSize: "15px" }}
            placeholder="Type your answer here..."
            disabled={loading}
            required
          />
          <br />
          <button
            type="submit"
            disabled={loading}
            style={{ marginTop: "12px", padding: "10px 24px" }}
          >
            {loading ? "Getting AI feedback..." : "Submit Answer"}
          </button>
        </form>
      )}

      {feedback && (
        <div
          style={{
            marginTop: "24px",
            padding: "20px",
            border: "1px solid #ccc",
            borderRadius: "8px",
          }}
        >
          <h3>Score: {feedback.score} / 10</h3>
          <p>
            <strong>Strengths:</strong> {feedback.strengths}
          </p>
          <p>
            <strong>Weaknesses:</strong> {feedback.weaknesses}
          </p>
          <p>
            <strong>Tip:</strong> {feedback.improvementTip}
          </p>
          <p style={{ color: "#888", fontStyle: "italic" }}>
            Loading next question...
          </p>
        </div>
      )}
    </div>
  );
}

export default Interview;