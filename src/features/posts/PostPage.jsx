import React, { useEffect, useState, useCallback } from "react";
import { useParams } from "react-router-dom";
import PostItem from "./components/PostItem";
import CommentsList from "../comments/components/CommentsList";
import AddCommentForm from "../comments/components/AddCommentForm";
import { useRef } from "react";

export default function PostPage() {
  const { postId } = useParams();
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [error, setError] = useState("");
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const limit = 20;
  const observer = useRef();
  const offsetRef = useRef(0);

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
        offsetRef.current = offsetParam + limit;
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


  const handleReply = async (parentCommentId, replyContent) => {
    try {
      const res = await fetch(`http://localhost:8000/comments/reply_to_comment/${parentCommentId}`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: replyContent, post_id: postId }),
      });
      if (!res.ok) throw new Error("Ошибка при отправке ответа");

      const { data: newComment } = await res.json(); 
      
      setComments((prev) => {
        const index = prev.findIndex((c) => c.id === parentCommentId);
        if (index === -1) return [...prev, newComment];
        const updated = [...prev];
        updated.splice(index + 1, 0, newComment);
        return updated;
      });

    } catch (err) {
      alert(err.message);
    }
  };

  useEffect(() => {
    fetchPost();
    fetchComments(0);
    fetchCurrentUser();
  }, [fetchPost, fetchComments, fetchCurrentUser]);

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


  if (error) return <p>{error}</p>;
  if (!post) return <p>Загрузка...</p>;

  return (
    <div>
      <PostItem post={post} currentUser={currentUser} />

      <h3>Оставить комментарий</h3>
      <AddCommentForm
        postId={postId}
        onCommentAdded={(newComment) => setComments((prev) => [newComment, ...prev])}
      />

      <h3>Комментарии</h3>
      <CommentsList
        comments={comments}
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
