import React from "react";

export default function Button({
    children,
    type = "button",
    bgColor = "bg-red-600", // Default to a strong accent color for primary actions
    textColor = "text-white",
    className = "",
    ...props
}) {
    return (
        <button
            className={`
                px-6 py-3 rounded-full          
                ${bgColor} ${textColor}        /* Dynamic background and text color */
                font-bold tracking-wide       /* Bold, slightly spaced text */
                shadow-lg                  
                transform transition-all duration-300 ease-in-out /* Smooth transitions */
                hover:scale-105               /* Slight scale up on hover */
                hover:shadow-xl               
                hover:brightness-110          /* Slightly brighter on hover */
                focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 focus:ring-offset-gray-900 /* Focus ring for accessibility */
                ${className}                  /* Additional custom classes */
            `}
            type={type}
            {...props}
        >
            {children}
        </button>
    );
}