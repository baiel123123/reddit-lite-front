import React, { useState } from 'react';

export default function CommentItem({ comment, onVote, onRemoveVote, onDelete, onUpdate, currentUser }) {
  const [vote, setVote] = useState(comment.user_vote);
  const [upvotes, setUpvotes] = useState(comment.upvote);
  const [isEditing, setIsEditing] = useState(false);
  const [content, setContent] = useState(comment.content);

  const handleUpvote = () => {
    if (vote === true) {
      onRemoveVote(comment.id);
      setVote(null);
      setUpvotes(upvotes - 1);
    } else {
      onVote(comment.id, true);
      setVote(true);
      setUpvotes(vote === false ? upvotes + 2 : upvotes + 1);
    }
  };

  const handleDownvote = () => {
    if (vote === false) {
      onRemoveVote(comment.id);
      setVote(null);
      setUpvotes(upvotes + 1);
    } else {
      onVote(comment.id, false);
      setVote(false);
      setUpvotes(vote === true ? upvotes - 2 : upvotes - 1);
    }
  };

  const handleDelete = () => {
    if (window.confirm("Удалить комментарий?")) {
      onDelete(comment.id);
    }
  };

  const handleSave = async () => {
    if (!content.trim()) {
      alert("Комментарий не может быть пустым");
      return;
    }
    try {
      const res = await fetch(`http://localhost:8000/comments/${comment.id}`, {
        method: "PUT",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content }),
      });
      if (!res.ok) throw new Error("Ошибка при обновлении комментария");
      const updatedComment = await res.json();
      onUpdate(updatedComment);
      setIsEditing(false);
    } catch (err) {
      alert(err.message);
    }
  };

  if (isEditing) {
    return (
      <div style={{ borderBottom: '1px solid #ccc', padding: 10 }}>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={3}
          style={{ width: "100%" }}
        />
        <button onClick={handleSave}>Сохранить</button>
        <button onClick={() => { setIsEditing(false); setContent(comment.content); }} style={{ marginLeft: 8 }}>
          Отмена
        </button>
      </div>
    );
  }

  return (
    <div style={{ borderBottom: '1px solid #ccc', padding: 10 }}>
      <div><strong>User #{comment.user_id || "?"}</strong></div>
      <div>{comment.content}</div>
      <div>
        <button
          style={{ color: vote === true ? 'green' : 'black' }}
          onClick={handleUpvote}
        >
          ▲ Upvote
        </button>
        <button
          style={{ color: vote === false ? 'red' : 'black' }}
          onClick={handleDownvote}
        >
          ▼ Downvote
        </button>
        <span style={{ marginLeft: 10 }}>Votes: {upvotes}</span>
        {(String(currentUser?.id) === String(comment.user_id) || [2, 3].includes(currentUser?.role_id)) && (
          <>
            <button
              onClick={() => setIsEditing(true)}
              style={{ marginLeft: 10 }}
            >
              Редактировать
            </button>
            <button
              onClick={handleDelete}
              style={{ marginLeft: 10, color: "red" }}
            >
              Удалить
            </button>
          </>
        )}
      </div>
    </div>
  );
}
