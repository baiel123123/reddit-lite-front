import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

export default function UserSearch() {
  const query = useQuery();
  const initialQuery = query.get("query") || "";

  const [username, setUsername] = useState(initialQuery);
  const [results, setResults] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!initialQuery.trim()) {
      setResults([]);
      setError("");
      return;
    }
    const fetchUsers = async () => {
      setLoading(true);
      try {
        const queryString = new URLSearchParams({ username: initialQuery }).toString();
        const response = await fetch(`http://localhost:8000/users/find/?${queryString}`, {
          method: "GET",
          credentials: "include",
        });
        if (!response.ok) throw new Error("Ошибка при поиске пользователей");
        const data = await response.json();
        setResults(data);
        setError("");
      } catch (err) {
        setError(err.message);
        setResults([]);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, [initialQuery]);

  const handleSearch = async (e) => {
    e.preventDefault();

    if (!username.trim()) {
      setError("Введите имя пользователя для поиска");
      setResults([]);
      return;
    }

    // Навигация должна быть в SearchBar, но если хочешь - можно и тут искать напрямую
    // Здесь просто обновим URL без навигации — для примера
    window.history.replaceState(null, "", `?query=${encodeURIComponent(username.trim())}`);
    
    // fetchUsers запускается из useEffect при изменении initialQuery,
    // поэтому нужно синхронизировать username с initialQuery, чтобы триггерить useEffect
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Поиск пользователей</h2>
      <form onSubmit={handleSearch} style={{ marginBottom: 20 }}>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          style={{ marginRight: 10, padding: "6px", fontSize: "16px" }}
        />
        <button type="submit" style={{ padding: "6px 12px", fontSize: "16px" }}>
          Найти
        </button>
      </form>

      {loading && <p>Загрузка...</p>}
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
        !loading && <p>Пользователи не найдены</p>
      )}
    </div>
  );
}
