import React, { useState, useEffect, useCallback } from 'react';
import { Query } from 'appwrite'; // Ensure Query is imported
import { LogoutBtn, Button, Input } from '../components';
import authService from '../appWrite/auth';
import appwriteService from '../appWrite/config'; // Make sure this path is correct
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { logout as logoutRedux } from '../store/authSlice';

// Import Heroicons
import {
    BookOpenIcon,
    HeartIcon,
    TrophyIcon,
    EnvelopeIcon,
    CalendarDaysIcon,
    UserIcon,
    ExclamationTriangleIcon
} from '@heroicons/react/24/solid';

const Container = ({ children }) => {
    return (
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
            {children}
        </div>
    );
};

function Account() {
    const [userData, setUserData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [showConfirmDeletePopup, setShowConfirmDeletePopup] = useState(false);
    const [showPasswordPromptPopup, setShowPasswordPromptPopup] = useState(false);
    const [deleteConfirmPassword, setDeleteConfirmPassword] = useState('');
    const [deleteAccountError, setDeleteAccountError] = useState('');
    const [isDeletingAccount, setIsDeletingAccount] = useState(false);

    const fetchUserStats = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        let userAuthData = null;
        let totalUserPostsCount = 0;
        let totalLikedPostsCount = 0;
        let totalLikesOnMyPosts = 0;

        try {
            userAuthData = await authService.getCurrentUser();
            if (!userAuthData) {
                setError("No user is logged in. Please log in to view your account.");
                setIsLoading(false);
                return;
            }

            // --- DEBUGGING: Log user ID ---
            console.log("Current User ID:", userAuthData.$id);

            // Fetch ALL posts owned by the user, regardless of status
            const userOwnedPostsResponse = await appwriteService.getPosts([
                Query.equal('userid', userAuthData.$id),
                Query.limit(5000) // IMPORTANT: Set a high limit to ensure you fetch all
            ]);

            // --- DEBUGGING: Log response for user-owned posts ---
            console.log("Response for user-owned posts:", userOwnedPostsResponse);

            if (userOwnedPostsResponse && userOwnedPostsResponse.documents) {
                totalUserPostsCount = userOwnedPostsResponse.total;
                console.log("Calculated totalUserPostsCount:", totalUserPostsCount); // Debugging: Check this count
                userOwnedPostsResponse.documents.forEach(post => {
                    try {
                        const likedByUsers = post.like ? JSON.parse(post.like) : [];
                        if (Array.isArray(likedByUsers)) {
                            totalLikesOnMyPosts += likedByUsers.length;
                        }
                    } catch (parseError) {
                        console.error("Error parsing 'like' string for user's own post", post.$id, parseError);
                    }
                });
            }

            // Fetch ALL posts (public and private) to check for liked posts by current user
            const allPostsResponse = await appwriteService.getPosts([
                Query.limit(5000) // IMPORTANT: Set a high limit here too for counting liked posts
            ]);

            // --- DEBUGGING: Log response for all posts ---
            console.log("Response for all posts (for liked count):", allPostsResponse);

            if (allPostsResponse && allPostsResponse.documents) {
                allPostsResponse.documents.forEach(post => {
                    try {
                        const likedByUsers = post.like ? JSON.parse(post.like) : [];
                        if (Array.isArray(likedByUsers) && likedByUsers.includes(userAuthData.$id)) {
                            totalLikedPostsCount += 1;
                        }
                    } catch (parseError) {
                        console.error("Error parsing 'like' string for general post", post.$id, parseError);
                    }
                });
            }

            setUserData({
                name: userAuthData.name,
                email: userAuthData.email,
                createdAt: userAuthData.$createdAt,
                totalPosts: totalUserPostsCount,
                totalLikedPosts: totalLikedPostsCount,
                totalLikesOnMyPosts: totalLikesOnMyPosts,
                $id: userAuthData.$id
            });

        } catch (err) {
            console.error("Failed to fetch user stats for Account page:", err);
            if (err.code === 401) {
                setError("No user is logged in. Please log in to view your account.");
            } else {
                setError("Failed to load user data. Please try again.");
            }
            setUserData(null);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchUserStats();
    }, [fetchUserStats]);

    const handleEditProfile = () => {
        navigate('/edit-profile');
    };

    const handleDeleteAccountClick = () => {
        setDeleteAccountError('');
        setShowConfirmDeletePopup(true);
    };

    const confirmDeleteAccount = () => {
        setShowConfirmDeletePopup(false);
        setShowPasswordPromptPopup(true);
    };

    const cancelDeleteAccount = () => {
        setShowConfirmDeletePopup(false);
        setShowPasswordPromptPopup(false);
        setDeleteConfirmPassword('');
        setDeleteAccountError('');
    };

    const executeDeleteAccount = async () => {
        setDeleteAccountError('');
        setIsDeletingAccount(true);

        if (!deleteConfirmPassword) {
            setDeleteAccountError('Password is required to delete your account.');
            setIsDeletingAccount(false);
            return;
        }

        try {
            await authService.updatePassword(deleteConfirmPassword, deleteConfirmPassword);
            await authService.deleteAccount();

            dispatch(logoutRedux());
            navigate('/signup');

        } catch (err) {
            console.error("Error deleting account:", err);
            if (err.message && err.message.includes("Invalid credentials.")) {
                setDeleteAccountError("Incorrect password. Please try again.");
            } else {
                setDeleteAccountError(err.message || "Failed to delete account. Please try again.");
            }
        } finally {
            setIsDeletingAccount(false);
            setDeleteConfirmPassword('');
            setShowPasswordPromptPopup(false);
        }
    };

    const {
        name: fullName,
        email,
        createdAt,
        totalPosts,
        totalLikedPosts,
        totalLikesOnMyPosts,
    } = userData || {};

    const hasStats = typeof totalPosts === 'number';
    const hasLikedPostsStats = typeof totalLikedPosts === 'number';
    const hasTotalLikesOnMyPostsStats = typeof totalLikesOnMyPosts === 'number';

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gray-950 text-white flex items-center justify-center font-inter">
                <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-red-600"></div>
                <p className="ml-4 text-xl text-gray-400">Loading user profile...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gray-950 text-white flex items-center justify-center font-inter">
                <p className="text-xl text-red-500">{error}</p>
            </div>
        );
    }

    if (!userData) {
        return (
            <div className="min-h-screen bg-gray-950 text-white flex items-center justify-center font-inter">
                <p className="text-xl text-gray-400">No user data available. Please log in.</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-950 to-black text-white font-inter py-10 sm:py-14 lg:py-16 relative flex flex-col">
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
                 .animate-fade-in-up {
                     animation: fadeInUp 0.7s ease-out forwards;
                     opacity: 0;
                     transform: translateY(20px);
                 }
                 @keyframes fadeInUp {
                     to {
                         opacity: 1;
                         transform: translateY(0);
                     }
                 }
                 .glow-text-primary {
                     text-shadow: 0 0 10px rgba(239, 68, 68, 0.8), 0 0 20px rgba(239, 68, 68, 0.6);
                 }
                 .card-shadow-hover:hover {
                     transform: translateY(-8px) scale(1.02);
                     box-shadow: 0 18px 36px rgba(0, 0, 0, 0.6);
                     border-color: #ef4444;
                 }
                 .stat-card-gradient {
                     background: linear-gradient(135deg, #2a2a2a, #1a1a1a);
                 }

                 /* Custom CSS for Delete Account Button for highest specificity */
                 .delete-account-button {
                     background-color: #4b5563 !important; /* Gray-600 */
                     color: #d1d5db !important; /* Gray-300 */
                     border: 1px solid #6b7280 !important; /* Gray-500 */
                     box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2); /* Subtle shadow */
                 }
                 .delete-account-button:hover {
                     background-color: #dc2626 !important; /* Red-600 on hover */
                     color: white !important;
                     border-color: #ef4444 !important; /* Red-500 border on hover */
                     box-shadow: 0 8px 20px rgba(220, 38, 38, 0.4) !important; /* More prominent shadow on hover */
                 }

                 /* Custom CSS for Logout Button for highest specificity */
                 .logout-button {
                     background-color: #f3f4f6 !important; /* Gray-100 */
                     color: #1f2937 !important; /* Gray-900 */
                     border: 1px solid #d1d5db !important; /* Gray-300 */
                     box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1) !important; /* Subtle shadow */
                 }
                 .logout-button:hover {
                     background-color: #e5e7eb !important; /* Gray-200 on hover */
                     color: #000000 !important; /* Black on hover for contrast */
                     border-color: #9ca3af !important; /* Gray-400 border on hover */
                     box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15) !important; /* Slightly more prominent shadow on hover */
                 }

                 /* Modal Specific Styles */
                 .modal-overlay {
                     position: fixed;
                     top: 0;
                     left: 0;
                     right: 0;
                     bottom: 0;
                     background-color: rgba(0, 0, 0, 0.8);
                     display: flex;
                     justify-content: center;
                     align-items: center;
                     z-index: 1000;
                     backdrop-filter: blur(8px);
                 }
                 .modal-content {
                     background: linear-gradient(145deg, #2a2a2a, #1a1a1a);
                     padding: 3rem;
                     border-radius: 1.5rem;
                     box-shadow: 0 15px 40px rgba(0, 0, 0, 0.6);
                     text-align: center;
                     max-width: 500px;
                     width: 90%;
                     border: 1px solid #444;
                     position: relative;
                 }
                 .modal-title {
                     font-family: 'Playfair Display', serif;
                     font-weight: 700;
                     color: #ef4444;
                     font-size: 2.5rem;
                     margin-bottom: 1.25rem;
                     text-shadow: 0 0 8px rgba(239, 68, 68, 0.5);
                 }
                 .modal-message {
                     font-family: 'Inter', sans-serif;
                     color: #d1d5db;
                     font-size: 1.2rem;
                     margin-bottom: 1.75rem;
                     line-height: 1.5;
                 }
                 .modal-input {
                     background-color: #1f2937;
                     border: 1px solid #4b5563;
                     color: #f9fafb;
                     padding: 1rem 1.25rem;
                     border-radius: 0.75rem;
                     width: 100%;
                     font-size: 1.1rem;
                     margin-bottom: 1.25rem;
                     transition: all 0.2s;
                 }
                 .modal-input:focus {
                     outline: none;
                     border-color: #ef4444;
                     box-shadow: 0 0 0 4px rgba(239, 68, 68, 0.4);
                 }
                 .modal-button {
                     padding: 0.9rem 1.8rem;
                     border-radius: 0.6rem;
                     font-weight: 700;
                     transition: all 0.2s;
                     min-width: 120px;
                     display: inline-flex;
                     align-items: center;
                     justify-content: center;
                 }
                 .modal-button-danger {
                     background-color: #dc2626;
                     color: white;
                     border: 1px solid #ef4444;
                 }
                 .modal-button-danger:hover {
                     background-color: #b91c1c;
                     box-shadow: 0 5px 15px rgba(220, 38, 38, 0.4);
                 }
                 .modal-button-secondary {
                     background-color: #4b5563;
                     color: white;
                     border: 1px solid #6b7280;
                 }
                 .modal-button-secondary:hover {
                     background-color: #374151;
                     box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
                 }
                 .modal-error {
                     color: #fca5a5;
                     font-size: 1rem;
                     margin-top: 0.75rem;
                     margin-bottom: 1.25rem;
                     font-weight: 600;
                 }
                 `}
            </style>
            <Container>
                <div className="flex flex-col items-center bg-gray-800 p-8 md:p-12 rounded-2xl shadow-2xl border border-gray-700 animate-fade-in-up w-full max-w-4xl mx-auto flex-grow">
                    <div className="w-full flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
                        <h2 className="text-6xl md:text-7xl font-extrabold text-red-500 leading-tight glow-text-primary font-playfair text-center sm:text-left">
                            {fullName || "Guest User"}
                        </h2>
                        <LogoutBtn className="
                            px-6 py-2.5 rounded-lg
                            text-base font-medium
                            shadow-sm
                            transition-all duration-300
                            logout-button
                        " />
                    </div>

                    <div className="w-full text-left mb-10 space-y-3">
                        {fullName && (
                            <p className="text-gray-300 text-2xl flex items-center gap-3">
                                <UserIcon className="h-7 w-7 text-red-300" /> <span className="font-semibold">{fullName}</span>
                            </p>
                        )}
                        {email && (
                            <p className="text-gray-300 text-xl flex items-center gap-3">
                                <EnvelopeIcon className="h-6 w-6 text-red-300" /> {email}
                            </p>
                        )}
                        {createdAt && (
                            <p className="text-gray-400 text-lg flex items-center gap-3">
                                <CalendarDaysIcon className="h-6 w-6 text-gray-500" /> Joined on: {new Date(createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                            </p>
                        )}
                    </div>

                    <hr className="border-t border-gray-700 w-full mb-8" />
                    <p className="text-2xl text-gray-300 mb-10 w-full text-center font-playfair tracking-wide">Your Dashboard & Stats</p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mb-12 w-full">
                        {hasStats && (
                            <div className="flex flex-col items-center p-7 stat-card-gradient rounded-xl shadow-xl flex-1 transition-all duration-300 card-shadow-hover border border-gray-700 min-w-[180px]">
                                <BookOpenIcon className="h-14 w-14 text-red-400 mb-4" />
                                <p className="text-6xl font-bold text-red-500 mb-2">{totalPosts}</p>
                                <p className="text-base text-gray-300 uppercase tracking-widest text-center">Your Posts</p>
                            </div>
                        )}
                        {hasLikedPostsStats && (
                            <div className="flex flex-col items-center p-7 stat-card-gradient rounded-xl shadow-xl flex-1 transition-all duration-300 card-shadow-hover border border-gray-700 min-w-[180px]">
                                <HeartIcon className="h-14 w-14 text-red-400 mb-4" />
                                <p className="text-6xl font-bold text-red-500 mb-2">{totalLikedPosts}</p>
                                <p className="text-base text-gray-300 uppercase tracking-widest text-center">Posts You Liked</p>
                            </div>
                        )}
                        {hasTotalLikesOnMyPostsStats && (
                            <div className="flex flex-col items-center p-7 stat-card-gradient rounded-xl shadow-xl flex-1 transition-all duration-300 card-shadow-hover border border-gray-700 min-w-[180px]">
                                <TrophyIcon className="h-14 w-14 text-red-400 mb-4" />
                                <p className="text-6xl font-bold text-red-500 mb-2">{totalLikesOnMyPosts}</p>
                                <p className="text-base text-gray-300 uppercase tracking-widest text-center">Total Likes on Your Posts</p>
                            </div>
                        )}
                    </div>

                    <div className="w-full flex flex-col sm:flex-row justify-center gap-6 mt-auto pt-8 border-t border-gray-700">
                        <Button
                            onClick={handleEditProfile}
                            className="
                                px-10 py-3.5 rounded-lg
                                bg-red-600 text-white text-xl font-semibold
                                shadow-lg
                                hover:bg-red-700 hover:shadow-xl
                                transition-all duration-300
                                border border-red-500
                            "
                        >
                            Edit Profile
                        </Button>
                        <Button
                            onClick={handleDeleteAccountClick}
                            className="
                                px-10 py-3.5 rounded-lg
                                text-xl font-semibold
                                transition-all duration-300
                                flex items-center justify-center gap-2
                                delete-account-button
                            "
                        >
                            <ExclamationTriangleIcon className="h-6 w-6" /> Delete Account
                        </Button>
                    </div>
                </div>

                {showConfirmDeletePopup && (
                    <div className="modal-overlay">
                        <div className="modal-content">
                            <ExclamationTriangleIcon className="h-24 w-24 text-red-500 mx-auto mb-6" />
                            <h3 className="modal-title">Confirm Account Deletion</h3>
                            <p className="modal-message">
                                Are you absolutely sure you want to delete your account? This action cannot be undone and all your data will be permanently lost.
                            </p>
                            <div className="flex justify-center gap-6 mt-8">
                                <Button
                                    onClick={cancelDeleteAccount}
                                    className="modal-button modal-button-secondary"
                                >
                                    Cancel
                                </Button>
                                <Button
                                    onClick={confirmDeleteAccount}
                                    className="modal-button modal-button-danger"
                                >
                                    Yes, Delete
                                </Button>
                            </div>
                        </div>
                    </div>
                )}

                {showPasswordPromptPopup && (
                    <div className="modal-overlay">
                        <div className="modal-content">
                            <h3 className="modal-title">Verify Password</h3>
                            <p className="modal-message">
                                For your security, please enter your password to confirm account deletion.
                            </p>
                            <Input
                                type="password"
                                placeholder="Your Password"
                                value={deleteConfirmPassword}
                                onChange={(e) => setDeleteConfirmPassword(e.target.value)}
                                className="modal-input"
                            />
                            {deleteAccountError && (
                                <p className="modal-error">{deleteAccountError}</p>
                            )}
                            <div className="flex justify-center gap-6 mt-8">
                                <Button
                                    onClick={cancelDeleteAccount}
                                    className="modal-button modal-button-secondary"
                                    disabled={isDeletingAccount}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    onClick={executeDeleteAccount}
                                    className="modal-button modal-button-danger"
                                    disabled={isDeletingAccount}
                                >
                                    {isDeletingAccount ? 'Deleting...' : 'Confirm Delete'}
                                </Button>
                            </div>
                        </div>
                    </div>
                )}

            </Container>
        </div>
    );
}

export default Account;