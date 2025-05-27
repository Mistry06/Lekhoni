// src/components/Loader.jsx
import React from 'react';

function Loader({ className = '' }) {
  return (
    <div className={`animate-spin rounded-full h-10 w-10 border-b-2 border-red-600 ${className}`}></div>
  );
}

export default Loader;