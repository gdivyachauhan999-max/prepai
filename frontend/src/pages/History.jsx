import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getHistoryList } from "../services/interviewApi";

function History() {
  const [interviews, setInterviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    getHistoryList()
      .then((res) => setInterviews(res.data))
      .catch(() => setError("Could not load interview history."))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div style={{ maxWidth: "700px", margin: "40px auto", padding: "24px" }}>
      <nav style={{ display: "flex", justifyContent: "space-between", marginBottom: "40px" }}>
        <strong>PrepAI</strong>
        <button onClick={() => navigate("/dashboard")}>Dashboard</button>
      </nav>

      <h1>Interview History</h1>

      {loading && <p>Loading...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      {!loading && interviews.length === 0 && (
        <p>No interviews yet — start your first one from the Dashboard!</p>
      )}

      {interviews.map((item) => (
        <div
          key={item.interviewId}
          style={{
            border: "1px solid #ccc",
            borderRadius: "8px",
            padding: "16px",
            marginBottom: "12px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div>
            <strong>{item.domain}</strong>
            <p style={{ margin: "4px 0", color: "#888" }}>
              {item.completedAt ? new Date(item.completedAt).toLocaleDateString() : "In progress"}
              {" — "}
              {item.overallScore != null ? `${item.overallScore.toFixed(1)} / 10` : item.status}
            </p>
          </div>
          <button onClick={() => navigate(`/history/${item.interviewId}`)}>View</button>
        </div>
      ))}
    </div>
  );
}

export default History;