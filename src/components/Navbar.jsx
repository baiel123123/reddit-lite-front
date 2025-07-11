import React, { useContext, useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

function truncateSubName(name, max = 14) {
  if (!name) return '';
  const prefix = 'r/';
  if ((prefix.length + name.length) > max) {
    const allowed = max - prefix.length - 1; // -1 for '…'
    return name.slice(0, allowed) + '…';
  }
  return name;
}

const navLinks = [
  {
    to: "/",
    label: "Главная",
    icon: (
      <svg width="20" height="20" fill="none" viewBox="0 0 20 20"><path d="M3 8.5 10 3l7 5.5V16a1 1 0 0 1-1 1h-3.5a.5.5 0 0 1-.5-.5V13a1 1 0 0 0-1-1h-1a1 1 0 0 0-1 1v3.5a.5.5 0 0 1-.5.5H4a1 1 0 0 1-1-1V8.5Z" stroke="#ff4500" strokeWidth="1.5" strokeLinejoin="round"/></svg>
    ),
    show: () => true,
  },
  {
    to: "/my-profile",
    label: "Мой профиль",
    icon: (
      <svg width="20" height="20" fill="none" viewBox="0 0 20 20"><path d="M10 10a3 3 0 1 0 0-6 3 3 0 0 0 0 6Zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4Z" fill="#b3b3b3"/></svg>
    ),
    show: ({ user }) => !!user,
  },
  {
    to: "/settings",
    label: "Настройки",
    icon: (
      <svg width="20" height="20" fill="none" viewBox="0 0 20 20"><path d="M10 13.333A3.333 3.333 0 1 0 10 6.667a3.333 3.333 0 0 0 0 6.666Zm7.5-3.333a1.08 1.08 0 0 0-.217-1.183l-1.6-1.6a1.08 1.08 0 0 1-.25-1.117l.3-1.7a1.083 1.083 0 0 0-.867-1.267l-1.7-.3a1.08 1.08 0 0 1-.867-.65l-.75-1.633a1.083 1.083 0 0 0-1.95 0l-.75 1.633a1.08 1.08 0 0 1-.867.65l-1.7.3a1.083 1.083 0 0 0-.867 1.267l.3 1.7a1.08 1.08 0 0 1-.25 1.117l-1.6 1.6a1.083 1.083 0 0 0 0 1.533l1.6 1.6c.3.3.417.75.25 1.117l-.3 1.7a1.083 1.083 0 0 0 .867 1.267l1.7.3c.367.067.667.317.867.65l.75 1.633a1.083 1.083 0 0 0 1.95 0l.75-1.633a1.08 1.08 0 0 1 .867-.65l1.7-.3a1.083 1.083 0 0 0 .867-1.267l-.3-1.7a1.08 1.08 0 0 1 .25-1.117l1.6-1.6c.15-.15.217-.367.217-.583Z" fill="#b3b3b3"/></svg>
    ),
    show: ({ user }) => !!user,
  },
  {
    to: "/subreddits",
    label: "Сообщества",
    icon: (
      <svg width="20" height="20" fill="none" viewBox="0 0 20 20"><circle cx="10" cy="10" r="8" stroke="#b3b3b3" strokeWidth="2"/><text x="10" y="15" textAnchor="middle" fontSize="10" fill="#b3b3b3">r/</text></svg>
    ),
    show: ({ user }) => !!user,
  },
  {
    to: "/admin-tools",
    label: "Admin",
    icon: (
      <svg width="20" height="20" fill="none" viewBox="0 0 20 20"><path d="M10 2v2m0 12v2m8-8h-2M4 10H2m13.657-5.657-1.414 1.414M6.343 17.657l-1.414-1.414m0-11.314 1.414 1.414M17.657 17.657l-1.414-1.414" stroke="#b3b3b3" strokeWidth="1.5" strokeLinecap="round"/></svg>
    ),
    show: ({ user }) => user && (user.role_id === 2 || user.role_id === 3),
  },
  {
    to: "/login",
    label: "Вход",
    icon: (
      <svg width="20" height="20" fill="none" viewBox="0 0 20 20"><path d="M3 10h10m-4-4 4 4-4 4" stroke="#b3b3b3" strokeWidth="1.5" strokeLinecap="round"/></svg>
    ),
    show: ({ user }) => !user,
  },
  {
    to: "/register",
    label: "Регистрация",
    icon: (
      <svg width="20" height="20" fill="none" viewBox="0 0 20 20"><path d="M10 2a8 8 0 1 1 0 16 8 8 0 0 1 0-16Zm0 4v4l2.5 2.5" stroke="#b3b3b3" strokeWidth="1.5" strokeLinecap="round"/></svg>
    ),
    show: ({ user }) => !user,
  },
];

export default function Navbar() {
  const { user } = useContext(AuthContext);
  const location = useLocation();
  const [recentSubs, setRecentSubs] = useState([]);
  const [mySubs, setMySubs] = useState([]);

  useEffect(() => {
    if (!user) return;
    const recentSubs = JSON.parse(localStorage.getItem("recentSubreddits") || "[]");
    setRecentSubs(recentSubs);
  }, [user, location.pathname]);

  useEffect(() => {
    if (!user) return;
    fetch("http://localhost:8000/subreddit/get_all_subscriptions/", { credentials: "include" })
      .then(res => res.json())
      .then(data => {
        // data — массив подписок, у каждой есть .subreddit_id и .subreddit (или аналогично)
        // Преобразуем к нужному виду
        const subs = data.map(s => ({
          id: s.subreddit_id,
          name: s.subreddit?.name || "",
          description: s.subreddit?.description || "",
        }));
        setMySubs(subs);
      })
      .catch(() => setMySubs([]));
  }, [user]);

  return (
    <nav
      style={{
        width: "220px",
        background: "#1c1c1c",
        borderRight: "1px solid #444",
        padding: "20px 0 0 0",
        display: "flex",
        flexDirection: "column",
        height: "100vh",
        position: "sticky",
        top: 0,
        boxShadow: "0 2px 16px rgba(0,0,0,0.18)",
      }}
    >
      <div style={{ padding: "0 24px 18px 24px", marginBottom: 18 }}>
        <Link
          to="/"
          style={{
            fontWeight: "bold",
            color: "#ff4500",
            fontSize: "24px",
            textDecoration: "none",
            letterSpacing: 1,
          }}
        >
          Reddit Lite
        </Link>
      </div>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 2 }}>
        {navLinks.filter(l => l.show({ user })).map(link => (
          <Link
            key={link.to}
            to={link.to}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              padding: '10px 28px',
              color: location.pathname === link.to ? '#fff' : '#e8e8e8',
              background: location.pathname === link.to ? '#232324' : 'none',
              borderRadius: 10,
              fontWeight: location.pathname === link.to ? 700 : 500,
              fontSize: 16,
              textDecoration: 'none',
              transition: 'background 0.18s, color 0.18s',
              marginBottom: 2,
            }}
          >
            {link.icon}
            {link.label}
          </Link>
        ))}
        {/* Recent Subreddits */}
        {user && recentSubs.length > 0 && (
          <div style={{ margin: '24px 0 0 0', padding: '0 24px' }}>
            <div style={{ color: '#b3b3b3', fontSize: 13, fontWeight: 600, letterSpacing: 1, marginBottom: 6 }}>RECENT SUBREDDITS</div>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              {recentSubs.slice(0, 5).map(sub => (
                <li key={sub.id} style={{ marginBottom: 6 }}>
                  <Link to={`/subreddit/${sub.id}`} 
                    style={{ display: 'flex', alignItems: 'center', gap: 10, color: '#e8e8e8', textDecoration: 'none', borderRadius: 8, padding: '6px 8px', transition: 'background 0.18s', background: location.pathname === `/subreddit/${sub.id}` ? '#232324' : 'none' }}
                    title={sub.name}
                  >
                    <div style={{ width: 28, height: 28, borderRadius: '50%', background: '#272729', color: '#ffb000', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 15, border: '2px solid #232324' }}>{sub.name[0].toUpperCase()}</div>
                    <span style={{ fontSize: 15, fontWeight: 500 }}>r/{truncateSubName(sub.name)}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}
        {/* My Subreddits */}
        {user && mySubs.length > 0 && (
          <div style={{ margin: '24px 0 0 0', padding: '0 24px' }}>
            <div style={{ color: '#b3b3b3', fontSize: 13, fontWeight: 600, letterSpacing: 1, marginBottom: 6 }}>MY SUBREDDITS</div>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              {mySubs.slice(0, 5).map(sub => (
                <li key={sub.id} style={{ marginBottom: 6 }}>
                  <Link to={`/subreddit/${sub.id}`} 
                    style={{ display: 'flex', alignItems: 'center', gap: 10, color: '#e8e8e8', textDecoration: 'none', borderRadius: 8, padding: '6px 8px', transition: 'background 0.18s', background: location.pathname === `/subreddit/${sub.id}` ? '#232324' : 'none' }}
                    title={sub.name}
                  >
                    <div style={{ width: 28, height: 28, borderRadius: '50%', background: '#272729', color: '#ffb000', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 15, border: '2px solid #232324' }}>{sub.name[0].toUpperCase()}</div>
                    <span style={{ fontSize: 15, fontWeight: 500 }}>r/{truncateSubName(sub.name)}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </nav>
  );
}
