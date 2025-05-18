import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";

export default function Roles() {
  const { user } = useAuth();
  const [users, setUsers] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!user || (user.role_id !== 2 && user.role_id !== 3)) {
      setError("Доступ запрещён");
      return;
    }

    fetch("http://localhost:8000/users/get_all/", {
      credentials: "include",
    })
      .then((res) => {
        if (!res.ok) throw new Error("Ошибка загрузки пользователей");
        return res.json();
      })
      .then(setUsers)
      .catch((e) => setError(e.message));
  }, [user]);

  if (error) return <p style={{ color: "red" }}>{error}</p>;
  if (!user) return <p>Загрузка...</p>;

  const handleRoleChange = (userId, roleId) => {
    fetch("http://localhost:8000/users/role_update/", {
      method: "PUT",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ user_id: userId, role_id: roleId }),
    })
      .then((res) => {
        if (!res.ok) throw new Error("Ошибка обновления роли");
        return res.json();
      })
      .then(() => {
        // Обновим локальный стейт после изменения роли
        setUsers((prev) =>
          prev.map((u) =>
            u.id === userId ? { ...u, role_id: roleId } : u
          )
        );
      })
      .catch((e) => alert(e.message));
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Управление ролями</h2>
      <table border="1" cellPadding="5" style={{ width: "100%" }}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Email</th>
            <th>Роль</th>
            <th>Изменить роль</th>
          </tr>
        </thead>
        <tbody>
          {users.map((u) => (
            <tr key={u.id}>
              <td>{u.id}</td>
              <td>{u.email}</td>
              <td>{u.role_id === 1 ? "Пользователь" : u.role_id === 2 ? "Админ" : "Супер-админ"}</td>
              <td>
                {user.role_id === 3 ? ( // только супер-админ может менять роли
                  <select
                    value={u.role_id}
                    onChange={(e) =>
                      handleRoleChange(u.id, Number(e.target.value))
                    }
                    disabled={u.role_id === 3} // нельзя менять роль супер-админу
                  >
                    <option value={1}>Пользователь</option>
                    <option value={2}>Админ</option>
                    <option value={3} disabled>Супер-админ</option>
                  </select>
                ) : (
                  "Нет доступа"
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
