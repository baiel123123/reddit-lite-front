import React from "react";
import { useNavigate, Link } from "react-router-dom";
import PostVotes from "../../../components/PostVotes";
import styles from "../styles/PostFeed.module.css";
import { timeAgo } from "../../../utils/timeUtils";
import Modal from "./Modal";

export default function PostItem({ post }) {
  const navigate = useNavigate();
  const [modalImage, setModalImage] = React.useState(null);

  const closeModal = () => setModalImage(null);

  return (
    <div
      className={styles.postItem}
      onClick={(e) => {
        e.stopPropagation();
        if (!modalImage) navigate(`/post/${post.id}`);
      }}
      style={{ cursor: "pointer" }}
    >
      <div className={styles.postHeader}>
        {post.subreddit?.avatar_url && (
          <img
            src={post.subreddit.avatar_url}
            alt="subreddit avatar"
            className={styles.subredditAvatar}
          />
        )}
        <Link
          to={`/subreddit/${post.subreddit?.id}`}
          className={styles.subredditLink}
          onClick={(e) => e.stopPropagation()}
        >
          r/{post.subreddit?.name}
        </Link>
        <span className={styles.dot}>•</span>
        <span className={styles.author}>{post.user?.username || post.user?.nickname || "Unknown"}</span>
        <span className={styles.dot}>•</span>
        <span className={styles.postTime}>{timeAgo(post.created_at) || "неизвестно"}</span>
      </div>

      <div className={styles.postTitle}>{post.title}</div>
      <div className={styles.postContent}>{post.content}</div>

      {post.image_url || post.image_path ? (
        <div
          className={styles.imageWrapper}
          onClick={(e) => {
            e.stopPropagation();
            setModalImage(post.image_url || post.image_path);
          }}
        >
          <img
            src={`http://localhost:8000/${post.image_url || post.image_path}`}
            alt="Post"
            className={styles.postImage}
          />
        </div>
      ) : null}

      <div className={styles.postFooter}>
        <PostVotes post={post} />
        <div className={styles.voteContainer}>
          <div className={styles.voteCircle}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              width="30"
              height="30"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 20.25c4.97 0 9-3.694 9-8.25s-4.03-8.25-9-8.25S3 7.444 3 12c0 2.104.859 4.023 2.273 5.48.432.447.74 1.04.586 1.641a4.483 4.483 0 0 1-.923 1.785A5.969 5.969 0 0 0 6 21c1.282 0 2.47-.402 3.445-1.087.81.22 1.668.337 2.555.337Z"
              />
            </svg>
              <span className={styles.voteCount}>{post.comments_count || 0}</span>
            </div>
        </div>
      </div>

      {modalImage && (
        <Modal modalImage={modalImage} closeModal={closeModal} />
      )}
    </div>
  );
}
