import React, { useEffect, useState, useCallback, useRef } from "react";
import styles from "./styles/PostFeed.module.css";
import useObserver from "../../hooks/useObserver";
import { formatPosts } from "../../utils/postFormatter";
import PostItem from "./components/PostItem";

export default function PostFeed() {
  const [posts, setPosts] = useState([]);
  const [sortBy, setSortBy] = useState("hot");
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const limit = 10;

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
        <PostItem key={post.id} post={post} />
      ))}

      {loading && <p>Загрузка...</p>}
      {!hasMore && <p>Больше постов нет</p>}
      <div ref={bottomRef} style={{ height: "1px" }} />
    </div>
  );
}
