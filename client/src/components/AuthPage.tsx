// src/AuthPage.tsx
import React from 'react';

const AuthPage: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <h1 className="text-4xl font-bold text-blue-500 mb-8">Welcome to the Auth Page</h1>
      <div className="space-x-4">
        <a href="/login" className="bg-blue-500 text-white py-2 px-4 rounded">Login</a>
        <a href="/signup" className="bg-blue-500 text-white py-2 px-4 rounded">Sign Up</a>
      </div>
    </div>
  );
};

export default AuthPage;
