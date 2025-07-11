import React from "react";
import { Link } from "react-router-dom";

function AdminTools() {
  return (
    <div style={{
      padding: 32,
      maxWidth: 420,
      margin: "40px auto",
      background: "#232324",
      borderRadius: 16,
      boxShadow: "0 2px 16px rgba(0,0,0,0.18)",
      border: "1px solid #333"
    }}>
      <h2 style={{
        color: "#ff4500",
        fontWeight: 800,
        fontSize: 28,
        marginBottom: 24,
        letterSpacing: 1
      }}>Admin Tools</h2>
      <ul style={{
        listStyle: "none",
        padding: 0,
        margin: 0,
        display: "flex",
        flexDirection: "column",
        gap: 16
      }}>
        <li>
          <Link to="/ban-user" style={{
            display: "block",
            padding: "12px 20px",
            background: "#28282a",
            borderRadius: 10,
            color: "#e8e8e8",
            textDecoration: "none",
            fontWeight: 600,
            fontSize: 17,
            transition: "background 0.18s, color 0.18s",
            border: "1px solid #333"
          }}
            onMouseOver={e => e.currentTarget.style.background = '#2d2d31'}
            onMouseOut={e => e.currentTarget.style.background = '#28282a'}
          >
            Забанить пользователя
          </Link>
        </li>
        <li>
          <Link to="/role-update" style={{
            display: "block",
            padding: "12px 20px",
            background: "#28282a",
            borderRadius: 10,
            color: "#e8e8e8",
            textDecoration: "none",
            fontWeight: 600,
            fontSize: 17,
            transition: "background 0.18s, color 0.18s",
            border: "1px solid #333"
          }}
            onMouseOver={e => e.currentTarget.style.background = '#2d2d31'}
            onMouseOut={e => e.currentTarget.style.background = '#28282a'}
          >
            Обновление ролей
          </Link>
        </li>
        <li>
          <Link to="/delete-user-by-id" style={{
            display: "block",
            padding: "12px 20px",
            background: "#28282a",
            borderRadius: 10,
            color: "#e8e8e8",
            textDecoration: "none",
            fontWeight: 600,
            fontSize: 17,
            transition: "background 0.18s, color 0.18s",
            border: "1px solid #333"
          }}
            onMouseOver={e => e.currentTarget.style.background = '#2d2d31'}
            onMouseOut={e => e.currentTarget.style.background = '#28282a'}
          >
            Удалить пользователя по ID
          </Link>
        </li>
        {/* Добавляй сюда другие админские страницы */}
      </ul>
    </div>
  );
}

export default AdminTools;
