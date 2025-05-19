import React, { useState } from "react";
import { useAuth } from "../context/AuthContext"; // <-- импортируем хук
import { useNavigate, Link } from "react-router-dom";

export default function Login() {
  const { login } = useAuth(); // <-- получаем функцию login
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    setError("");

    fetch("http://localhost:8000/users/login/", {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    })
      .then((res) => {
        if (!res.ok) throw new Error("Неверная почта или пароль");
        return res.json();
      })
      .then(() =>
        fetch("http://localhost:8000/users/me/", { credentials: "include" })
      )
      .then((res) => res.json())
      .then((data) => {
        login(data); // вызываем login, который обновит user в контексте
        navigate("/");
      })
      .catch((e) => setError(e.message));
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
