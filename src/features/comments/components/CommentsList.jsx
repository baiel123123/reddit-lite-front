import React from "react";
import CommentItem from "./CommentItem";

export default function CommentsList({
  comments = [],
  onVote,
  onRemoveVote,
  onDelete,
  onUpdate,
  onReply,
  currentUser,
  lastCommentRef,
  level = 0,
}) {
  return (
    <>
      {comments.map((comment, index) => {
        const isLast = index === comments.length - 1;
        return (
          <div key={comment.id} ref={isLast ? lastCommentRef : null}>
            <CommentItem
              comment={comment}
              onVote={onVote}
              onRemoveVote={onRemoveVote}
              onDelete={onDelete}
              onUpdate={onUpdate}
              onReply={onReply}
              currentUser={currentUser}
              level={level}
            />
          </div>
        );
      })}
    </>
  );
}