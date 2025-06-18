import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import UserProfile from "../features/users/components/UserProfile";
import Upvote from "../components/PostVotes";
import UpdateUserModal from "../features/users/components/UpdateUser";
import CommunityModal from "../features/subreddits/components/CommunityModal";
import styles from "./styles/MyProfile.module.css";

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
  const [showMenu, setShowMenu] = useState(null);
  const [showCommunityMenu, setShowCommunityMenu] = useState(null);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const res = await fetch("http://localhost:8000/users/me", {
          credentials: "include",
        });
        if (!res.ok) throw new Error("Ошибка при загрузке пользователя");
        const data = await res.json();
        setUser(data);

        const postsRes = await fetch("http://localhost:8000/posts/my_posts/", {
          credentials: "include",
        });
        if (!postsRes.ok) throw new Error("Ошибка при загрузке постов");
        const postsData = await postsRes.json();

        if (!Array.isArray(postsData) || postsData.length === 0) {
          setHasMore(false);
          setLoading(false);
          setPosts([]);
          return;
        }

        const ids = postsData.map((p) => p.id).join(",");
        const voteRes = await fetch(
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
        const res = await fetch(`${API_URL}/my-subreddits/`, {
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
      const res = await fetch(`http://localhost:8000/posts/delete/${postId}`, {
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

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(bodyData),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.detail || "Ошибка при сохранении");
      }
      const subRes = await fetch(`${API_URL}/my-subreddits/`, {
        credentials: "include",
      });
      const data = await subRes.json();
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
      const res = await fetch(`${API_URL}/${id}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (!res.ok) throw new Error("Ошибка при удалении");
      const subRes = await fetch(`${API_URL}/my-subreddits/`, {
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
                <li
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
                    <span className={styles.authorInfo}>
                      Автор: {post.user?.username || user.username || "Неизвестный"}
                    </span>
                    <span className={styles.separator}> </span>
                    <span className={styles.subredditInfo}>
                      Subreddit:{" "}
                      <Link
                        to={`/subreddit/${post.subreddit.id}`}
                        className={styles.subredditLink}
                        onClick={(e) => e.stopPropagation()}
                      >
                        {post.subreddit.name}
                      </Link>
                    </span>
                  </div>

                  <div className={styles.postVotesContainer}>
                    <Upvote post={post} />
                  </div>

                  <div className={styles.menuContainer}>
                    <button
                      className={styles.menuButton}
                      onClick={(e) => {
                        e.stopPropagation();
                        setShowMenu(showMenu === post.id ? null : post.id);
                      }}
                    >
                      &#x22EE;
                    </button>
                    {showMenu === post.id && (
                      <div className={styles.menu}>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/edit-post/${post.id}`);
                          }}
                        >
                          Редактировать
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(post.id);
                          }}
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
          {subreddits.length === 0 ? (
            <p className={styles.noSubreddits}>Сообществ пока нет</p>
          ) : (
            <ul className={styles.subredditsList}>
              {subreddits.map((sub) => (
                <li key={sub.id} className={styles.subredditItem}>
                  {/* Заголовок с названием и кнопкой меню справа */}
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
