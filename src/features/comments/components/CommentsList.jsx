import React from "react";
import CommentItem from "./CommentItem";

export default function CommentsList({ comments, onVote, onRemoveVote, onDelete, currentUser, onUpdate }) {
  return (
    <div>
      {comments.map((comment) => (
        <CommentItem
          key={comment.id}
          comment={comment}
          onVote={onVote}
          onRemoveVote={onRemoveVote}
          onDelete={onDelete}
          currentUser={currentUser}
          onUpdate={onUpdate}
        />
      ))}
    </div>
  );
}
