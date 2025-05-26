import React from "react";

export default function UserProfile({ user, currentUser }) {
  if (!user) return <p>Загрузка...</p>;

  const isSelf = currentUser?.id === user.id;
  const isAdmin = currentUser?.role_id === 2 || currentUser?.role_id === 3;

  return (
    <div style={{ padding: "10px", border: "1px solid #ccc", borderRadius: "8px", maxWidth: "400px" }}>
      <h3>Профиль {isSelf ? "(Ваш)" : `пользователя ${user.username}`}</h3>

      <p><strong>Имя пользователя:</strong> {user.username}</p>
      <p><strong>Никнейм:</strong> {user.nickname}</p>
      <p><strong>Email:</strong> {user.email}</p>
      <p><strong>Пол:</strong> {user.gender}</p>
      <p><strong>Дата рождения:</strong> {user.date_of_birth}</p>
      <p><strong>О себе:</strong> {user.about_me}</p>


      {(isSelf || isAdmin) && (
        <>
          <p><strong>Статус:</strong> {user.status}</p>
          <p><strong>Подтверждён:</strong> {user.is_verified ? "Да" : "Нет"}</p>
          <p><strong>Дата создания:</strong> {new Date(user.created_at).toLocaleString()}</p>
          <p><strong>Дата обновления:</strong> {new Date(user.updated_at).toLocaleString()}</p>
        </>
      )}

      {isAdmin && (
        <>
          <p><strong>ID:</strong> {user.id}</p>
          <p><strong>role_id:</strong> {user.role_id}</p>
        </>
      )}
    </div>
  );
}
