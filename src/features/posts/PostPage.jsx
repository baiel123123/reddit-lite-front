import React, { useEffect, useState, useCallback, useRef } from "react";
import { useParams } from "react-router-dom";
import PostItem from "./components/PostItem";
import CommentsList from "../comments/components/CommentsList";
import AddCommentForm from "../comments/components/AddCommentForm";
import styles from "./styles/PostPage.module.css";

export default function PostPage() {
  const { postId } = useParams();

  const [post, setPost] = useState(null);
  const [flatComments, setFlatComments] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [error, setError] = useState("");
  const [hasMore, setHasMore] = useState(true);

  const limit = 20;
  const offsetRef = useRef(0);
  const loadingRef = useRef(false);
  const observer = useRef();

  const fetchPost = useCallback(async () => {
    try {
      const res = await fetch(`http://localhost:8000/posts/${postId}`, {
        credentials: "include",
      });
      if (!res.ok) throw new Error("Пост не найден");
      const data = await res.json();
      setPost(data);
    } catch (err) {
      setError(err.message);
    }
  }, [postId]);

  const fetchComments = useCallback(
    async (offsetParam = 0) => {
      if (loadingRef.current) return;
      loadingRef.current = true;
      try {
        const res = await fetch(
          `http://localhost:8000/comments/comments/by_post/${postId}?offset=${offsetParam}&limit=${limit}`,
          { credentials: "include" }
        );
        if (!res.ok) throw new Error("Ошибка загрузки комментариев");

        const data = await res.json();
        setFlatComments((prev) => {
          const existingIds = new Set(prev.map((c) => c.id));
          const newUnique = data.filter((c) => !existingIds.has(c.id));
          return [...prev, ...newUnique];
        });

        offsetRef.current = offsetParam + limit;
        setHasMore(data.length === limit);
      } catch (err) {
        console.error(err);
      } finally {
        loadingRef.current = false;
      }
    },
    [postId]
  );

  const fetchCurrentUser = useCallback(async () => {
    try {
      const res = await fetch("http://localhost:8000/users/me", {
        credentials: "include",
      });
      if (!res.ok) return;
      const data = await res.json();
      setCurrentUser(data);
    } catch (_) {}
  }, []);

  // Удаление комментария
  const onDeleteComment = async (commentId) => {
    if (!window.confirm("Удалить комментарий?")) return;

    try {
      const res = await fetch(`http://localhost:8000/comments/delete/${commentId}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (!res.ok) throw new Error("Ошибка при удалении комментария");
      setFlatComments((prev) => prev.filter((c) => c.id !== commentId));
    } catch (e) {
      console.error(e);
      alert("Не удалось удалить комментарий");
    }
  };

  // Голосование за комментарий
  const handleCommentVote = async (commentId, isUpvote) => {
    try {
      const res = await fetch(
        `http://localhost:8000/comments/upvote/${commentId}?is_upvote=${isUpvote}`,
        { method: "POST", credentials: "include" }
      );
      if (!res.ok) throw new Error("Ошибка голосования");

      setFlatComments((prev) =>
        prev.map((c) => {
          if (c.id !== commentId) return c;

          // Если пользователь уже проголосовал
          let newUpvote = c.upvote;
          if (c.user_vote === null) {
            newUpvote += isUpvote ? 1 : -1;
          } else if (c.user_vote !== isUpvote) {
            newUpvote += isUpvote ? 2 : -2;
          }

          return {
            ...c,
            upvote: newUpvote,
            user_vote: isUpvote,
          };
        })
      );
    } catch (err) {
      console.error(err);
    }
  };

  // Удаление голоса
  const handleRemoveCommentVote = async (commentId) => {
    try {
      const res = await fetch(
        `http://localhost:8000/comments/delete_upvote/${commentId}`,
        {
          method: "POST",
          credentials: "include",
        }
      );
      if (!res.ok) throw new Error("Ошибка удаления голоса");

      setFlatComments((prev) =>
        prev.map((c) => {
          if (c.id !== commentId) return c;

          const newUpvote = c.user_vote === true ? c.upvote - 1 : c.upvote + 1;

          return {
            ...c,
            upvote: newUpvote,
            user_vote: null,
          };
        })
      );
    } catch (err) {
      console.error(err);
    }
  };

  // Обновление комментария после редактирования
  const handleCommentUpdate = (updatedComment) => {
    setFlatComments((prev) =>
      prev.map((c) => (c.id === updatedComment.id ? updatedComment : c))
    );
  };

  // Ответ на комментарий
  const handleReply = async (parentId, replyContent) => {
    try {
      const res = await fetch(
        `http://localhost:8000/comments/reply_to_comment/${parentId}`,
        {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ content: replyContent, post_id: postId }),
        }
      );
      if (!res.ok) throw new Error("Ошибка при ответе");

      const { data: newComment } = await res.json();

      setFlatComments((prev) => [...prev, newComment]);
    } catch (err) {
      alert(err.message);
    }
  };

  const lastCommentRef = useCallback(
    (node) => {
      if (!hasMore) return;
      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
          fetchComments(offsetRef.current);
        }
      });

      if (node) observer.current.observe(node);
    },
    [hasMore, fetchComments]
  );

  useEffect(() => {
    setFlatComments([]);
    offsetRef.current = 0;
    setHasMore(true);
    fetchPost();
    fetchComments(0);
    fetchCurrentUser();
  }, [postId, fetchPost, fetchComments, fetchCurrentUser]);

  if (error) return <p className={styles.error}>{error}</p>;
  if (!post) return <p className={styles.loading}>Загрузка...</p>;

  const rootComments = flatComments.filter((c) => c.parent_comment_id === null);

  return (
    <div className={styles.container}>
      <PostItem post={post} currentUser={currentUser} />

      <h3>Оставить комментарий</h3>
      <div className={styles.addCommentSection}>
        <AddCommentForm
          postId={postId}
          onCommentAdded={(newComment) =>
            setFlatComments((prev) => [newComment, ...prev])
          }
        />
      </div>

      <h3>Комментарии</h3>
      <CommentsList
        comments={rootComments}
        onVote={handleCommentVote}
        onRemoveVote={handleRemoveCommentVote}
        onDelete={onDeleteComment}
        currentUser={currentUser}
        onUpdate={handleCommentUpdate}
        onReply={handleReply}
        lastCommentRef={lastCommentRef}
      />
    </div>
  );
}