// src/App.tsx
import React, { JSX } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import AdminPanel from './components/AdminPanel';

const PrivateRoute = ({ children }: { children: JSX.Element }) => {
  const token = localStorage.getItem('token');
  return token ? children : <Navigate to="/login" replace />;
};

const App: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/admin" element={<PrivateRoute><AdminPanel /></PrivateRoute>} />
      <Route path="*" element={<div>404 Not Found</div>} />
    </Routes>
  );
};

export default App;
