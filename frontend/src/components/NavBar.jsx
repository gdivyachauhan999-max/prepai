import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function NavBar({ active }) {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const linkStyle = (key) => ({
    color: active === key ? "var(--color-text-primary)" : "var(--color-text-secondary)",
    fontWeight: active === key ? 600 : 500,
  });

  return (
    <nav
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "18px 24px",
        borderBottom: "1px solid var(--color-border)",
      }}
    >
      <strong
        onClick={() => navigate("/dashboard")}
        style={{ cursor: "pointer", fontSize: "18px", letterSpacing: "-0.02em" }}
      >
        PrepAI
      </strong>
      <div className="nav-links" style={{ display: "flex", gap: "20px", alignItems: "center" }}>
        <span style={{ cursor: "pointer", fontSize: "14px", ...linkStyle("dashboard") }} onClick={() => navigate("/dashboard")}>
          Dashboard
        </span>
        <span style={{ cursor: "pointer", fontSize: "14px", ...linkStyle("history") }} onClick={() => navigate("/history")}>
          History
        </span>
        <button className="btn btn-ghost" style={{ padding: "6px 14px", fontSize: "13px" }} onClick={handleLogout}>
          Logout
        </button>
      </div>
    </nav>
  );
}

export default NavBar;