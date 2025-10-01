import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Initialize your auth state here
    const storedUser = localStorage.getItem("user");

    try {
      if (storedUser) {
        const parsedUser = JSON.parse(storedUser);
        if (parsedUser && typeof parsedUser === "object") {
          setUser(parsedUser);
        }
      }
    } catch (error) {
      console.error("Failed to parse user data:", error);
      localStorage.removeItem("user"); // Remove corrupted data
    } finally {
      setLoading(false);
    }
  }, []);

  const login = (userData) => {
    try {
      const userToStore = JSON.stringify(userData);
      localStorage.setItem("user", userToStore);
      setUser(userData);
    } catch (error) {
      console.error("Failed to store user data:", error);
    }
  };

  const logout = () => {
    localStorage.removeItem("user");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
