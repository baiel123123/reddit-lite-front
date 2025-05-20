import React from "react";
import { Link } from "react-router-dom";

function AdminTools() {
  return (
    <div style={{ padding: 20 }}>
      <h2>Admin Tools</h2>
      <ul>
        <li><Link to="/ban-user">Забанить пользователя</Link></li>
        <li><Link to="/role-update">Обновление ролей</Link></li>
        <li><Link to="/delete-user-by-id">Удалить пользователя по ID</Link></li>
        {/* Добавляй сюда другие админские страницы */}
      </ul>
    </div>
  );
}

export default AdminTools;
