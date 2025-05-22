import React, { useEffect, useState } from "react";
import Post from "../components/Upvote"; // путь поправь под свою структуру

export default function PostFeed() {
  const [posts, setPosts] = useState([]);
  const [sortBy, setSortBy] = useState("hot");
  const [offset, setOffset] = useState(0);
  const limit = 10;

  useEffect(() => {
    fetch(
      `http://localhost:8000/posts/lenta/?sort_by=${sortBy}&limit=${limit}&offset=${offset}`,
      { credentials: "include" }
    )
      .then((res) => res.json())
      .then((data) => {
        console.log("Ответ с сервера:", data);
        setPosts(Array.isArray(data) ? data : []);
      })
      .catch(console.error);
  }, [sortBy, offset]);

  return (
    <div>
      <h2>Лента постов</h2>

      <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
        <option value="hot">Горячее</option>
        <option value="new">Новое</option>
        <option value="top">Топ</option>
      </select>

      {posts.map((post) => (
        <Post key={post.id} post={post} />
      ))}

      <div style={{ marginTop: 20 }}>
        <button onClick={() => setOffset((prev) => Math.max(prev - limit, 0))} disabled={offset === 0}>
          Назад
        </button>
        <button onClick={() => setOffset((prev) => prev + limit)} style={{ marginLeft: 10 }}>
          Далее
        </button>
      </div>
    </div>
  );
}