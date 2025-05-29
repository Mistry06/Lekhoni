// src/components/Header/LogoutBtn.jsx
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import authService from '../../appWrite/auth'; // Assuming authService is in appWrite/auth.js
import { logout } from '../../store/authSlice'; // Assuming your Redux authSlice
import { useNavigate } from 'react-router-dom';

function LogoutBtn() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [showConfirm, setShowConfirm] = useState(false); // State to control dialog visibility

    // Function to initiate the logout process (shows confirmation dialog)
    const initiateLogout = () => {
        setShowConfirm(true); // Show the confirmation dialog
    };

    // Function to handle actual logout if confirmed
    const confirmLogout = async () => {
        try {
            await authService.logout(); // Call the Appwrite logout service
            dispatch(logout()); // Dispatch the Redux logout action
            console.log("Logout successful. Redirecting to home.");
            navigate('/'); // Redirect to the homepage (root route)
        } catch (error) {
            console.error("Error during logout:", error);
            alert("Logout failed. Please try again.");
        } finally {
            setShowConfirm(false); // Hide the confirmation dialog regardless of success/failure
        }
    };

    // Function to cancel logout
    const cancelLogout = () => {
        setShowConfirm(false); // Hide the confirmation dialog
    };

    return (
        <>
            <button
                className="
                    inline-block
                    px-6 py-2
                    font-semibold
                    text-white
                    bg-red-600
                    rounded-full
                    shadow-md
                    transition-all
                    duration-300
                    hover:bg-red-700
                    hover:-translate-y-1
                    hover:shadow-lg
                    public:bg-red-800
                    public:translate-y-0
                    public:shadow-sm
                    focus:outline-none
                    focus:ring-2
                    focus:ring-red-500
                    focus:ring-opacity-75
                "
                onClick={initiateLogout} // Call initiateLogout now
            >
                Logout
            </button>

            {/* Confirmation Dialog */}
            {showConfirm && (
                <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 animate-fade-in">
                    <div className="bg-gray-800 p-8 rounded-lg shadow-xl text-center max-w-sm mx-4 transform animate-scale-in border border-gray-700">
                        <h2 className="text-xl md:text-2xl font-bold text-white mb-4">Confirm Logout</h2>
                        <p className="text-gray-300 mb-6">Are you sure you want to log out?</p>
                        <div className="flex justify-center gap-4">
                            <button
                                className="px-5 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors duration-200 font-medium"
                                onClick={confirmLogout}
                            >
                                Yes
                            </button>
                            <button
                                className="px-5 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors duration-200 font-medium"
                                onClick={cancelLogout}
                            >
                                No
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Add animations for the dialog (you might have these in App.css already) */}
            {/* These styles are embedded for completeness, but typically go in a CSS file */}
            <style>
                {`
                @keyframes fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
                .animate-fade-in {
                    animation: fadeIn 0.3s ease-out forwards;
                }

                @keyframes scaleIn {
                    from { transform: scale(0.9); opacity: 0; }
                    to { transform: scale(1); opacity: 1; }
                }
                .animate-scale-in {
                    animation: scaleIn 0.3s ease-out forwards;
                }
                `}
            </style>
        </>
    );
}

export default LogoutBtn;