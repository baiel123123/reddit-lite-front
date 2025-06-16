import React, { useState, useRef, useEffect } from 'react';
import styles from '../styles/CommentItem.module.css';

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
      return `${interval} ${pluralize(label, interval)} назад`;
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
  const [showActionsMenu, setShowActionsMenu] = useState(false);
  
  const actionsMenuRef = useRef(null);
  
  // Скрываем меню при клике вне его области
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (actionsMenuRef.current && !actionsMenuRef.current.contains(e.target)) {
        setShowActionsMenu(false);
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

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

  // Режим редактирования комментария
  if (isEditing) {
    return (
      <div style={{ marginLeft: level * 20, padding: '10px', background: '#fff', borderRadius: '4px' }}>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={3}
          style={{ width: '100%', border: '1px solid #ccc', borderRadius: '4px', padding: '8px' }}
        />
        <div style={{ display: 'flex', gap: '8px', marginTop: '5px' }}>
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
    <div className={styles.commentContainer}>
      <div className={styles.commentHeader}>
        <div className={styles.authorInfo}>
          <strong className={styles.authorName}>
            {comment.user?.nickname || comment.user?.username}
          </strong>
          <span className={styles.commentTime}>{timeAgo(comment.created_at)}</span>
        </div>
        <div className={styles.actionsMenuWrapper} ref={actionsMenuRef}>
          <button
            onClick={() => setShowActionsMenu(!showActionsMenu)}
            className={styles.actionsMenuButton}
          >
            ⋮
          </button>
          {showActionsMenu &&
            (currentUser?.id === comment.user_id ||
              [2, 3].includes(currentUser?.role_id)) && (
              <div className={styles.actionsDropdown}>
                <button
                  onClick={() => {
                    setIsEditing(true);
                    setShowActionsMenu(false);
                  }}
                  className={styles.dropdownButton}
                >
                  Редактировать
                </button>
                <button
                  onClick={() => {
                    onDelete(comment.id);
                    setShowActionsMenu(false);
                  }}
                  className={styles.dropdownButton}
                >
                  Удалить
                </button>
              </div>
            )}
        </div>
      </div>
      <div className={styles.commentContent}>{comment.content}</div>
      <div className={styles.actionBar}>
        <div className={styles.voteGroup}>
          <button
            onClick={handleUpvote}
            className={styles.voteButton}
            style={{
              color: comment.user_vote === true ? "#4CAF50" : "#888",
            }}
          >
            ▲
          </button>
          <span>{comment.upvote}</span>
          <button
            onClick={handleDownvote}
            className={styles.voteButton}
            style={{
              color: comment.user_vote === false ? "#f44336" : "#888",
            }}
          >
            ▼
          </button>
        </div>
        <button
          onClick={() => setIsReplying(!isReplying)}
          className={styles.replyButton}
        >
          Ответить
        </button>
      </div>

      {isReplying && (
        <div className={styles.replySection}>
          <textarea
            value={replyContent}
            onChange={(e) => setReplyContent(e.target.value)}
            rows="3"
            className={styles.replyTextarea}
            placeholder="Напишите ваш ответ..."
          ></textarea>
          <button
            onClick={handleReplySubmit}
            disabled={!replyContent.trim()}
            className={styles.submitReplyButton}
          >
            Отправить
          </button>
        </div>
      )}

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
