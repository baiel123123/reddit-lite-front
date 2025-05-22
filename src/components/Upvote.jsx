import React, { useState } from "react";

function Upvote({ post }) {
  const [upvotes, setUpvotes] = useState(post.upvotes); // ✅ правильное имя поля
  const [hasVoted, setHasVoted] = useState(null);

  const vote = async (isUpvote) => {
    const res = await fetch(`http://localhost:8000/upvote/${post.id}?is_upvote=${isUpvote}`, {
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
    const res = await fetch(`http://localhost:8000/delete_upvote/${post.id}`, {
      method: "POST",
      credentials: "include",
    });

    const data = await res.json();
    if (data.upvotes !== undefined) {
      setUpvotes(data.upvotes);
      setHasVoted(null);
    }
  };

  return (
    <div style={{ border: "1px solid #ccc", padding: 10, marginBottom: 10 }}>
      <h3>{post.title}</h3>
      <p>{post.content}</p>

      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
        <button onClick={() => vote(true)} disabled={hasVoted === true}>▲</button>
        <span>{upvotes}</span>
        <button onClick={() => vote(false)} disabled={hasVoted === false}>▼</button>
        {hasVoted !== null && <button onClick={removeVote}>❌</button>}
      </div>
    </div>
  );
}

export default Upvote;
