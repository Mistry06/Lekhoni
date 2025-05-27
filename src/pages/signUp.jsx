// src/pages/Signup.jsx
import React from 'react';
import { Signup as SignupComponent } from '../components'; // Assuming '../components/Signup.jsx' exports 'Signup' as default

// Import the CSS file containing the animations
import '../App.css'; // Adjust path if your CSS file is elsewhere, e.g., '../animations.css'

function Signup() {
  return (
    // The main page container now explicitly sets the deep dark background
    // and ensures it covers at least the full height of the screen.
    // It also centers its content (the SignupComponent).
    <div className="w-full min-h-screen flex items-center justify-center py-10 bg-gray-950">
      {/* The SignupComponent itself will now handle its own styling (background, border, shadow, animations)
          similar to how your Login component is structured. */}
      <SignupComponent />
    </div>
  );
}

export default Signup;