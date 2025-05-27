import React from "react";
import CommentItem from "./CommentItem";

export default function CommentsList({ comments, onVote, onRemoveVote }) {
  if (!comments.length) return <p>Комментариев пока нет</p>;

  return (
    <div>
      {comments.map((comment) => (
        <CommentItem
          key={comment.id}
          comment={comment}
          onVote={onVote}
          onRemoveVote={onRemoveVote}
        />
      ))}
    </div>
  );
}
