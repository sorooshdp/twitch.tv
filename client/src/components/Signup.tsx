import React from 'react';
import { Link } from 'react-router-dom';

const SignupPage: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-secondary">
      <h1 className="text-4xl font-bold text-primary mb-8">Sign Up</h1>
      <form className="space-y-4">
        <input type="email" placeholder="Email" className="border py-2 px-4 rounded w-64" />
        <input type="password" placeholder="Password" className="border py-2 px-4 rounded w-64" />
        <input type="password" placeholder="Confirm Password" className="border py-2 px-4 rounded w-64" />
        <button type="submit" className="bg-primary text-white py-2 px-4 rounded w-full">Sign Up</button>
      </form>
      <p className="mt-4">
        Already have an account? <Link to="/login" className="text-primary">Login</Link>
      </p>
    </div>
  );
};

export default SignupPage;