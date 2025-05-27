// src/components/LikeButtonComponent.jsx (or wherever you placed it)
import React from 'react';
import useLikeFunctionality from './like'; // <--- IMPORTANT: Correct path to your 'like.jsx' file

function LikeButtonComponent({ postId, initialLikes = 0, initialLikedByCurrentUser = false }) {
    // Correctly call the hook INSIDE the functional component
    const { likes, isLiked, isLoading, error, toggleLike } = useLikeFunctionality(
        initialLikes,
        initialLikedByCurrentUser,
        postId
    );

    return (
        <div className="flex items-center space-x-2 font-inter">
            {/* ... rest of your JSX for the button ... */}
            <style>
                {`
                @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;600;700;800&display=swap');
                .font-inter {
                    font-family: 'Inter', sans-serif;
                }
                `}
            </style>
            <button
                onClick={toggleLike}
                disabled={isLoading}
                className={`
                    flex items-center justify-center p-2 rounded-full
                    transition-all duration-300 ease-in-out
                    ${isLiked
                        ? 'bg-red-600 text-white shadow-md hover:bg-red-700 transform scale-105'
                        : 'bg-gray-700 text-gray-300 hover:bg-gray-600 hover:text-white'
                    }
                    ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}
                `}
                title={isLiked ? "Unlike" : "Like"}
            >
                {isLoading ? (
                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                ) : (
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                    >
                        <path
                            fillRule="evenodd"
                            d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
                            clipRule="evenodd"
                        />
                    </svg>
                )}
            </button>
            <span className="text-lg font-semibold text-gray-300">
                {likes}
            </span>
            {error && <p className="text-sm text-red-500 ml-2">{error}</p>}
        </div>
    );
}

export default LikeButtonComponent; // <--- IMPORTANT: Export the component