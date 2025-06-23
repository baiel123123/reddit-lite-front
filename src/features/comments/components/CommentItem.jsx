import React, { useState, useRef, useEffect } from 'react';
import { Link } from "react-router-dom";
import styles from '../styles/CommentItem.module.css';
import stylesCreatePostModal from '../../posts/styles/CreatePostModal.module.css';
import { timeAgo } from '../../../utils/timeUtils';

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

  if (isEditing) {
    return (
      <div className={stylesCreatePostModal.modalOverlay}>
        <div className={stylesCreatePostModal.modalContent}>
          <button onClick={() => { setIsEditing(false); setContent(comment.content); }} className={stylesCreatePostModal.closeButton}>X</button>
          <h2>Редактировать комментарий</h2>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={4}
            className={stylesCreatePostModal.textarea}
            placeholder="Измените ваш комментарий..."
          />
          <div style={{ display: 'flex', gap: '8px', marginTop: '10px' }}>
            <button onClick={handleEditSave} className={stylesCreatePostModal.submitButton}>Сохранить</button>
            <button
              onClick={() => {
                setIsEditing(false);
                setContent(comment.content);
              }}
              className={stylesCreatePostModal.submitButton}
              style={{ background: '#888' }}
            >
              Отмена
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.commentContainer}>
      <div className={styles.commentHeader}>
        <div className={styles.authorInfo}>
          <img
            src={`http://localhost:8000/users/avatar/${comment.user.id}`}
            alt="Аватар"
            className={styles.avatar}
          />
          <strong className={styles.authorName}>
            {comment.user ? (
              <Link to={`/profile/${comment.user.id}`} className={styles.authorName}>
                {comment.user.username}
              </Link>
            ) : (
              "Аноним"
            )}
          </strong>
          <span className={styles.commentTime}>{timeAgo(comment.created_at)}</span>
          {console.log(comment.created_at)}
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
