import React from "react";
import PostFeed from "../features/posts/PostFeed";
import styles from "./styles/Home.module.css";
import RecentPostsSidebar from "../components/RecentPostsSidebar";

export default function Home() {
  return (
    <div className={styles.container} style={{ display: 'flex', flexDirection: 'row', alignItems: 'flex-start' }}>
      <div className={styles.postFeedWrapper} style={{ flex: 1 }}>
        <PostFeed />
      </div>
      <RecentPostsSidebar />
    </div>
  );
}
