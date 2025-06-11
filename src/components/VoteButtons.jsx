import React from "react";
import styles from "./styles/votebuttons.module.css"

export default function VoteButtons({ vote, upvotes, onUpvote, onDownvote }) {
  return (
    <div className={styles.voteContainer}>
      <button
        onClick={onUpvote}
        className={`${styles.voteButton} ${vote === true ? styles.upvoted : styles.upvote}`}
        aria-label="Upvote"
      >
        ▲
      </button>
      <span>{upvotes}</span>
      <button
        onClick={onDownvote}
        className={`${styles.voteButton} ${vote === false ? styles.downvoted : styles.downvote}`}
        aria-label="Downvote"
      >
        ▼
      </button>
    </div>
  );
}
