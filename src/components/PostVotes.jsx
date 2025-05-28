// components/PostVotes.jsx
import React, { useEffect, useState } from "react";
import VoteButtons from "./VoteButtons";

export default function PostVotes({ post, onVoteUpdate }) {
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
    <VoteButtons
      vote={hasVoted}
      upvotes={upvotes}
      onUpvote={handleUpvoteClick}
      onDownvote={handleDownvoteClick}
    />
  );
}
