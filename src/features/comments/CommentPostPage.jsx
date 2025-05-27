import React, { useState, useEffect } from 'react';
import CommentsList from './components/CommentsList';
import { useParams } from 'react-router-dom';

export default function CommentPostPage() {
  const { postId } = useParams();
  const [comments, setComments] = useState([]);
  const [offset, setOffset] = useState(0);
  const limit = 20;

  useEffect(() => {
    setComments([]);
    setOffset(0);
    loadComments(0);
  }, [postId]);

  async function loadComments(off) {
    try {
      const res = await fetch(`/comments/comments/by_post/${postId}?offset=${off}&limit=${limit}`, {
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include', // если нужна авторизация
      });
      if (!res.ok) throw new Error('Ошибка при загрузке комментариев');
      const data = await res.json();
      setComments(prev => [...prev, ...data]);
      setOffset(off + limit);
    } catch (e) {
      console.error(e);
    }
  }

  async function onVote(commentId, isUpvote) {
    try {
      await fetch(`/comments/upvote/${commentId}?is_upvote=${isUpvote}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
      });
      setComments(comments.map(c => 
        c.id === commentId ? { ...c, user_vote: isUpvote } : c
      ));
    } catch (e) {
      console.error(e);
    }
  }

  async function onRemoveVote(commentId) {
    try {
      await fetch(`/comments/delete_upvote/${commentId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
      });
      setComments(comments.map(c => 
        c.id === commentId ? { ...c, user_vote: null } : c
      ));
    } catch (e) {
      console.error(e);
    }
  }

  return (
    <div>
      <h2>Комментарии к посту #{postId}</h2>
      <CommentsList comments={comments} onVote={onVote} onRemoveVote={onRemoveVote} />
      <button onClick={() => loadComments(offset)}>Загрузить ещё</button>
    </div>
  );
}
