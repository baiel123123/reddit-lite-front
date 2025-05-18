import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

export default function Register() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  const handleRegister = (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (password !== password2) {
      setError("Пароли не совпадают");
      return;
    }

    // Тут ты можешь менять поля под свою схему SUserRegister
    fetch("http://localhost:8000/users/register/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username,
        email,
        password,
        gender: "male", // временно, подставь нужное
        date_of_birth: "2000-01-01T00:00:00", // временно, подставь нужное
      }),
    })
      .then((res) => {
        if (!res.ok) throw new Error("Ошибка регистрации");
        return res.json();
      })
      .then(() => {
        setSuccess("Регистрация прошла успешно, теперь войдите");
        setTimeout(() => navigate("/login"), 2000);
      })
      .catch((e) => setError(e.message));
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Регистрация</h2>
      <form onSubmit={handleRegister}>
        <input
          type="text"
          placeholder="Имя пользователя"
          required
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          style={{ display: "block", marginBottom: 10 }}
        />
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
        <input
          type="password"
          placeholder="Повторите пароль"
          required
          value={password2}
          onChange={(e) => setPassword2(e.target.value)}
          style={{ display: "block", marginBottom: 10 }}
        />
        <button type="submit">Зарегистрироваться</button>
      </form>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {success && <p style={{ color: "green" }}>{success}</p>}
      <p>
        Уже есть аккаунт? <Link to="/login">Войти</Link>
      </p>
    </div>
  );
}
