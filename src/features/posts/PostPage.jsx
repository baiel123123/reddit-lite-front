import React, { useEffect, useState, useCallback, useRef} from "react";
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


  const handleCommentVote = async (commentId, isUpvote) => {
    try {
      const res = await fetch(
        `http://localhost:8000/comments/upvote/${commentId}?is_upvote=${isUpvote}`,
        { method: "POST", credentials: "include" }
      );
      if (!res.ok) throw new Error("Ошибка голосования");

      const voteResponse = await res.json();
      console.log("Ответ сервера после голосования:", voteResponse);

      setFlatComments((prev) => 
        updateNestedComments(prev, { 
          id: commentId, 
          upvote: voteResponse.upvotes, 
          user_vote: isUpvote 
        })
      );
    } catch (err) {
      console.error(err);
    }
  };


  const handleRemoveCommentVote = async (commentId) => {
    try {
      const res = await fetch(
        `http://localhost:8000/comments/delete_upvote/${commentId}`,
        { method: "POST", credentials: "include" }
      );
      if (!res.ok) throw new Error("Ошибка удаления голоса");

      setFlatComments((prev) =>
        updateNestedComments(prev, { id: commentId, user_vote: null })
      );
    } catch (err) {
      console.error(err);
    }
  };

  const updateNestedComments = (comments, updatedComment) => {
    return comments.map((comment) => {
      if (comment.id === updatedComment.id) {
        let newUpvote = updatedComment.upvote;

        // Если голос удаляется, корректируем счетчик
        if (updatedComment.user_vote === null) {
          newUpvote = comment.user_vote === true ? comment.upvote - 1 : comment.upvote + 1;
        }

        return {
          ...comment,
          ...updatedComment,
          upvote: newUpvote, // Корректируем upvote при отмене
          children: comment.children || updatedComment.children, // сохраняем вложенные комментарии
        };
      }
      if (comment.children && comment.children.length > 0) {
        return { 
          ...comment, 
          children: updateNestedComments(comment.children, updatedComment) 
        };
      }
      return comment;
    });
  };


  const handleCommentUpdate = (updatedComment) => {
    setFlatComments((prev) => updateNestedComments(prev, updatedComment));
  };

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
          onCommentAdded={(newComment, tempId) => {
            if (tempId && newComment) {
              // Заменяем временный комментарий на настоящий
              setFlatComments((prev) =>
                prev.map((comment) => (comment.id === tempId ? newComment : comment))
              );
            } else if (tempId && newComment === null) {
              // Если произошла ошибка — удаляем временный комментарий
              setFlatComments((prev) =>
                prev.filter((comment) => comment.id !== tempId)
              );
            } else {
              // Если вызывается без tempId (например, при первой загрузке) — просто добавляем комментарий
              setFlatComments((prev) => [newComment, ...prev]);
            }
          }}
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