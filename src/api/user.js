import api from "../api"; 

export const fetchUserById = async (id) => {
  const res = await api.get(`/users/find/?id=${id}`);
  if (!res.data.length) throw new Error("Пользователь не найден");
  return res.data[0];
};

export const fetchUserPosts = async (userId) => {
  const res = await api.get(`/posts/user_posts/?user_id=${userId}`);
  return res.data;
};
