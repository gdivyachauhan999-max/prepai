import { useState } from "react";
import { useNavigate, Link, useSearchParams } from "react-router-dom";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();
  const [searchParams] = useSearchParams();
  const expired = searchParams.get("expired") === "true";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await api.post("/auth/login", { email, password });
      const { token, name, email: userEmail } = response.data;
      login(token, name, userEmail);
      navigate("/dashboard");
    } catch (err) {
      const message = err.response?.data?.message || "Login failed. Please try again.";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page page-center">
      <div className="card page-narrow" style={{ width: "100%" }}>
        <div style={{ textAlign: "center", marginBottom: "var(--space-6)" }}>
          <div style={{ fontSize: "24px", fontWeight: 700, marginBottom: "4px" }}>PrepAI</div>
          <p style={{ margin: 0, fontSize: "14px" }}>Welcome back. Let's keep practicing.</p>
        </div>

        {expired && (
          <div className="alert alert-error">Your session expired. Please log in again.</div>
        )}
        {error && <div className="alert alert-error">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="field">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              className="input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
              autoFocus
            />
          </div>
          <div className="field">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              className="input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
            />
          </div>
          <button type="submit" className="btn btn-primary btn-block btn-lg" disabled={loading}>
            {loading ? <span className="spinner" /> : "Log In"}
          </button>
        </form>

        <p style={{ textAlign: "center", marginTop: "var(--space-5)", marginBottom: 0, fontSize: "14px" }}>
          Don't have an account? <Link to="/register">Register</Link>
        </p>
      </div>
    </div>
  );
}

export default Login;