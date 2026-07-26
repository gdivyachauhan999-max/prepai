import { useLocation, useNavigate, useParams } from "react-router-dom";

function InterviewComplete() {
  const location = useLocation();
  const navigate = useNavigate();
  const { id } = useParams();

  const overallScore = location.state?.overallScore;
  const domain = location.state?.domain;

  return (
    <div style={{ maxWidth: "600px", margin: "100px auto", padding: "24px", textAlign: "center" }}>
      <h1>Interview Complete!</h1>
      <p>Domain: {domain}</p>
      <h2 style={{ fontSize: "48px", margin: "24px 0" }}>
        {overallScore != null ? overallScore.toFixed(1) : "--"} / 10
      </h2>
      <div>
        <button onClick={() => navigate(`/history/${id}`)} style={{ marginRight: "12px", padding: "10px 20px" }}>
          View Full Summary
        </button>
        <button onClick={() => navigate("/dashboard")} style={{ padding: "10px 20px" }}>
          Back to Dashboard
        </button>
      </div>
    </div>
  );
}

export default InterviewComplete;