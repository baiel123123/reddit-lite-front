import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";

export default function Login() {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const loginRes = await fetch("http://localhost:8000/users/login/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email, password }),
      });

      if (!loginRes.ok) {
        const errorData = await loginRes.json();
        throw new Error(errorData.detail || "Ошибка при логине");
      }

      const tokens = await loginRes.json();

      // сохраняем refresh_token
      localStorage.setItem("refresh_token", tokens.refresh_token);

      // теперь запросим текущего пользователя
      const userRes = await fetch("http://localhost:8000/users/me/", {
        credentials: "include",
      });

      if (!userRes.ok) {
        const errorData = await userRes.json();
        throw new Error(errorData.detail || "Ошибка при получении пользователя");
      }

      const user = await userRes.json();
      login(user);
      navigate("/");
    } catch (e) {
      setError(e.message || "Ошибка при входе");
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Вход</h2>
      <form onSubmit={handleLogin}>
        <input
          type="email"
          placeholder="Email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={{ display: "block", marginBottom: 10 }}
        />
        <input
          type="password"
          placeholder="Пароль"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={{ display: "block", marginBottom: 10 }}
        />
        <button type="submit">Войти</button>
      </form>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <p>
        Нет аккаунта? <Link to="/register">Зарегистрироваться</Link>
      </p>
    </div>
  );
}
