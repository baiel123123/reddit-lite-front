// api/user.js
export const fetchUserById = async (id) => {
  const res = await fetch(`http://localhost:8000/users/find/?id=${id}`, {
    credentials: "include",
  });
  if (!res.ok) throw new Error("Не удалось получить данные");
  const data = await res.json();
  if (!data.length) throw new Error("Пользователь не найден");
  return data[0];
};

export const fetchUserPosts = async (userId) => {
  const res = await fetch(`http://localhost:8000/posts/user_posts/?user_id=${userId}`, {
    credentials: "include",
  });
  if (!res.ok) throw new Error("Не удалось загрузить посты пользователя");
  return await res.json();
};
