import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import UserProfile from "./components/UserProfile";
import PostItem from "../posts/components/PostItem";
import fetchWithRefresh from '../../api.js';

export default function UserProfilePage() {
  const { userId } = useParams();
  const [user, setUser] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetchWithRefresh(`/users/find/?id=${userId}`, {
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

      const fetchUserPosts = async () => {
      try {
        const res = await fetchWithRefresh(`/posts/user_posts/?user_id=${userId}`, {
          credentials: "include",
        });
        if (res.status === 404) {
          setPosts([]);
          return;
        }
        if (!res.ok) throw new Error("Не удалось загрузить посты пользователя");
        const data = await res.json();
        setPosts(data);
      } catch (err) {
        setError(err.message);
      }
    };

    const fetchCurrentUser = async () => {
      try {
        const res = await fetchWithRefresh("/users/me", {
          credentials: "include",
        });
        if (!res.ok) return;
        const data = await res.json();
        setCurrentUser(data);
      } catch (err) {
        console.error("Ошибка загрузки текущего пользователя", err);
      }
    };

    fetchUser();
    fetchUserPosts();
    fetchCurrentUser();
  }, [userId]);

  if (error) return <p>{error}</p>;
  if (!user) return <p>Загрузка профиля...</p>;

  return (
    <div>
      <UserProfile user={user} currentUser={currentUser}/>

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
            <PostItem post={post} />
          </div>
        ))
      )}
    </div>
  );
}
