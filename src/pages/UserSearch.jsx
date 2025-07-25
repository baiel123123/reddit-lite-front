import React, { useState, useEffect, useCallback, useMemo } from "react";
import { Link, useLocation } from "react-router-dom";
import styles from "./styles/UserSearch.module.css";
import PostItem from "../features/posts/components/PostItem";
import fetchWithRefresh from '../api.js';
const fetch = fetchWithRefresh;

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

function UserAvatar({ user }) {
  const size = 36;
  const url = user.avatar_url
    ? user.avatar_url
    : `http://localhost:8000/users/avatar/${user.id}`;
  return (
    <img
      src={url}
      alt="avatar"
      style={{
        width: size,
        height: size,
        borderRadius: '50%',
        objectFit: 'cover',
        marginRight: 14,
        border: '2px solid #ff4500',
        background: 'linear-gradient(135deg, #232324 60%, #ff4500 100%)',
        boxShadow: '0 1px 4px rgba(0,0,0,0.12)',
        display: 'block',
      }}
      onError={e => { e.target.onerror = null; e.target.src = "/default-avatar.png"; }}
    />
  );
}

// Компонент для иконки сабреддита
function SubredditIcon({ name }) {
  if (!name) return (
    <div style={{ width: 36, height: 36, borderRadius: '50%', background: '#232324', color: '#b3b3b3', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 18, marginRight: 14, border: '2px solid #292929' }}>r</div>
  );
  return (
    <div style={{ width: 36, height: 36, borderRadius: '50%', background: '#272729', color: '#ffb000', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 18, marginRight: 14, border: '2px solid #232324' }}>{name[0].toUpperCase()}</div>
  );
}

export default function UserSearch() {
  const query = useQuery();
  const initialQuery = query.get("query") || "";
  const initialTab = query.get("tab") || "posts";

  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [activeTab, setActiveTab] = useState(initialTab);
  const [results, setResults] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const tabs = useMemo(() => [
    { id: "posts", label: "Посты", api: "/posts/find/" },
    { id: "users", label: "Пользователи", api: "/users/find/" },
    { id: "subreddits", label: "Сообщества", api: "/subreddit/find/" }
  ], []);

  const fetchResults = useCallback(async (queryParam, tab) => {
    setLoading(true);
    setError("");
    
    try {
      const tabConfig = tabs.find(t => t.id === tab);
      if (!tabConfig) throw new Error("Неизвестная вкладка");

      let queryString;
      if (tab === "users") {
        queryString = new URLSearchParams({ username: queryParam.trim() }).toString();
      } else if (tab === "subreddits") {
        queryString = new URLSearchParams({ name: queryParam.trim() }).toString();
      } else if (tab === "posts") {
        queryString = new URLSearchParams({
          search: queryParam.trim(),
          limit: 20,
          offset: 0
        }).toString();
      } else {
        queryString = new URLSearchParams({ query: queryParam.trim() }).toString();
      }
      
      const response = await fetch(`/api${tabConfig.api}?${queryString}`, {
        method: "GET",
        credentials: "include",
      });
      if (!response.ok) throw new Error("Ошибка при поиске");
      
      let data = await response.json();

      if (tab === "posts" && Array.isArray(data) && data.length > 0) {
        const ids = data.map((p) => p.id).join(",");
        const voteRes = await fetch(`/posts/votes/by-user?ids=${ids}`, {
          credentials: "include"
        });
        const votes = await voteRes.json();
        data = data.map((post) => ({ ...post, user_vote: votes[post.id] ?? null }));
      }

      setResults(data);
    } catch (err) {
      setError(err.message);
      setResults([]);
    } finally {
      setLoading(false);
    }
  }, [tabs]);

  useEffect(() => {
    if (!initialQuery.trim()) {
      setResults([]);
      setError("");
      return;
    }
    fetchResults(initialQuery, initialTab);
  }, [initialQuery, initialTab, fetchResults]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) {
      setError("Введите поисковый запрос");
      return;
    }
    
    const newUrl = `?query=${encodeURIComponent(searchQuery.trim())}&tab=${activeTab}`;
    window.history.replaceState(null, "", newUrl);
    fetchResults(searchQuery, activeTab);
  };

  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
    if (searchQuery.trim()) {
      const newUrl = `?query=${encodeURIComponent(searchQuery.trim())}&tab=${tabId}`;
      window.history.replaceState(null, "", newUrl);
      fetchResults(searchQuery, tabId);
    }
  };

  const renderUserItem = (user) => (
    <li key={user.id} className={styles.userItem}>
      <Link to={`/profile/${user.id}`} className={styles.userLink}>
        <div className={styles.userInfo} style={{ alignItems: 'center' }}>
          <UserAvatar user={user} />
          <div className={styles.userMeta}>
            <span className={styles.userId}>ID: {user.id}</span>
            <span className={styles.username}>{user.username}</span>
          </div>
          <span className={styles.userEmail}>{user.email}</span>
        </div>
      </Link>
    </li>
  );

  const renderPostItem = (post) => (
    <li key={post.id} className={styles.userItem} style={{ padding: 0, background: 'none', border: 'none', marginBottom: 20 }}>
      <PostItem post={post} />
    </li>
  );

  const renderSubredditItem = (subreddit) => (
    <li key={subreddit.id} className={styles.userItem}>
      <Link to={`/subreddit/${subreddit.id}`} className={styles.userLink}>
        <div className={styles.userInfo}>
          <SubredditIcon name={subreddit.name} />
          <div className={styles.userMeta}>
            <span className={styles.username}>r/{subreddit.name}</span>
            <span className={styles.userId}>ID: {subreddit.id}</span>
          </div>
          <span className={styles.userEmail}>{subreddit.description}</span>
        </div>
      </Link>
    </li>
  );

  const renderResults = () => {
    if (results.length === 0) return null;

    switch (activeTab) {
      case "users":
        return results.map(renderUserItem);
      case "posts":
        return results.map(renderPostItem);
      case "subreddits":
        return results.map(renderSubredditItem);
      default:
        return null;
    }
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Поиск</h1>
      
      <form onSubmit={handleSearch} className={styles.searchForm}>
        <input
          type="text"
          placeholder="Введите поисковый запрос..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className={styles.searchInput}
        />
        <button type="submit" className={styles.searchButton}>
          Найти
        </button>
      </form>

      <div className={styles.tabs}>
        {tabs.map((tab) => (
          <button
            key={tab.id}
            className={`${styles.tab} ${activeTab === tab.id ? styles.activeTab : ''}`}
            onClick={() => handleTabChange(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {loading && <p className={styles.loading}>Загрузка...</p>}
      {error && <p className={styles.error}>{error}</p>}

      {results.length > 0 ? (
        <ul className={styles.resultsList}>
          {renderResults()}
        </ul>
      ) : (
        !loading && !error && searchQuery.trim() && (
          <p className={styles.noResults}>
            По запросу "{searchQuery}" ничего не найдено
          </p>
        )
      )}
    </div>
  );
}
