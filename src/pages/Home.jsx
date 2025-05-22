import React from "react";
import PostFeed from "./PostFeed";
// import CommunityList from "./CommunityList";

export default function Home() {
  return (
    <div style={{ padding: "20px" }}>
      <h1>Главная</h1>

      {/* Лента постов */}
      <PostFeed />

      {/* Список сообществ — позже */}
      {/* <CommunityList /> */}
    </div>
  );
}
