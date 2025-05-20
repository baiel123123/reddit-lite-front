// pages/Profile.jsx
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import UserProfile from "../components/UserProfile";

export default function UserProfilePage() {
  const { userId } = useParams();
  const [user, setUser] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch(`http://localhost:8000/users/find/?id=${userId}`, {
          credentials: "include",
        });

        if (!res.ok) throw new Error("Не удалось получить данные");

        const data = await res.json();
        if (!data.length) throw new Error("Пользователь не найден");

        setUser(data[0]);
      } catch (err) {
        setError(err.message);
      }
    };

    fetchUser();
  }, [userId]);

  if (error) return <p>{error}</p>;
  if (!user) return <p>Загрузка...</p>;

  return <UserProfile user={user} />;
}
