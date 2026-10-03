'use client';

import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [allUsers, setAllUsers] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Load active session from local storage cache
    const storedSession = localStorage.getItem('blossom_user');
    if (storedSession) {
      try {
        const parsed = JSON.parse(storedSession);
        setUser(parsed);
        
        // Fetch fresh users list if user is admin
        if (parsed.isAdmin) {
          fetch('/api/users')
            .then(res => res.json())
            .then(data => {
              if (data.success) setAllUsers(data.users);
            })
            .catch(() => {});
        }
      } catch(e) {}
    }
    setIsLoaded(true);
  }, []);

  const login = async (email, password) => {
    const normalized = (email || '').trim().toLowerCase();
    // Offline admin fallback for Anusha
    if ((normalized === 'anusha6363@gmail.com' || normalized === 'admin') && password === '@Anusha2026') {
      const mockAdmin = {
        _id: 'admin-anusha-01',
        id: 'admin-anusha-01',
        name: 'Anusha (Admin)',
        email: 'anusha6363@gmail.com',
        isAdmin: true,
        isDefaultAdmin: true,
        tier: 'Platinum'
      };
      setUser(mockAdmin);
      localStorage.setItem('blossom_user', JSON.stringify(mockAdmin));
      localStorage.setItem('blossom_token', 'local-admin-token');
      return mockAdmin;
    }

    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    const data = await res.json();
    if (!data.success) {
      throw new Error(data.error || 'Invalid credentials');
    }
    
    setUser(data.user);
    localStorage.setItem('blossom_user', JSON.stringify(data.user));
    localStorage.setItem('blossom_token', data.token);
    
    if (data.user.isAdmin) {
      fetch('/api/users')
        .then(r => r.json())
        .then(d => { if(d.success) setAllUsers(d.users); });
    }
    
    return data.user;
  };

  const register = async (name, email, password, phone) => {
    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password, phone })
    });
    const data = await res.json();
    if (!data.success) {
      throw new Error(data.error || 'Registration failed');
    }
    
    setUser(data.user);
    localStorage.setItem('blossom_user', JSON.stringify(data.user));
    localStorage.setItem('blossom_token', data.token);
    
    setAllUsers(prev => [...prev, data.user]);
    return data.user;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('blossom_user');
    localStorage.removeItem('blossom_token');
  };

  // For this phase, updateProfile is kept simple
  const updateProfile = (data) => {
    const updatedUser = { ...user, ...data };
    setUser(updatedUser);
    localStorage.setItem('blossom_user', JSON.stringify(updatedUser));
  };

  return (
    <AuthContext.Provider value={{ user, allUsers, login, register, logout, updateProfile, isAuthenticated: !!user, isLoaded }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
