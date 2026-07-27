import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { startInterview } from "../services/interviewApi";
import { useAuth } from "../context/AuthContext";
import NavBar from "../components/NavBar";

const DOMAINS = [
  { value: "JAVA", label: "Java", desc: "Core concepts, OOP, collections" },
  { value: "DSA", label: "DSA", desc: "Data structures & algorithms" },
  { value: "WEB_DEVELOPMENT", label: "Web Development", desc: "HTML, CSS, JS fundamentals" },
];

function DomainSelect() {
  const [loadingDomain, setLoadingDomain] = useState(null);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleSelect = async (domain) => {
    setError("");
    setLoadingDomain(domain);
    try {
      const response = await startInterview(domain);
      const { interviewId, question } = response.data;
      navigate(`/interview/${interviewId}`, { state: { question, domain } });
    } catch (err) {
      const message = err.response?.data?.message || "Failed to start interview. Please try again.";
      setError(message);
      setLoadingDomain(null);
    }
  };

  return (
    <>
      <NavBar />
      <div className="page">
        <h1>Choose a domain</h1>
        <p style={{ marginBottom: "var(--space-6)" }}>
          Hi {user?.name?.split(" ")[0]}, pick a domain to start a 5-question mock interview.
        </p>

        {error && <div className="alert alert-error">{error}</div>}

        <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-3)" }}>
          {DOMAINS.map((d) => {
            const isLoading = loadingDomain === d.value;
            const isDisabled = loadingDomain !== null;
            return (
              <button
                key={d.value}
                onClick={() => handleSelect(d.value)}
                disabled={isDisabled}
                className="card"
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  textAlign: "left",
                  cursor: isDisabled ? "not-allowed" : "pointer",
                  border: "1px solid var(--color-border)",
                  background: "var(--color-surface)",
                  width: "100%",
                  transition: "border-color var(--transition), background var(--transition)",
                  opacity: isDisabled && !isLoading ? 0.5 : 1,
                }}
                onMouseEnter={(e) => !isDisabled && (e.currentTarget.style.borderColor = "var(--color-primary)")}
                onMouseLeave={(e) => (e.currentTarget.style.borderColor = "var(--color-border)")}
              >
                <div>
                  <h3 style={{ margin: 0 }}>{d.label}</h3>
                  <p style={{ margin: "4px 0 0", fontSize: "13px" }}>{d.desc}</p>
                </div>
                {isLoading ? (
                  <span className="spinner" style={{ color: "var(--color-primary)" }} />
                ) : (
                  <span style={{ color: "var(--color-text-muted)", fontSize: "20px" }}>→</span>
                )}
              </button>
            );
          })}
        </div>

        {loadingDomain && (
          <p style={{ marginTop: "var(--space-4)", fontSize: "13px", textAlign: "center" }}>
            Generating your first question, this takes a few seconds...
          </p>
        )}
      </div>
    </>
  );
}

export default DomainSelect;