import { createContext, useContext, useState } from "react";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem("user");
      return stored && stored !== "undefined" ? JSON.parse(stored) : null;
    } catch (err) {
      console.error("Error parsing user from localStorage:", err);
      localStorage.removeItem("user");
      return null;
    }
  });

  const [token, setToken] = useState(() => {
    const token = localStorage.getItem("token");
    return token && token !== "undefined" ? token : null;
  });

  const login = (data) => {
    localStorage.setItem("token", data.token);
    localStorage.setItem("user", JSON.stringify(data.user));
    setToken(data.token);
    setUser(data.user);
  };

  const logout = () => {
    // แก้เฉพาะจุดนี้
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
