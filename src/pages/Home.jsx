import React from "react";
import PostFeed from "../features/posts/PostFeed";
import styles from "./styles/Home.module.css";

export default function Home() {
  return (
    <div className={styles.container}>

      <div className={styles.postFeedWrapper}>
        <PostFeed />
      </div>
    </div>
  );
}
