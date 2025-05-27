import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

export default function CommentPage() {
  const { commentId } = useParams();
  const [comment, setComment] = useState(null);

  useEffect(() => {
    fetch(`/comments/get_by_id/${commentId}`)
      .then(res => res.json())
      .then(data => setComment(data))
      .catch(console.error);
  }, [commentId]);

  if (!comment) return <div>Загрузка...</div>;

  return (
    <div>
      <h2>Комментарий #{comment.id}</h2>
      <p><strong>User #{comment.user_id || "?"}</strong></p>
      <p>{comment.content}</p>
      <p>Голоса: {comment.upvote}</p>
    </div>
  );
}
