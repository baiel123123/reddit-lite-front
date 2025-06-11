import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function SearchBar() {
  const [query, setQuery] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    navigate(`/search?query=${encodeURIComponent(query)}`);
  };

  return (
    <form
      onSubmit={handleSubmit}
      style={{
        display: "flex",
        padding: "8px 20px",
        backgroundColor: "#1c1c1c",         // Тёмный фон для формы
        borderBottom: "1px solid #444",       // Тёмная нижняя граница
        position: "fixed",
        top: 0,
        width: "100%",
        zIndex: 1000,
        boxShadow: "0 1px 5px rgba(0,0,0,0.5)"
      }}
    >
      <input
        type="text"
        placeholder="Поиск пользователей..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        style={{
          flex: 1,
          padding: "8px 12px",
          border: "1px solid #444",         // Тёмная рамка для поля ввода
          borderRadius: "4px 0 0 4px",
          fontSize: "16px",
          backgroundColor: "#292929",         // Ещё более тёмный фон для инпута
          color: "#e8e8e8",                   // Светлый текст
        }}
      />
      <button
        type="submit"
        style={{
          padding: "8px 16px",
          backgroundColor: "#ff4500",
          border: "none",
          color: "#fff",
          cursor: "pointer",
          borderRadius: "0 4px 4px 0",
          fontWeight: "bold",
          fontSize: "16px"
        }}
      >
        Найти
      </button>
    </form>
  );
}
