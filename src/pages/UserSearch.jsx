import React, { useState } from "react";
import { Link } from "react-router-dom";

export default function UserSearch() {
  const [id, setId] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [results, setResults] = useState([]);
  const [error, setError] = useState("");

  const handleSearch = async (e) => {
    e.preventDefault();

    const body = {};
    if (id.trim()) body.id = Number(id);
    if (username.trim()) body.username = username.trim();
    if (email.trim()) body.email = email.trim();

    if (Object.keys(body).length === 0) {
      setError("Введите хотя бы одно поле для поиска");
      setResults([]);
      return;
    }

    setError("");

    try {
      const queryString = new URLSearchParams(body).toString();
      const response = await fetch(`http://localhost:8000/users/find/?${queryString}`, {
        method: "GET",
        credentials: "include",
      });

      if (!response.ok) throw new Error("Ошибка при поиске пользователей");

      const data = await response.json();
      setResults(data);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Поиск пользователей</h2>
      <form onSubmit={handleSearch} style={{ marginBottom: 20 }}>
        <input
          type="number"
          placeholder="ID"
          value={id}
          onChange={(e) => setId(e.target.value)}
          style={{ marginRight: 10 }}
        />
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          style={{ marginRight: 10 }}
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={{ marginRight: 10 }}
        />
        <button type="submit">Найти</button>
      </form>

      {error && <p style={{ color: "red" }}>{error}</p>}

      {results.length > 0 ? (
        <ul style={{ listStyle: "none", padding: 0 }}>
          {results.map((user) => (
            <li key={user.id} style={{ marginBottom: 8 }}>
              <Link to={`/profile/${user.id}`}>
                {user.id} — {user.username} — {user.email}
              </Link>
            </li>
          ))}
        </ul>
      ) : (
        <p>Пользователи не найдены</p>
      )}
    </div>
  );
}
