import React from 'react';

// The Logo component now correctly accepts 'width' and 'className' props
function Logo({ width = '100px', className = '' }) {
  const defaultImageUrl = `https://placehold.co/${parseInt(width, 10)}x30/EF4444/FFFFFF?text=Logo`; // Dynamic placeholder based on width

  return (
    <img
      src="https://th.bing.com/th/id/R.c6f0295edf64bb14e18a4f08ce84d793?rik=WRTLakFo4iwyQA&riu=http%3a%2f%2fclipart-library.com%2fimages_k%2fwriting-clipart-transparent%2fwriting-clipart-transparent-22.png&ehk=CYa%2b3qATjfJM2%2bKYWMO1gnwwLD9RLbPrtkB77vmk2PI%3d&risl=&pid=ImgRaw&r=0"
      alt="Blog Website Logo" // Important for accessibility!
      width={width} // This applies the width (e.g., '100px') passed from the Header
      className={`${className} rounded-full object-contain h-auto flex-shrink-0`} // Added object-contain and h-auto for better scaling, flex-shrink-0 to prevent shrinking
      onError={(e) => {
        // Fallback to a placeholder image if the original fails to load
        e.target.onerror = null; // Prevents infinite loop if fallback also fails
        e.target.src = defaultImageUrl;
      }}
    />
  );
}

export default Logo;
