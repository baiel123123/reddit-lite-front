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

  if (mod10 === 1 && mod100 !== 11) return word;
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 10 || mod100 >= 20)) {
    return {
      'год': 'года',
      'месяц': 'месяца',
      'день': 'дня',
      'час': 'часа',
      'минуту': 'минуты',
      'секунду': 'секунды',
    }[word] || word;
  }
  return {
    'год': 'лет',
    'месяц': 'месяцев',
    'день': 'дней',
    'час': 'часов',
    'минуту': 'минут',
    'секунду': 'секунд',
  }[word] || word;
}

const CommentItem = ({
  comment,
  onVote,
  onRemoveVote,
  onDelete,
  onUpdate,
  onReply,
  currentUser,
  level = 0,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [content, setContent] = useState(comment.content);
  const [isReplying, setIsReplying] = useState(false);
  const [replyContent, setReplyContent] = useState('');

  const handleUpvote = () => {
    comment.user_vote === true ? onRemoveVote(comment.id) : onVote(comment.id, true);
  };

  const handleDownvote = () => {
    comment.user_vote === false ? onRemoveVote(comment.id) : onVote(comment.id, false);
  };

  const handleEditSave = async () => {
    const res = await fetch(`http://localhost:8000/comments/${comment.id}`, {
      method: 'PUT',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content }),
    });
    if (!res.ok) return;
    const updatedComment = await res.json();
    onUpdate(updatedComment);
    setIsEditing(false);
  };

  const handleReplySubmit = async () => {
    await onReply(comment.id, replyContent);
    setReplyContent('');
    setIsReplying(false);
  };

  if (isEditing) {
    return (
      <div style={{ marginLeft: level * 20 }}>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={3}
          style={{ width: '100%' }}
        />
        <div style={{ display: 'flex', gap: '8px' }}>
          <button onClick={handleEditSave}>Сохранить</button>
          <button
            onClick={() => {
              setIsEditing(false);
              setContent(comment.content);
            }}
          >
            Отмена
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        marginLeft: level * 20,
        padding: '10px 0',
        borderBottom: '1px solid #eee',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '6px' }}>
        <strong style={{ marginRight: '8px' }}>
          {comment.user?.nickname || comment.user?.username}
        </strong>
        <span style={{ color: '#666', fontSize: '0.85em' }}>
          {timeAgo(comment.created_at)}
        </span>
      </div>

      <div style={{ marginBottom: '10px' }}>{comment.content}</div>

      <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
          <button
            onClick={handleUpvote}
            style={{ color: comment.user_vote === true ? '#4CAF50' : '#666' }}
          >
            ▲
          </button>
          <span>{comment.upvote}</span>
          <button
            onClick={handleDownvote}
            style={{ color: comment.user_vote === false ? '#f44336' : '#666' }}
          >
            ▼
          </button>
        </div>

        <button onClick={() => setIsReplying(!isReplying)}>Ответить</button>

        {(currentUser?.id === comment.user_id || [2, 3].includes(currentUser?.role_id)) && (
          <>
            <button onClick={() => setIsEditing(true)}>Редактировать</button>
            <button onClick={() => onDelete(comment.id)}>Удалить</button>
          </>
        )}
      </div>

      {isReplying && (
        <div>
          <textarea
            value={replyContent}
            onChange={(e) => setReplyContent(e.target.value)}
            rows={3}
            style={{ width: '100%' }}
            placeholder="Напишите ваш ответ..."
          />
          <button onClick={handleReplySubmit} disabled={!replyContent.trim()}>
            Отправить
          </button>
        </div>
      )}

      {/* Рекурсивный рендер детей из comment.children */}
      {comment.children && comment.children.length > 0 && (
        <div style={{ marginTop: '10px' }}>
          {comment.children.map((child) => (
            <CommentItem
              key={child.id}
              comment={child}
              onVote={onVote}
              onRemoveVote={onRemoveVote}
              onDelete={onDelete}
              onUpdate={onUpdate}
              onReply={onReply}
              currentUser={currentUser}
              level={level + 1}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default CommentItem;