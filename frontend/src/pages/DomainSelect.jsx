import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { startInterview } from "../services/interviewApi";
import { useAuth } from "../context/AuthContext";

const DOMAINS = [
  { value: "JAVA", label: "Java" },
  { value: "DSA", label: "DSA" },
  { value: "WEB_DEVELOPMENT", label: "Web Development" },
];

function DomainSelect() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleSelect = async (domain) => {
    setError("");
    setLoading(true);
    try {
      const response = await startInterview(domain);
      const { interviewId, question } = response.data;
      navigate(`/interview/${interviewId}`, {
        state: { question, domain },
      });
    } catch (err) {
      const message =
        err.response?.data?.message || "Failed to start interview. Please try again.";
      setError(message);
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div style={{ maxWidth: "600px", margin: "60px auto", padding: "24px" }}>
      <nav style={{ display: "flex", justifyContent: "space-between", marginBottom: "40px" }}>
        <strong>PrepAI</strong>
        <div>
          <button onClick={() => navigate("/dashboard")} style={{ marginRight: "12px" }}>
            Dashboard
          </button>
          <button onClick={() => navigate("/history")} style={{ marginRight: "12px" }}>
            History
          </button>
          <button onClick={handleLogout}>Logout</button>
        </div>
      </nav>

      <h1>Choose a domain to practice</h1>
      <p>Hi {user?.name}, pick a domain to start your mock interview.</p>

      {error && <p style={{ color: "red" }}>{error}</p>}

      {loading ? (
        <p>Starting your interview, generating first question...</p>
      ) : (
        <div style={{ display: "flex", gap: "16px", marginTop: "24px" }}>
          {DOMAINS.map((d) => (
            <button
              key={d.value}
              onClick={() => handleSelect(d.value)}
              style={{
                padding: "20px 24px",
                fontSize: "16px",
                cursor: "pointer",
                border: "1px solid #ccc",
                borderRadius: "8px",
              }}
            >
              {d.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default DomainSelect;