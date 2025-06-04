import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import PostVotes from "../../../components/PostVotes"; 

const API_URL = "http://localhost:8000";

export default function SubredditDetailPage() {
  const { subredditId } = useParams();
  const [subreddit, setSubreddit] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const [limit] = useState(10);
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    async function fetchSubredditAndPosts() {
      try {
        setLoading(true);
        setError(null);

        const resSubreddit = await fetch(`${API_URL}/subreddit/${subredditId}`, {
          headers: { "Content-Type": "application/json" },  
        });
        if (!resSubreddit.ok) throw new Error("Не удалось загрузить сабреддит");
        const subredditData = await resSubreddit.json();
        setSubreddit(subredditData);

        const resPosts = await fetch(
          `${API_URL}/posts/by-subreddit/${subredditId}?limit=${limit}&offset=${offset}`,
          { credentials: "include" }
        );
        if (!resPosts.ok) throw new Error("Не удалось загрузить посты сабреддита");
        const postsData = await resPosts.json();

        if (postsData.length > 0) {
          const ids = postsData.map((p) => p.id).join(",");
          const voteRes = await fetch(`${API_URL}/posts/votes/by-user?ids=${ids}`, {
            credentials: "include",
          });
          const votes = await voteRes.json();

          const updatedPosts = postsData.map((post) => ({
            ...post,
            user_vote: votes[post.id] ?? null,
          }));

          setPosts(updatedPosts);
        } else {
          setPosts([]);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchSubredditAndPosts();
  }, [subredditId, limit, offset]);

  if (loading) return <div>Загрузка...</div>;
  if (error) return <div style={{ color: "red" }}>{error}</div>;
  if (!subreddit) return <div>Сабреддит не найден</div>;

  return (
    <div style={{ padding: "20px" }}>
      <h1>{subreddit.name}</h1>
      <p>{subreddit.description}</p>
      <p>
        Создатель: {subreddit.created_by?.username ?? "Неизвестен"}
      </p>

      <h2>Посты в сабреддите</h2>
      {posts.length === 0 ? (
        <p>Постов пока нет</p>
      ) : (
        posts.map((post) => (
          <div
            key={post.id}
            onClick={() => navigate(`/post/${post.id}`)}
            style={{ cursor: "pointer", border: "1px solid #ccc", marginBottom: 10, padding: 10 }}
          >
            <h4>{post.title}</h4>
            <p>{post.content}</p>
            <p style={{ fontSize: 12, color: "#777" }}>
              Автор: {post.user?.username ?? "Неизвестен"}
            </p>
            <PostVotes post={post} />
          </div>
        ))
      )}

      <div style={{ marginTop: 20 }}>
        <button onClick={() => setOffset(Math.max(offset - limit, 0))} disabled={offset === 0}>
          Назад
        </button>
        <button onClick={() => setOffset(offset + limit)} style={{ marginLeft: 10 }}>
          Далее
        </button>
      </div>
    </div>
  );
}
