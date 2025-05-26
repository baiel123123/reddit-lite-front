import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import UserProfile from "./components/UserProfile";
import Post from "../../components/Upvote";

export default function UserProfilePage() {
  const { userId } = useParams();
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    // Загрузка данных пользователя
    const fetchUser = async () => {
      try {
        const res = await fetch(`http://localhost:8000/users/find/?id=${userId}`, {
          credentials: "include",
        });

        if (!res.ok) throw new Error("Не удалось получить данные");

        const data = await res.json();
        if (!data.length) throw new Error("Пользователь не найден");

        setUser(data[0]);
      } catch (err) {
        setError(err.message);
      }
    };

    // Загрузка постов пользователя
    const fetchUserPosts = async () => {
      try {
        const res = await fetch(`http://localhost:8000/posts/user_posts/?user_id=${userId}`, {
          credentials: "include",
        });
        if (!res.ok) throw new Error("Не удалось загрузить посты пользователя");
        const data = await res.json();
        setPosts(data);
      } catch (err) {
        setError(err.message);
      }
    };

    fetchUser();
    fetchUserPosts();
  }, [userId]);

  if (error) return <p>{error}</p>;
  if (!user) return <p>Загрузка профиля...</p>;

  return (
    <div>
      <UserProfile user={user} />

      <h3>Посты пользователя</h3>
      {posts.length === 0 ? (
        <p>Постов пока нет</p>
      ) : (
        posts.map((post) => (
          <div
            key={post.id}
            onClick={() => navigate(`/post/${post.id}`)}
            style={{ cursor: "pointer", marginBottom: 10 }}
          >
            <Post post={post} />
          </div>
        ))
      )}
    </div>
  );
}
