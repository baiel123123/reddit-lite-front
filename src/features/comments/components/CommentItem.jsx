import React, { useState } from 'react';

function timeAgo(dateString) {
  const now = new Date();
  const date = new Date(dateString);
  const seconds = Math.floor((now - date) / 1000);

  const intervals = [
    { label: 'год', seconds: 31536000 },
    { label: 'месяц', seconds: 2592000 },
    { label: 'день', seconds: 86400 },
    { label: 'час', seconds: 3600 },
    { label: 'минуту', seconds: 60 },
    { label: 'секунду', seconds: 1 },
  ];

  for (let i = 0; i < intervals.length; i++) {
    const interval = Math.floor(seconds / intervals[i].seconds);
    if (interval >= 1) {
      // Правильное склонение слова
      const label = intervals[i].label;
      const pluralized = pluralize(label, interval);
      return `${interval} ${pluralized} назад`;
    }
  }
  return 'только что';
}

function pluralize(word, count) {
  const mod10 = count % 10;
  const mod100 = count % 100;
  if (mod10 === 1 && mod100 !== 11) {
    return word; // 1 год
  } else if (mod10 >= 2 && mod10 <= 4 && (mod100 < 10 || mod100 >= 20)) {
    // 2,3,4 месяца
    switch(word) {
      case 'год': return 'года';
      case 'месяц': return 'месяца';
      case 'день': return 'дня';
      case 'час': return 'часа';
      case 'минуту': return 'минуты';
      case 'секунду': return 'секунды';
      default: return word + 'а';
    }
  } else {
    // 5+ лет
    switch(word) {
      case 'год': return 'лет';
      case 'месяц': return 'месяцев';
      case 'день': return 'дней';
      case 'час': return 'часов';
      case 'минуту': return 'минут';
      case 'секунду': return 'секунд';
      default: return word + '';
    }
  }
}

export default function CommentItem({
  comment,
  onVote,
  onRemoveVote,
  onDelete,
  onUpdate,
  currentUser,
  onReply,
  replies = [],
  level = 0,
  repliesPageSize = 3,
}) {
  const [vote, setVote] = useState(comment.user_vote);
  const [upvotes, setUpvotes] = useState(comment.upvote);
  const [isEditing, setIsEditing] = useState(false);
  const [content, setContent] = useState(comment.content);
  const [isReplying, setIsReplying] = useState(false);
  const [replyContent, setReplyContent] = useState("");
  const [visibleRepliesCount, setVisibleRepliesCount] = useState(repliesPageSize);

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

  const handleReplySubmit = async () => {
    if (!replyContent.trim()) {
      alert("Комментарий не может быть пустым");
      return;
    }
    await onReply(comment.id, replyContent);
    setReplyContent("");
    setIsReplying(false);
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
        <button
          onClick={() => { setIsEditing(false); setContent(comment.content); }}
          style={{ marginLeft: 8 }}
        >
          Отмена
        </button>
      </div>
    );
  }

  
  const visibleReplies = replies.slice(0, visibleRepliesCount);

  const loadMoreReplies = () => {
    setVisibleRepliesCount((count) => count + repliesPageSize);
  };
  
  return (
      <div style={{ borderBottom: '1px solid #ccc', padding: 10, marginLeft: level * 20 }}>
      <div><strong>{comment.user?.nickname || comment.user?.username || `User #${comment.user_id}`}</strong></div>
      <div>{comment.content}</div>

      <div style={{ fontSize: '0.8em', color: '#666', marginTop: 4 }}>
        {timeAgo(comment.created_at)}{' '}
        {(comment.updated_at && comment.updated_at !== comment.created_at) && <span>(edited)</span>}
      </div>

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
        <button
          onClick={() => setIsReplying(!isReplying)}
          style={{ marginLeft: 10 }}
        >
          {isReplying ? "Отмена" : "Ответить"}
        </button>
      </div>

      {isReplying && (
        <div style={{ marginTop: 8 }}>
          <textarea
            rows={3}
            style={{ width: "100%" }}
            value={replyContent}
            onChange={(e) => setReplyContent(e.target.value)}
          />
          <button onClick={handleReplySubmit}>Отправить ответ</button>
        </div>
      )}

      {visibleReplies.length > 0 && (
        <div style={{ marginTop: 10 }}>
          {visibleReplies.map((reply) => (
            <CommentItem
              key={reply.id}
              comment={reply}
              onVote={onVote}
              onRemoveVote={onRemoveVote}
              onDelete={onDelete}
              onUpdate={onUpdate}
              onReply={onReply}
              currentUser={currentUser}
              replies={reply.replies || []}
              level={level + 1}
              repliesPageSize={repliesPageSize}
            />
          ))}
        </div>
      )}

      {visibleRepliesCount < replies.length && (
        <button onClick={loadMoreReplies} style={{ marginLeft: (level + 1) * 20 }}>
          Показать ещё ответы ({replies.length - visibleRepliesCount})
        </button>
      )}
    </div>
  );
}