// src/pages/LoginPage.jsx
import React from 'react';
import { Login } from '../components'; // Import as a default export

function LoginPage() { // Renamed the wrapper component for clarity
  return (
    // The main page container now explicitly sets the deep dark background
    // and ensures it covers at least the full height of the screen.
    <div className='w-full min-h-screen flex items-center justify-center py-8 bg-gray-950'>
      <Login /> {/* Your themed Login form component will be rendered here */}
    </div>
  );
}

export default LoginPage;