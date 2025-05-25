import React, { useEffect, useState } from "react";
import UserProfile from "../components/UserProfile";
import { Link, useNavigate } from "react-router-dom";

export default function MyProfile() {
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // Функция для получения постов пользователя
  const fetchUserPosts = async () => {
    try {
      const res = await fetch("http://localhost:8000/posts/my_posts/", {
          method: "GET",
          credentials: "include",
      });
    if (!res.ok) {
      const errorText = await res.text(); // получаем тело ошибки
      throw new Error(`Ошибка при загрузке постов: ${res.status} ${res.statusText} - ${errorText}`);
    }
      const data = await res.json();
      setPosts(data);
    } catch (error) {
      console.error("Ошибка при загрузке постов:", error);
      setError(error.message);
    }
  };

  const fetchCurrentUser = async () => {
    try {
      const res = await fetch("http://localhost:8000/users/me", {
        credentials: "include",
      });
      console.log("Статус ответа:", res.status);
      if (!res.ok) {
        const errorText = await res.text();
        console.error("Текст ошибки с сервера:", errorText);
        throw new Error("Ошибка при загрузке постов");
      }
      const data = await res.json();
      setUser(data);
      await fetchUserPosts();
    } catch (err) {
      setError(err.message);
    }
  };

  // Один useEffect для загрузки данных при монтировании компонента
  useEffect(() => {
    fetchCurrentUser();
  }, []);

  const handleDelete = async (postId) => {
    if (!window.confirm("Вы уверены, что хотите удалить этот пост?")) return;

    try {
      const res = await fetch(`http://localhost:8000/posts/delete/${postId}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (!res.ok) throw new Error("Ошибка при удалении поста");

      setPosts(posts.filter((post) => post.id !== postId));
    } catch (err) {
      alert(err.message);
    }
  };

  if (error) return <p>{error}</p>;
  if (!user) return <p>Загрузка...</p>;

  return (
    <div>
      <UserProfile user={user} />
      <p>
        <strong>Обновить профиль:</strong> {user?.role}
      </p>
      <Link to="/update-user">
        <button>Обновить</button>
      </Link>

      <h3>Мои посты</h3>
      {posts.length === 0 ? (
        <p>Постов пока нет</p>
      ) : (
        <ul>
          {posts.map((post) => (
            <li key={post.id} style={{ marginBottom: "10px" }}>
              <Link to={`/post/${post.id}`} style={{ textDecoration: "none", color: "inherit" }}>
                <strong>{post.title}</strong>
              </Link>
              <div>
                <button
                  onClick={() => navigate(`/edit-post/${post.id}`)}
                  style={{ marginRight: "10px" }}
                >
                  Редактировать
                </button>
                <button
                  onClick={() => handleDelete(post.id)}
                  style={{ color: "red" }}
                >
                  Удалить
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
