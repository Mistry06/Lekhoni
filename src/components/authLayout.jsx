import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'

function Protected({ children, authentication = true }) {
    const navigate = useNavigate();
    const [loader, setLoader] = useState(true); // State to control the loading indicator
    const authStatus = useSelector(state => state.auth.status); // Get auth status from Redux

    useEffect(() => {
        // console.log("Auth status in Protected:", authStatus);
        // console.log("Authentication required:", authentication);

        // Logic for redirection
        if (authentication && authStatus !== authentication) {
            // User needs to be authenticated but isn't
            // console.log("Redirecting to login: authentication required, but user not logged in");
            navigate("/login");
        } else if (!authentication && authStatus !== authentication) {
            // User should NOT be authenticated but IS (e.g., trying to access Login/Signup when already logged in)
            // console.log("Redirecting to home: authentication not required, but user IS logged in");
            navigate("/");
        }
        setLoader(false); // Authentication check complete, hide loader
    }, [authStatus, navigate, authentication]); // Dependencies for useEffect

    // --- Themed Loading UI ---
    // This will display while the authentication check is in progress
    if (loader) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-gray-950 to-black text-white p-4">
                <div className="animate-spin rounded-full h-20 w-20 border-t-4 border-b-4 border-red-600 mb-6"></div>
                <p className="text-2xl sm:text-3xl font-medium text-red-600 mb-3 animate-fade-in-up">
                    Authenticating your journey...
                </p>
                <p className="text-lg text-gray-400 font-light animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
                    Please wait a moment.
                </p>
            </div>
        );
    }

    // Render children if authentication status is as expected
    return (
        <>
            {children}
        </>
    );
}

export default Protected;