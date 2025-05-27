import React, { useEffect, useState } from "react";
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

  const fetchPost = async () => {
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
  };

  const fetchComments = async () => {
    try {
      const res = await fetch(`http://localhost:8000/comments/comments/by_post/${postId}`, {
        credentials: "include",
      });
      if (!res.ok) throw new Error("Ошибка загрузки комментариев");
      const data = await res.json();
      setComments(data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchCurrentUser = async () => {
    try {
      const res = await fetch("http://localhost:8000/users/me", {
        credentials: "include",
      });
      if (!res.ok) return;
      const data = await res.json();
      setCurrentUser(data);
    } catch (_) {}
  };

  useEffect(() => {
    fetchPost();
    fetchComments();
    fetchCurrentUser();
  }, [postId]);

  if (error) return <p>{error}</p>;
  if (!post) return <p>Загрузка...</p>;

  const handleCommentVote = async (commentId, isUpvote) => {
    try {
      const res = await fetch(`http://localhost:8000/comments/upvote/${commentId}?is_upvote=${isUpvote}`, {
        method: "POST",
        credentials: "include",
      });
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
      const res = await fetch(`http://localhost:8000/comments/delete_upvote/${commentId}`, {
        method: "POST",
        credentials: "include",
      });
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

  return (
    <div>
      <PostItem post={post} currentUser={currentUser} />

      <h3>Оставить комментарий</h3>
      <AddCommentForm postId={postId} onCommentAdded={fetchComments} />

      <h3>Комментарии</h3>
      <CommentsList
        comments={comments}
        onVote={handleCommentVote}
        onRemoveVote={handleRemoveCommentVote}
      />
    </div>
  );
}
