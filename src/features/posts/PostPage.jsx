import React, { useEffect, useState, useCallback } from "react";
import { useParams } from "react-router-dom";
import PostItem from "./components/PostItem";
import CommentsList from "../comments/components/CommentsList";
import AddCommentForm from "../comments/components/AddCommentForm";

export default function PostPage() {
  const { postId } = useParams();
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [error, setError] = useState("");
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const limit = 20;

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
      try {
        const res = await fetch(
          `http://localhost:8000/comments/comments/by_post/${postId}?offset=${offsetParam}&limit=${limit}`,
          {
            credentials: "include",
          }
        );
        if (!res.ok) throw new Error("Ошибка загрузки комментариев");
        const data = await res.json();
        if (offsetParam === 0) {
          setComments(data);
        } else {
          setComments((prev) => [...prev, ...data]);
        }
        setOffset(offsetParam + limit);
        setHasMore(data.length === limit);
      } catch (err) {
        console.error(err);
      }
    },
    [postId, limit]
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

  async function onDeleteComment(commentId) {
    const confirmed = window.confirm("Удалить комментарий?");
    if (!confirmed) return;

    try {
      const res = await fetch(`http://localhost:8000/comments/delete/${commentId}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (!res.ok) throw new Error("Ошибка при удалении комментария");

      setComments((prev) => prev.filter((c) => c.id !== commentId));
    } catch (e) {
      console.error(e);
      alert("Не удалось удалить комментарий");
    }
  }

  useEffect(() => {
    fetchPost();
    fetchComments(0);
    fetchCurrentUser();
  }, [fetchPost, fetchComments, fetchCurrentUser]);

  if (error) return <p>{error}</p>;
  if (!post) return <p>Загрузка...</p>;

  const handleCommentVote = async (commentId, isUpvote) => {
    try {
      const res = await fetch(
        `http://localhost:8000/comments/upvote/${commentId}?is_upvote=${isUpvote}`,
        {
          method: "POST",
          credentials: "include",
        }
      );
      if (!res.ok) throw new Error("Ошибка голосования");
      setComments((prev) =>
        prev.map((c) =>
          c.id === commentId
            ? {
                ...c,
                upvote: isUpvote ? c.upvote + 1 : c.upvote - 1,
                user_vote: isUpvote,
              }
            : c
        )
      );
    } catch (err) {
      console.error(err);
    }
  };

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
      setComments((prev) =>
        prev.map((c) =>
          c.id === commentId
            ? {
                ...c,
                upvote: c.user_vote === true ? c.upvote - 1 : c.upvote + 1,
                user_vote: null,
              }
            : c
        )
      );
    } catch (err) {
      console.error(err);
    }
  };
  
  const handleCommentUpdate = (updatedComment) => {
    setComments((prev) =>
      prev.map((c) => (c.id === updatedComment.id ? updatedComment : c))
    );
  };

  return (
    <div>
      <PostItem post={post} currentUser={currentUser} />

      <h3>Оставить комментарий</h3>
      <AddCommentForm postId={postId} onCommentAdded={() => fetchComments(0)} />

      <h3>Комментарии</h3>
      <CommentsList
        comments={comments}
        onVote={handleCommentVote}
        onRemoveVote={handleRemoveCommentVote}
        onDelete={onDeleteComment}
        currentUser={currentUser}
        onUpdate={handleCommentUpdate}
      />

      {hasMore && (
        <button onClick={() => fetchComments(offset)}>Загрузить ещё</button>
      )}
    </div>
  );
}
