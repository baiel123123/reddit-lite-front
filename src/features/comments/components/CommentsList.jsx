import React from "react";
import CommentItem from "./CommentItem";

function buildCommentTree(comments) {
  if (!comments || !Array.isArray(comments)) return [];

  const map = {};
  const roots = [];

  comments
    .filter(Boolean) // убираем undefined и null
    .forEach((comment) => {
      comment.replies = [];
      map[comment.id] = comment;
    });

  comments
    .filter(Boolean)
    .forEach((comment) => {
      if (comment.parent_comment_id) {
        const parent = map[comment.parent_comment_id];
        if (parent) parent.replies.push(comment);
        else roots.push(comment); // если родитель не найден
      } else {
        roots.push(comment);
      }
    });

  return roots;
}

export default function CommentsList({ comments, onVote, onRemoveVote, onDelete, currentUser, onUpdate, onReply, lastCommentRef, }) {
  const tree = buildCommentTree(comments);

  return (
    <div>
      {tree.map((comment, index) => {
        const isLast = index === tree.length - 1;

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
              replies={comment.replies}
              level={0}
            />
          </div>
        );
      })}
    </div>
  );
}
