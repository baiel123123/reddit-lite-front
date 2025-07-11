import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import PostVotes from "../../../components/PostVotes";
import styles from "../styles/SubredditDetailPage.module.css";
import { useAuth } from "../../../context/AuthContext";
import fetchWithRefresh from '../../../api.js';

const API_URL = "http://localhost:8000";

function SubredditIcon({ name }) {
  if (!name) return (
    <div className={styles.subredditIconDefault}>r</div>
  );
  return (
    <div className={styles.subredditIcon}>{name[0].toUpperCase()}</div>
  );
}

export default function SubredditDetailPage() {
  const { subredditId } = useParams();
  const { user } = useAuth();
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [subscriptionId, setSubscriptionId] = useState(null);
  const [loadingSub, setLoadingSub] = useState(false);
  const [subreddit, setSubreddit] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const [limit] = useState(10);
  const [offset, setOffset] = useState(0);

  async function checkSubscription() {
    if (!user) return;
    try {
      const res = await fetchWithRefresh(`${API_URL}/subreddit/get_all_subscriptions/`, { credentials: "include" });
      if (!res.ok) throw new Error();
      const data = await res.json();
      const found = data.find(s => String(s.subreddit_id) === String(subredditId));
      if (found) {
        const subRes = await fetchWithRefresh(`${API_URL}/subreddit/subscription/${found.id}`, { credentials: "include" });
        if (!subRes.ok) throw new Error();
        await subRes.json();
        setIsSubscribed(true);
        setSubscriptionId(found.id);
      } else {
        setIsSubscribed(false);
        setSubscriptionId(null);
      }
    } catch (e) {
      setIsSubscribed(false);
      setSubscriptionId(null);
    }
  }

  useEffect(() => {
    async function fetchSubredditAndPosts() {
      try {
        setLoading(true);
        setError(null);
        const resSubreddit = await fetchWithRefresh(`${API_URL}/subreddit/${subredditId}`, {
          headers: { "Content-Type": "application/json" },  
        });
        if (!resSubreddit.ok) throw new Error("Не удалось загрузить сабреддит");
        const subredditData = await resSubreddit.json();
        setSubreddit(subredditData);
        const resPosts = await fetchWithRefresh(
          `${API_URL}/posts/by-subreddit/${subredditId}?limit=${limit}&offset=${offset}`,
          { credentials: "include" }
        );
        if (resPosts.status === 404) {
          setPosts([]);
        } else if (!resPosts.ok) {
          throw new Error("Не удалось загрузить посты сабреддита");
        } else {
          const postsData = await resPosts.json();
          if (postsData.length > 0) {
            const ids = postsData.map((p) => p.id).join(",");
            const voteRes = await fetchWithRefresh(`${API_URL}/posts/votes/by-user?ids=${ids}`, {
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
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchSubredditAndPosts();
    checkSubscription();
  }, [subredditId, limit, offset, user]);

  useEffect(() => {
    if (!subreddit) return;
    // Получаем текущие недавние сабреддиты
    const recent = JSON.parse(localStorage.getItem("recentSubreddits") || "[]");
    // Удаляем текущий, если уже есть
    const filtered = recent.filter(s => s.id !== subreddit.id);
    // Добавляем текущий в начало
    const updated = [{ id: subreddit.id, name: subreddit.name, description: subreddit.description }, ...filtered];
    // Оставляем только 10 последних
    localStorage.setItem("recentSubreddits", JSON.stringify(updated.slice(0, 10)));
  }, [subreddit]);

  const handleSubscribe = async () => {
    setLoadingSub(true);
    try {
      const res = await fetchWithRefresh(`${API_URL}/subreddit/create_subscribe/${subredditId}`, { method: "POST", credentials: "include" });
      if (!res.ok) throw new Error();
      setIsSubscribed(true);
      // Можно получить id подписки из ответа, если нужно
    } catch {}
    setLoadingSub(false);
  };
  const handleUnsubscribe = async () => {
    if (!subscriptionId) return;
    setLoadingSub(true);
    try {
      const res = await fetchWithRefresh(`${API_URL}/subreddit/delete_subscription/${subscriptionId}`, { method: "DELETE", credentials: "include" });
      if (!res.ok) throw new Error();
      // После успешной отписки сразу обновляем статус
      await checkSubscription();
    } catch {}
    setLoadingSub(false);
  };

  if (loading) return <div className={styles.loading}>Загрузка...</div>;
  if (!subreddit) return <div className={styles.error}>Сабреддит не найден</div>;
  if (error) return <div className={styles.error}>{error}</div>;

  return (
    <div className={styles.container}>
      <div className={styles.headerSection}>
        <div className={styles.headerRow}>
          <SubredditIcon name={subreddit.name} />
          <div>
            <h1 className={styles.title}>r/{subreddit.name}</h1>
            <p className={styles.description}>{subreddit.description}</p>
            <p className={styles.meta}>
              Создатель: <span className={styles.creator}>{subreddit.user?.username ?? "Неизвестен"}</span>
            </p>
            {user && (
              <button
                className={isSubscribed ? styles.unsubscribeButton : styles.subscribeButton}
                onClick={isSubscribed ? handleUnsubscribe : handleSubscribe}
                disabled={loadingSub}
              >
                {loadingSub ? "..." : isSubscribed ? "Отписаться" : "Подписаться"}
              </button>
            )}
          </div>
        </div>
      </div>

      <h2 className={styles.postsTitle}>Посты в сабреддите</h2>
      {posts.length === 0 ? (
        <p className={styles.noPosts}>Постов пока нет</p>
      ) : (
        <div className={styles.postsList}>
          {posts.map((post) => (
            <div
              key={post.id}
              className={styles.postItem}
              onClick={() => navigate(`/post/${post.id}`)}
            >
              <div className={styles.postTitle}>{post.title}</div>
              <div className={styles.postContent}>{post.content}</div>
              {(post.image_url || post.image_path) && (
                <div
                  className={styles.imageWrapper}
                  onClick={e => e.stopPropagation()}
                >
                  <img
                    src={`http://localhost:8000/${post.image_url || post.image_path}`}
                    alt="Post"
                    className={styles.postImage}
                  />
                </div>
              )}
              <div className={styles.postMeta}>
                Автор: {post.user?.username ?? "Неизвестен"}
              </div>
              <PostVotes post={post} />
            </div>
          ))}
        </div>
      )}

      <div className={styles.pagination}>
        <button
          className={styles.pageButton}
          onClick={() => setOffset(Math.max(offset - limit, 0))}
          disabled={offset === 0}
        >
          Назад
        </button>
        {posts.length === limit && (
          <button
            className={styles.pageButton}
            onClick={() => setOffset(offset + limit)}
          >
            Далее
          </button>
        )}
      </div>
    </div>
  );
}
