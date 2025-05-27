import React from 'react';

function Container({ children, className = '' }) {
  return (
    <div className={`
        w-full              /* Ensures it takes full width up to its max */
        max-w-screen-xl     /* ⭐ Made the container slightly wider: 1280px (default for Tailwind's 'xl' breakpoint) ⭐ */
        mx-auto             /* Centers the container horizontally */
        px-4                /* Default horizontal padding for small screens */
        sm:px-6             /* Increased padding for small to medium screens */
        lg:px-8             /* Further increased padding for large screens */
        py-4                /* Consistent vertical padding for overall content spacing */
        ${className}        /* Allows for additional custom styles */
    `}>
      {children}
    </div>
  );
}

export default Container;