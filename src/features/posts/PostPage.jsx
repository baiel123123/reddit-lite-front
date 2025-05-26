import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import PostItem from "./components/PostItem";

export default function PostPage() {
  const { postId } = useParams();
  const [post, setPost] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const res = await fetch(`http://localhost:8000/posts/${postId}`, {
          credentials: "include",
        });
        if (!res.ok) throw new Error("Пост не найден");
        const data = await res.json();
        console.log(data)
        setPost(data);
      } catch (err) {
        setError(err.message);
      }
    };

    const fetchCurrentUser = async () => {
      try {
        const res = await fetch("http://localhost:8000/users/me", {
          credentials: "include",
        });
        if (!res.ok) return;
        const data = await res.json();
        setCurrentUser(data);
      } catch (_) {}
    };

    fetchPost();
    fetchCurrentUser();
  }, [postId]);

  if (error) return <p>{error}</p>;
  if (!post) return <p>Загрузка...</p>;

  return <PostItem post={post} currentUser={currentUser} />;
}
