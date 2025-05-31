import React, { useEffect, useState } from "react";
import UserProfile from "../features/users/components/UserProfile";
import { Link, useNavigate } from "react-router-dom";
import Upvote from "../components/PostVotes";

export default function MyProfile() {
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [error, setError] = useState("");
  const navigate = useNavigate();


  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const res = await fetch("http://localhost:8000/users/me", {
          credentials: "include",
        });
        if (!res.ok) {
          const errorText = await res.text();
          console.error("Ошибка при загрузке пользователя:", errorText);
          throw new Error("Ошибка при загрузке пользователя");
        }
        const data = await res.json();
        setUser(data);

        const postsRes = await fetch("http://localhost:8000/posts/my_posts/", {
          credentials: "include",
        });
        if (!postsRes.ok) {
          const errorText = await postsRes.text();
          throw new Error(`Ошибка при загрузке постов: ${errorText}`);
        }
        const postsData = await postsRes.json();
        setPosts(Array.isArray(postsData) ? postsData : []);
      } catch (err) {
        console.error(err);
        setError(err.message);
      }
    };

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
      <UserProfile user={user} currentUser={user} />
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
            <li key={post.id} style={{ marginBottom: "10px", listStyle: "none" }}>
              <div
                onClick={() => navigate(`/post/${post.id}`)}
                style={{ cursor: "pointer" }}
              >
                <h4>{post.title}</h4> 
                <Upvote post={post} />
              </div>

              <div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(`/edit-post/${post.id}`);
                  }}
                  style={{ marginRight: "10px" }}
                >
                  Редактировать
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete(post.id);
                  }}
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
