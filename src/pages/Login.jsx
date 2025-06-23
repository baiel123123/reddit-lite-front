import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import styles from "./styles/AuthForm.module.css";

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

      localStorage.setItem("refresh_token", tokens.refresh_token);

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
    <div className={styles.authContainer}>
      <h2 className={styles.title}>Вход</h2>
      <form onSubmit={handleLogin} className={styles.form}>
        <input
          type="email"
          placeholder="Email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className={styles.input}
        />
        <input
          type="password"
          placeholder="Пароль"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className={styles.input}
        />
        <button type="submit" className={styles.button}>Войти</button>
      </form>
      {error && <p className={styles.error}>{error}</p>}
      <p>
        Нет аккаунта? <Link to="/register" className={styles.link}>Зарегистрироваться</Link>
      </p>
    </div>
  );
}
