import React, { useEffect, useState } from "react";
import PostVotes from "../../components/PostVotes";
import { useNavigate } from "react-router-dom";

export default function PostFeed() {
  const [posts, setPosts] = useState([]);
  const [sortBy, setSortBy] = useState("hot");
  const [offset, setOffset] = useState(0);
  const limit = 10;
  const navigate = useNavigate();

  useEffect(() => {
    async function loadPostsAndVotes() {
      try {
        const res = await fetch(
          `http://localhost:8000/posts/lenta/?sort_by=${sortBy}&limit=${limit}&offset=${offset}`,
          { credentials: "include" }
        );
        const postsData = await res.json();
        setPosts(postsData);

        const ids = postsData.map((p) => p.id).join(",");
        const voteRes = await fetch(
          `http://localhost:8000/posts/votes/by-user?ids=${ids}`,
          { credentials: "include" }
        );
        const votes = await voteRes.json();

        const updatedPosts = postsData.map((post) => ({
          ...post,
          user_vote: votes[post.id] ?? null,
        }));

        setPosts(updatedPosts);
      } catch (err) {
        console.error(err);
      }
    }

    loadPostsAndVotes();
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
        <div
          key={post.id}
          onClick={() => navigate(`/post/${post.id}`)}
          style={{
            cursor: "pointer",
            border: "1px solid #ccc",
            marginBottom: 10,
            padding: 10,
          }}
        >

          <h4>{post.title}</h4>
          <p>{post.content}</p>
          <p style={{ fontSize: 12, color: "#777" }}>
            Автор: {post.user.username}
          </p>
          <PostVotes post={post} />
        </div>
      ))}

      <div style={{ marginTop: 20 }}>
        <button
          onClick={() => setOffset((prev) => Math.max(prev - limit, 0))}
          disabled={offset === 0}
        >
          Назад
        </button>
        <button onClick={() => setOffset((prev) => prev + limit)} style={{ marginLeft: 10 }}>
          Далее
        </button>
      </div>
    </div>
  );
}
