// hooks/useUser.js
import { useEffect, useState } from 'react';
import fetchWithRefresh from '../api.js';

export default function useUser() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    fetchWithRefresh('/users/me/', {
      credentials: 'include',
    })
      .then(res => res.ok ? res.json() : null)
      .then(data => setUser(data))
      .catch(() => setUser(null));
  }, []);

  return user;
}
