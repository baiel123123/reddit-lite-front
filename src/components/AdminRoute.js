import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function AdminRoute({ children }) {
  const { user } = useAuth();

  if (!user) return <p>Загрузка...</p>; // Пока данные пользователя не загрузились

  // Разрешаем доступ только для ролей 2 (admin) и 3 (super_admin)
  if (user.role_id !== 2 && user.role_id !== 3) {
    return <Navigate to="/profile" />; // Перенаправляем, если нет прав
  }

  return children;
}
