import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function SearchBar() {
  const [query, setQuery] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    // Переход на страницу поиска с query в параметрах
    navigate(`/search?query=${encodeURIComponent(query)}`);
  };

  return (
    <form 
      onSubmit={handleSubmit} 
      style={{
        display: "flex",
        padding: "8px 20px",
        backgroundColor: "#fff",
        borderBottom: "1px solid #ccc",
        position: "fixed",
        top: 0,
        width: "100%",
        zIndex: 1000,
        boxShadow: "0 1px 5px rgba(0,0,0,0.1)"
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
          border: "1px solid #ccc",
          borderRadius: "4px 0 0 4px",
          fontSize: "16px"
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