import React from "react";
import PostFeed from "../features/posts/PostFeed";

export default function Home() {
  return (
    <div style={{ padding: "20px" }}>
      <h1>Главная</h1>

      <PostFeed />
    </div>
  );
}
