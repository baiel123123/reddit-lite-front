import React, { useEffect, useState } from "react";
import UserProfile from "../features/users/components/UserProfile";
import { Link, useNavigate } from "react-router-dom";
import Upvote from "../components/PostVotes";
import "./styles/MyProfile.module.css";

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
        if (!res.ok) throw new Error("Ошибка при загрузке пользователя");
        const data = await res.json();
        setUser(data);

        const postsRes = await fetch("http://localhost:8000/posts/my_posts/", {
          credentials: "include",
        });
        if (!postsRes.ok) throw new Error("Ошибка при загрузке постов");
        const postsData = await postsRes.json();

        const ids = postsData.map((p) => p.id).join(",");
        const voteRes = await fetch(`http://localhost:8000/posts/votes/by-user?ids=${ids}`, {
          credentials: "include",
        });
        const votes = await voteRes.json();

        const postsWithVotes = postsData.map((post) => ({
          ...post,
          user_vote: votes[post.id] ?? null,
        }));

        setPosts(postsWithVotes);
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
    <div className="my-profile-container">
      <UserProfile user={user} currentUser={user} />
      <div className="user-update-section">
        <p>
          <strong>Обновить профиль:</strong> {user?.role}
        </p>
        <Link to="/update-user">
          <button>Обновить</button>
        </Link>
      </div>

      <h3>Мои посты</h3>
      {posts.length === 0 ? (
        <p>Постов пока нет</p>
      ) : (
        <ul className="posts-list">
          {posts.map((post) => (
            <li key={post.id}>
              <div
                className="post-content"
                onClick={() => navigate(`/post/${post.id}`)}
              >
                <h4>{post.title}</h4>
                <Upvote post={post} />
              </div>
              <div className="post-actions">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(`/edit-post/${post.id}`);
                  }}
                >
                  Редактировать
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete(post.id);
                  }}
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
