import React, { useState } from "react";

export default function CommentItem({ comment, onVote, onRemoveVote }) {
  const [vote, setVote] = useState(comment.user_vote);
  const [upvotes, setUpvotes] = useState(comment.upvote);

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

  return (
    <div style={{ borderBottom: "1px solid #ccc", padding: 10 }}>
      <div>
        <strong>User #{comment.user_id || "?"}</strong>
      </div>
      <div>{comment.content}</div>
      <div>
        <button style={{ color: vote === true ? "green" : "black" }} onClick={handleUpvote}>
          ▲ Upvote
        </button>
        <button style={{ color: vote === false ? "red" : "black" }} onClick={handleDownvote}>
          ▼ Downvote
        </button>
        <span style={{ marginLeft: 10 }}>Votes: {upvotes}</span>
      </div>
    </div>
  );
}
