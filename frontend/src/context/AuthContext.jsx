import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedToken = localStorage.getItem("prepai_token");
    const storedName = localStorage.getItem("prepai_name");
    const storedEmail = localStorage.getItem("prepai_email");

    if (storedToken && storedName && storedEmail) {
      setToken(storedToken);
      setUser({ name: storedName, email: storedEmail });
    }
    setLoading(false);
  }, []);

  const login = (newToken, name, email) => {
    localStorage.setItem("prepai_token", newToken);
    localStorage.setItem("prepai_name", name);
    localStorage.setItem("prepai_email", email);
    setToken(newToken);
    setUser({ name, email });
  };

  const logout = () => {
    localStorage.removeItem("prepai_token");
    localStorage.removeItem("prepai_name");
    localStorage.removeItem("prepai_email");
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}