import React, { useState, useEffect } from "react";

function Upvote({ post, onVoteUpdate }) {
  const [upvotes, setUpvotes] = useState(post.upvotes ?? post.upvote ?? 0);
  const [hasVoted, setHasVoted] = useState(post.user_vote ?? null);

  useEffect(() => {
    setUpvotes(post.upvotes ?? post.upvote ?? 0);
    setHasVoted(post.user_vote ?? null);
  }, [post]);

  const vote = async (isUpvote) => {
    const res = await fetch(
      `http://localhost:8000/posts/upvote/${post.id}?is_upvote=${isUpvote}`,
      {
        method: "POST",
        credentials: "include",
      }
    );
    const data = await res.json();
    const updatedVotes = data.upvotes ?? data.upvote;
    if (updatedVotes !== undefined) {
      setUpvotes(updatedVotes);
      setHasVoted(isUpvote);
      if (onVoteUpdate) onVoteUpdate(post.id, updatedVotes, isUpvote);
    }
  };

  const removeVote = async () => {
    const res = await fetch(`http://localhost:8000/posts/delete_upvote/${post.id}`, {
      method: "POST",
      credentials: "include",
    });
    const data = await res.json();
    const updatedVotes = data.upvotes ?? data.upvote;
    if (updatedVotes !== undefined) {
      setUpvotes(updatedVotes);
      setHasVoted(null);
      if (onVoteUpdate) onVoteUpdate(post.id, updatedVotes, null);
    }
  };

  const handleUpvoteClick = (e) => {
    e.stopPropagation();
    hasVoted === true ? removeVote() : vote(true);
  };

  const handleDownvoteClick = (e) => {
    e.stopPropagation();
    hasVoted === false ? removeVote() : vote(false);
  };

  return (
    <div style={{ border: "1px solid #ccc", padding: 10, marginBottom: 10 }}>
      <h3>{post.title}</h3>
      <p>{post.content}</p>

      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
        <button
          onClick={handleUpvoteClick}
          style={{
            color: hasVoted === true ? "orange" : "black",
            fontWeight: hasVoted === true ? "bold" : "normal",
            cursor: "pointer",
          }}
          aria-label="Upvote"
        >
          ▲
        </button>
        <span>{upvotes}</span>
        <button
          onClick={handleDownvoteClick}
          style={{
            color: hasVoted === false ? "blue" : "black",
            fontWeight: hasVoted === false ? "bold" : "normal",
            cursor: "pointer",
          }}
          aria-label="Downvote"
        >
          ▼
        </button>
      </div>
    </div>
  );
}

export default Upvote;
