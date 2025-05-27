import React from "react";

export default function VoteButtons({ vote, upvotes, onUpvote, onDownvote }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
      <button
        onClick={onUpvote}
        style={{
          color: vote === true ? "green" : "black",
          fontWeight: vote === true ? "bold" : "normal",
          cursor: "pointer",
          background: "none",
          border: "none",
        }}
        aria-label="Upvote"
      >
        ▲ Upvote
      </button>
      <span>{upvotes}</span>
      <button
        onClick={onDownvote}
        style={{
          color: vote === false ? "red" : "black",
          fontWeight: vote === false ? "bold" : "normal",
          cursor: "pointer",
          background: "none",
          border: "none",
        }}
        aria-label="Downvote"
      >
        ▼ Downvote
      </button>
    </div>
  );
}
