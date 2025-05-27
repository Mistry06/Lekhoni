import React, { useEffect } from 'react';
import { Container, PostForm } from '../components';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

// It's a good practice to define static components or constants outside the main functional component
// to prevent re-renders on every parent render, if they don't depend on props or state.
const LoadingSpinner = () => (
    <div className="flex items-center justify-center min-h-screen bg-gray-950 text-white">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-red-600"></div>
        <p className="ml-4 text-xl font-medium font-inter">Loading user data...</p>
    </div>
);

function AddPost() {
    const navigate = useNavigate();
    const userData = useSelector((state) => state.auth.userData);
    const authStatus = useSelector((state) => state.auth.status); // Get auth status from Redux

    // Determine the author's name from userData for display purposes in AddPost.
    // This value is *not* passed to PostForm for saving; PostForm gets it from its own Redux selector.
    const displayAuthorName = userData?.name || userData?.email || "Unknown Author";

    // Redirect unauthenticated users to the login page.
    // We check authStatus for a more explicit check, as userData might be null initially
    // even if the user is logged in, until Redux fully hydrates.
    useEffect(() => {
        // If authentication status is explicitly false, navigate to login.
        // Or if authStatus is true but userData isn't loaded yet, keep showing spinner.
        if (authStatus === false) {
            console.info("AddPost: User not authenticated. Redirecting to login.");
            navigate("/login");
        }
        // If authStatus is true, but userData is still null, it means data is still loading/hydrating.
        // We'll handle the loading state with the spinner below.
    }, [authStatus, navigate]); // Depend on authStatus to react to changes

    // Display a loading state while user data is being fetched or if not authenticated.
    // We only render PostForm if authStatus is true AND userData is available.
    if (authStatus !== true || !userData) {
        return <LoadingSpinner />;
    }

    return (
        <div className="w-full min-h-screen py-10 bg-gradient-to-br from-gray-950 to-black text-white overflow-hidden">
            {/* Inline style block for custom animations and colorful line */}
            <style>
                {`
              /* src/index.css or src/App.css */

              @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=Inter:wght@300;400;600;700;800&display=swap');
              
              .font-playfair {
                  font-family: 'Playfair Display', serif;
              }
              .font-inter {
                  font-family: 'Inter', sans-serif;
              }
              
              /* Keep all your other global styles (like your custom animations @keyframes) here as well */
              .animate-fadeIn { /* ... */ }
              /* etc. */
                @keyframes fadeInUpCustom {
                    from { opacity: 0; transform: translateY(20px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .animate-fadeInUpCustom { animation: fadeInUpCustom 0.8s ease-out forwards; opacity: 0; }
                
                /* Define the colorful line and its animation */
                .colorful-line {
                    height: 4px; /* Slightly thicker for better visibility */
                    background: linear-gradient(
                        to right,
                        #FF0000, /* Red */
                        #FF7F00, /* Orange */
                        #FFFF00, /* Yellow */
                        #00FF00, /* Green */
                        #0000FF, /* Blue */
                        #4B0082, /* Indigo */
                        #9400D3  /* Violet */
                    );
                    border-radius: 5px;
                    box-shadow: 0 0 15px rgba(255, 255, 255, 0.4); /* Soft white glow */
                    animation: lineDraw 1.5s ease-out forwards;
                    opacity: 0; /* Start invisible for animation */
                    width: 100%; /* Ensure it takes full width initially for animation */
                }

                @keyframes lineDraw {
                    from {
                        width: 0%;
                        opacity: 0;
                        transform: scaleX(0);
                    }
                    to {
                        width: 100%;
                        opacity: 1;
                        transform: scaleX(1);
                    }
                }
                
                /* You had a class animate-line-fade-in-wide, but colorful-line already has lineDraw.
                   If you want a specific delay, you can add it to the colorful-line class directly
                   or keep a separate animation if it has different properties.
                   For simplicity, I'm just letting colorful-line handle the animation.
                */
                `}
            </style>
            <Container>
                <div className="mb-12 animate-fadeInUpCustom">
                    <h1 className="text-4xl md:text-5xl font-extrabold text-red-600 mb-4 tracking-wider text-left font-playfair drop-shadow-md w-full">
                        Share Your Story
                    </h1>
                    {/* Display the author's name to confirm who is posting */}
                    <p className="text-xl md:text-2xl text-gray-200 text-left font-medium font-inter w-full mb-4">
                        Hello, <span className="text-red-500 font-semibold">{displayAuthorName}</span>! Let your ideas take flight.
                    </p>
                    <p className="text-lg md:text-xl text-gray-300 text-left font-medium font-inter w-full">
                        Craft your masterpiece.
                    </p>
                </div>
                {/* Horizontal line with animated styling */}
                <hr className="colorful-line mb-10" />

                {/* The PostForm component handles the actual post creation/editing logic */}
                {/* No need to pass authorName here, PostForm handles it internally */}
                <PostForm />
            </Container>
        </div>
    );
}

export default AddPost;