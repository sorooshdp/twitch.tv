import React from 'react';
import { Link } from 'react-router-dom';

const App: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-secondary">
      <h1 className="text-4xl font-bold text-primary mb-8">Home Page</h1>
      <Link to="/auth" className="bg-primary text-white py-2 px-4 rounded">
        Go to Auth Page
      </Link>
    </div>
  );
};

export default App;