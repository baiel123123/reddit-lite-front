import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import UserProfile from "../features/users/components/UserProfile";
import UpdateUserModal from "../features/users/components/UpdateUser";
import CommunityModal from "../features/subreddits/components/CommunityModal";
import PostItem from "../features/posts/components/PostItem";
import styles from "./styles/MyProfile.module.css";
import fetchWithRefresh from '../api.js';

const API_URL = "http://localhost:8000/subreddit";

export default function MyProfile() {
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [subreddits, setSubreddits] = useState([]);
  const [activeTab, setActiveTab] = useState("posts");
  const [error, setError] = useState("");
  const [showUserModal, setShowUserModal] = useState(false);
  const [showCommunityModal, setShowCommunityModal] = useState(false);
  const [editingCommunity, setEditingCommunity] = useState(null);
  const [showCommunityMenu, setShowCommunityMenu] = useState(null);
  const [, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [showMenu, setShowMenu] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const res = await fetchWithRefresh("/users/me", {
          credentials: "include",
        });
        if (!res.ok) throw new Error("Ошибка при загрузке пользователя");
        const data = await res.json();
        setUser(data);

        const postsRes = await fetchWithRefresh("/posts/my_posts/", {
          credentials: "include",
        });
        if (postsRes.status === 404) {
          setHasMore(false);
          setLoading(false);
          setPosts([]);
          return;
        }
        if (!postsRes.ok) throw new Error("Ошибка при загрузке постов");
        const postsData = await postsRes.json();

        if (!Array.isArray(postsData) || postsData.length === 0) {
          setHasMore(false);
          setLoading(false);
          setPosts([]);
          return;
        }

        const ids = postsData.map((p) => p.id).join(",");
        const voteRes = await fetchWithRefresh(
          `http://localhost:8000/posts/votes/by-user?ids=${ids}`,
          { credentials: "include" }
        );
        const votes = await voteRes.json();

        const postsWithVotes = postsData.map((post) => ({
          ...post,
          user_vote: votes[post.id] ?? null,
        }));

        setPosts(postsWithVotes);
      } catch (err) {
        console.error(err);
        setError(err.message);
      }
    };

    fetchCurrentUser();
  }, []);

  useEffect(() => {
    const fetchMySubreddits = async () => {
      if (!user) return;
      try {
        const res = await fetchWithRefresh(`${API_URL}/my-subreddits/`, {
          credentials: "include",
        });
        if (!res.ok) throw new Error("Ошибка при загрузке сообществ");
        const data = await res.json();
        setSubreddits(data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchMySubreddits();
  }, [user]);

  const handleDelete = async (postId) => {
    if (!window.confirm("Вы уверены, что хотите удалить этот пост?")) return;
    try {
      const res = await fetchWithRefresh(`/posts/delete/${postId}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (!res.ok) throw new Error("Ошибка при удалении поста");
      setPosts((prevPosts) => prevPosts.filter((post) => post.id !== postId));
    } catch (err) {
      alert(err.message);
    }
  };

  const handleProfileUpdate = (updatedUser) => {
    setUser(updatedUser);
  };

  const handleCommunitySave = async (form, id) => {
    try {
      const url = id ? `${API_URL}/${id}` : `${API_URL}/create/`;
      const method = id ? "PUT" : "POST";
      const bodyData = id ? { description: form.description } : form;

      const res = await fetchWithRefresh(url, {
        method,
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(bodyData),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.detail || "Ошибка при сохранении");
      }
      const subRes = await fetchWithRefresh(`${API_URL}/my-subreddits/`, {
        credentials: "include",
      });
      let data = await subRes.json();
      if (!Array.isArray(data)) data = [];
      setSubreddits(data);
      setShowCommunityModal(false);
      setEditingCommunity(null);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSubDelete = async (id) => {
    if (!window.confirm("Удалить сообщество?")) return;
    try {
      const res = await fetchWithRefresh(`${API_URL}/${id}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (!res.ok) throw new Error("Ошибка при удалении");
      const subRes = await fetchWithRefresh(`${API_URL}/my-subreddits/`, {
        credentials: "include",
      });
      const data = await subRes.json();
      setSubreddits(data);
    } catch (err) {
      console.error(err);
    }
  };

  if (error) return <p className={styles.error}>{error}</p>;
  if (!user) return <p className={styles.loading}>Загрузка...</p>;

  return (
    <div className={styles.myProfileContainer}>
      <UserProfile
        user={user}
        currentUser={user}
        onUpdateClick={() => setShowUserModal(true)}
      />

      {showUserModal && (
        <UpdateUserModal
          user={user}
          onClose={() => setShowUserModal(false)}
          onUpdate={handleProfileUpdate}
        />
      )}

      <div className={styles.tabs}>
        <button
          className={activeTab === "posts" ? styles.activeTab : ""}
          onClick={() => setActiveTab("posts")}
        >
          Мои посты
        </button>
        <button
          className={activeTab === "subreddits" ? styles.activeTab : ""}
          onClick={() => setActiveTab("subreddits")}
        >
          Мои сообщества
        </button>
      </div>

      {activeTab === "posts" ? (
        <div>
          <h3 className={styles.postsTitle}>Мои посты</h3>
          {posts.length === 0 && !loading ? (
            <p className={styles.noPosts}>Постов пока нет</p>
          ) : (
            <ul className={styles.postsList}>
              {posts.map((post) => (
                <li key={post.id} className={styles.profilePostListItem} style={{ position: 'relative' }}>
                  <PostItem post={post} />
                  <div style={{ position: 'absolute', top: 10, right: 10 }}>
                    <button
                      className={styles.menuButton}
                      onClick={e => {
                        e.stopPropagation();
                        setShowMenu(showMenu === post.id ? null : post.id);
                      }}
                      style={{ background: 'none', border: 'none', fontSize: 22, color: '#bbb', cursor: 'pointer' }}
                    >
                      &#x22EE;
                    </button>
                    {showMenu === post.id && (
                      <div className={styles.menu} style={{ position: 'absolute', right: 0, top: 30, background: '#292929', border: '1px solid #444', borderRadius: 6, zIndex: 100 }}>
                        <button
                          onClick={e => {
                            e.stopPropagation();
                            navigate(`/edit-post/${post.id}`);
                            setShowMenu(null);
                          }}
                          style={{ background: 'none', border: 'none', color: '#e8e8e8', fontSize: 16, padding: '8px 12px', width: '100%', textAlign: 'left', cursor: 'pointer' }}
                        >
                          Редактировать
                        </button>
                        <button
                          onClick={e => {
                            e.stopPropagation();
                            handleDelete(post.id);
                            setShowMenu(null);
                          }}
                          style={{ background: 'none', border: 'none', color: '#e8e8e8', fontSize: 16, padding: '8px 12px', width: '100%', textAlign: 'left', cursor: 'pointer' }}
                        >
                          Удалить
                        </button>
                      </div>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      ) : (
        <div>
          <h3 className={styles.subredditsTitle}>Мои сообщества</h3>
          <div className={styles.communityHeader}>
            <button
              className={styles.createCommunityButton}
              onClick={() => {
                setEditingCommunity(null);
                setShowCommunityModal(true);
              }}
            >
              Создать сообщество
            </button>
          </div>
          {(!subreddits || !Array.isArray(subreddits) || subreddits.length === 0) ? (
            <p className={styles.noSubreddits}>Сообществ пока нет</p>
          ) : (
            <ul className={styles.subredditsList}>
              {subreddits.map((sub) => (
                <li key={sub.id} className={styles.subredditItem}>
                  <div className={styles.subredditHeader}>
                    <Link
                      to={`/subreddit/${sub.id}`}
                      className={styles.subredditLink}
                    >
                      {sub.name}
                    </Link>
                    <button
                      className={styles.menuButton}
                      onClick={(e) => {
                        e.stopPropagation();
                        setShowCommunityMenu(
                          showCommunityMenu === sub.id ? null : sub.id
                        );
                      }}
                    >
                      &#x22EE;
                    </button>
                  </div>
                  {showCommunityMenu === sub.id && (
                    <div className={styles.menu}>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setEditingCommunity(sub);
                          setShowCommunityModal(true);
                          setShowCommunityMenu(null);
                        }}
                      >
                        Редактировать
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleSubDelete(sub.id);
                          setShowCommunityMenu(null);
                        }}
                      >
                        Удалить
                      </button>
                    </div>
                  )}
                  <p className={styles.subredditDescription}>{sub.description}</p>
                  <p className={styles.communityMeta}>
                    Создано: {user.username}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      {showCommunityModal && (
        <CommunityModal
          community={editingCommunity}
          onClose={() => setShowCommunityModal(false)}
          onSave={handleCommunitySave}
        />
      )}
    </div>
  );
}
