import React, { useEffect, useState, useCallback, useRef } from "react";
import PostVotes from "../../components/PostVotes";
import { useNavigate, Link } from "react-router-dom";
import styles from "./styles/PostFeed.module.css";
import useObserver from "../../hooks/useObserver";
import { formatPosts } from "../../utils/postFormatter";

export default function PostFeed() {
  const [posts, setPosts] = useState([]);
  const [sortBy, setSortBy] = useState("hot");
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [modalImage, setModalImage] = useState(null);
  const limit = 10;
  const navigate = useNavigate();

  const lastLoadTimeRef = useRef(0);

  const loadMorePosts = useCallback(async () => {
    const now = Date.now();
    if (now - lastLoadTimeRef.current < 1000) return;
    lastLoadTimeRef.current = now;
    
    if (loading || !hasMore) return;
    setLoading(true);

    try {
      const res = await fetch(
        `http://localhost:8000/posts/lenta/?sort_by=${sortBy}&limit=${limit}&offset=${offset}`,
        { credentials: "include" }
      );
      const postsData = await res.json();

      if (postsData.length === 0) {
        setHasMore(false);
        return;
      }

      const ids = postsData.map((p) => p.id).join(",");
      const voteRes = await fetch(
        `http://localhost:8000/posts/votes/by-user?ids=${ids}`,
        { credentials: "include" }
      );
      const votes = await voteRes.json();

      const updatedPosts = formatPosts(postsData).map((post) => ({
        ...post,
        user_vote: votes[post.id] ?? null,
      }));

      setPosts((prev) => [...prev, ...updatedPosts]);
      setOffset((prev) => prev + limit);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [loading, hasMore, sortBy, offset]);

  useEffect(() => {
    setPosts([]);
    setOffset(0);
    setHasMore(true);
  }, [sortBy]);

  useEffect(() => {
    if (offset === 0) loadMorePosts();
  }, [loadMorePosts, offset]);

  const bottomRef = useObserver(loadMorePosts, hasMore);

  const closeModal = () => setModalImage(null);

  return (
    <div className={styles.container}>
      <select
        className={styles.sortSelect}
        value={sortBy}
        onChange={(e) => setSortBy(e.target.value)}
      >
        <option value="hot">Горячее</option>
        <option value="new">Новое</option>
        <option value="top">Топ</option>
      </select>

      {posts.map((post) => (
        <div
          key={post.id}
          className={styles.postItem}
          onClick={() => navigate(`/post/${post.id}`)}
        >
          <h4 className={styles.postTitle}>{post.title}</h4>
          {post.image_url && (
            <div
              className={styles.imageWrapper}
              onClick={(e) => {
                e.stopPropagation();
                setModalImage(post.image_url);
              }}
            >
              <img
                src={`http://localhost:8000/${post.image_url}`}
                alt="Post"
                className={styles.postImage}
              />
            </div>
          )}
          <p className={styles.postContent}>{post.content}</p>
          <div className={styles.postMeta}>
            <span>Автор: {post.user.username}</span>
            <span>
              Subreddit:{" "}
              <Link
                to={`/subreddit/${post.subreddit.id}`}
                className={styles.subredditLink}
                onClick={(e) => e.stopPropagation()}
              >
                {post.subreddit.name}
              </Link>
            </span>
            <span className={styles.commentInfo}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="currentColor"
                width="15"
                height="15"
                class="size-6"
              >
                <path stroke-linecap="round" stroke-linejoin="round"
                      d="M12 20.25c4.97 0 9-3.694 9-8.25s-4.03-8.25-9-8.25S3 7.444 3 12c0 2.104.859 4.023 2.273 5.48.432.447.74 1.04.586 1.641a4.483 4.483 0 0 1-.923 1.785A5.969 5.969 0 0 0 6 21c1.282 0 2.47-.402 3.445-1.087.81.22 1.668.337 2.555.337Z" />
              </svg>
              {post.comments_count || 0}
            </span>
          </div>
          <div className={styles.postVotesContainer}>
            <PostVotes post={post} />
          </div>
        </div>
      ))}

      {loading && <p>Загрузка...</p>}
      {!hasMore && <p>Больше постов нет</p>}
      <div ref={bottomRef} style={{ height: "1px" }} />

      {modalImage && (
        <div className={styles.modalOverlay} onClick={closeModal}>
          <div className={styles.modalContent}>
            <img
              src={`http://localhost:8000/${modalImage}`}
              alt="Полный просмотр"
            />
          </div>
        </div>
      )}
    </div>
  );
}
