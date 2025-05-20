import React, { createContext, useContext, useState, useEffect } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // состояние загрузки

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
      // Проверяем на сервере, что сессия валидна
      fetch("http://localhost:8000/users/me/", { credentials: "include" })
        .then((res) => {
          if (!res.ok) throw new Error("Неавторизован");
          return res.json();
        })
        .then((data) => {
          setUser(data);
        })
        .catch(() => {
          setUser(null);
          localStorage.removeItem("user");
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const login = (userData) => {
    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
  };

  if (loading) return <div>Загрузка...</div>; // или любой спиннер

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
