import React from "react";
import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import SearchBar from "./SearchBar"; // создашь позже

export default function Layout() {
  return (
    <div style={{ display: "flex", minHeight: "100vh", backgroundColor: "#1c1e1f" }}>
      {/* Sidebar */}
      <Navbar />

      {/* Main Content */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
        {/* Top Bar */}
        <div style={{ padding: "10px", backgroundColor: "#2b2d31", borderBottom: "1px solid #444" }}>
          <SearchBar />
        </div>

        {/* Routed content */}
        <div style={{ padding: "20px", color: "#d7dadc" }}>
          <Outlet />
        </div>
      </div>
    </div>
  );
}
