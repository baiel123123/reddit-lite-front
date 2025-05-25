import React, { useState } from "react";

function Upvote({ post }) {
  const [upvotes, setUpvotes] = useState(post.upvotes);
  const [hasVoted, setHasVoted] = useState(post.user_vote); // true, false или null

  const vote = async (isUpvote) => {
    const res = await fetch(`http://localhost:8000/posts/upvote/${post.id}?is_upvote=${isUpvote}`, {
      method: "POST",
      credentials: "include",
    });
    const data = await res.json();
    if (data.upvotes !== undefined) {
      setUpvotes(data.upvotes);
      setHasVoted(isUpvote);
    }
  };

  const removeVote = async () => {
    const res = await fetch(`http://localhost:8000/posts/delete_upvote/${post.id}`, {
      method: "POST",
      credentials: "include",
    });
    const data = await res.json();
    if (data.upvotes !== undefined) {
      setUpvotes(data.upvotes);
      setHasVoted(null);
    }
  };

    const handleUpvoteClick = (e) => {
      e.stopPropagation();
      if (hasVoted === true) {
        removeVote();
      } else {
        vote(true);
      }
    };

    const handleDownvoteClick = (e) => {
      e.stopPropagation();
      if (hasVoted === false) {
        removeVote();
      } else {
        vote(false);
      }
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
