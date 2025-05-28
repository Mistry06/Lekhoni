import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux'; // Import useSelector
import { Button, Input } from '../components';
import authService from '../appWrite/auth';
import appwriteService from '../appWrite/config'; // Needed if syncing public_profiles
import { updateUserData as updateReduxUserData, logout as logoutRedux } from '../store/authSlice';
import Account from './account';
// Import Heroicons
import { UserIcon, EnvelopeIcon, KeyIcon, ArrowLeftIcon } from '@heroicons/react/24/solid';


const Container = ({ children }) => {
    return (
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
            {children}
        </div>
    );
};

function EditProfile() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const userDataFromRedux = useSelector((state) => state.auth.userData); // Get user data from Redux

    // Initial state derived from Redux user data or empty strings
    const [newName, setNewName] = useState(userDataFromRedux?.name || '');
    const [newEmail, setNewEmail] = useState(userDataFromRedux?.email || '');

    // Password change states
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmNewPassword, setConfirmNewPassword] = useState('');

    // Message states
    const [nameUpdateMessage, setNameUpdateMessage] = useState('');
    const [emailUpdateMessage, setEmailUpdateMessage] = useState('');
    const [passwordUpdateMessage, setPasswordUpdateMessage] = useState('');

    // Loading states
    const [isUpdatingName, setIsUpdatingName] = useState(false);
    const [isUpdatingEmail, setIsUpdatingEmail] = useState(false);
    const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);
    const [isLoadingInitialData, setIsLoadingInitialData] = useState(true);

    useEffect(() => {
        // Ensure user data is loaded when component mounts
        if (!userDataFromRedux) {
            // If Redux state is empty (e.g., page refresh), try to fetch from Appwrite
            authService.getCurrentUser()
                .then(user => {
                    if (user) {
                        dispatch(updateReduxUserData(user));
                        setNewName(user.name || '');
                        setNewEmail(user.email || '');
                    } else {
                        // If no user, redirect to login
                        navigate('/login');
                    }
                })
                .catch(error => {
                    console.error("Error fetching user data for EditProfile:", error);
                    navigate('/login');
                })
                .finally(() => {
                    setIsLoadingInitialData(false);
                });
        } else {
            setIsLoadingInitialData(false);
        }
    }, [userDataFromRedux, dispatch, navigate]);


    // --- Handlers for Name Change ---
    const handleNameChange = async (e) => {
        e.preventDefault();
        setNameUpdateMessage('');
        setIsUpdatingName(true);

        if (!newName.trim()) {
            setNameUpdateMessage('Name cannot be empty.');
            setIsUpdatingName(false);
            return;
        }
        if (newName.trim() === userDataFromRedux?.name) {
            setNameUpdateMessage('Name is the same as current name.');
            setIsUpdatingName(false);
            return;
        }

        try {
            const updatedUser = await authService.updateName(newName.trim());
            if (updatedUser) {
                setNewName(updatedUser.name); // Update local state
                setNameUpdateMessage('Name updated successfully!');
                dispatch(updateReduxUserData(updatedUser)); // Update Redux state
                // Optional: If you have a public_profiles collection and need to sync name:
                // await appwriteService.updatePublicProfile(userDataFromRedux.$id, { userName: updatedUser.name });
            } else {
                setNameUpdateMessage('Failed to update name. Please try again.');
            }
        } catch (err) {
            console.error("Error updating user name:", err);
            setNameUpdateMessage(`Error: ${err.message || 'Failed to update name.'}`);
        } finally {
            setIsUpdatingName(false);
        }
    };

    // --- Handlers for Email Change ---
    const handleEmailChange = async (e) => {
        e.preventDefault();
        setEmailUpdateMessage('');
        setIsUpdatingEmail(true);

        if (!newEmail.trim()) {
            setEmailUpdateMessage('Email cannot be empty.');
            setIsUpdatingEmail(false);
            return;
        }
        if (newEmail.trim() === userDataFromRedux?.email) {
            setEmailUpdateMessage('Email is the same as current email.');
            setIsUpdatingEmail(false);
            return;
        }
        // Basic email format validation
        if (!/\S+@\S+\.\S+/.test(newEmail)) {
            setEmailUpdateMessage('Please enter a valid email address.');
            setIsUpdatingEmail(false);
            return;
        }
        if (!oldPassword.trim()) { // Using oldPassword for email verification here as well
            setEmailUpdateMessage('Your current password is required to change email.');
            setIsUpdatingEmail(false);
            return;
        }

        try {
            const updatedUser = await authService.updateEmail(newEmail.trim(), oldPassword); // Use oldPassword for email confirmation
            if (updatedUser) {
                setNewEmail(updatedUser.email);
                setOldPassword(''); // Clear password field for security
                setEmailUpdateMessage('Email updated successfully! Please note: You might need to re-verify your email address.');
                dispatch(updateReduxUserData(updatedUser));
                // Optional: If you need to send a new verification email for the new address
                // await authService.createVerification(`${window.location.origin}/verify-email`); // Adjust your verification URL
            } else {
                setEmailUpdateMessage('Failed to update email. Please try again.');
            }
        } catch (err) {
            console.error("Error updating user email:", err);
            setEmailUpdateMessage(`Error: ${err.message || 'Failed to update email.'}`);
            if (err.code === 401) { // Appwrite's "Invalid credentials" or similar
                setEmailUpdateMessage('Incorrect password for email change.');
            }
        } finally {
            setIsUpdatingEmail(false);
        }
    };

    // --- Handlers for Password Change ---
    const handlePasswordChange = async (e) => {
        e.preventDefault();
        setPasswordUpdateMessage('');
        setIsUpdatingPassword(true);

        if (!oldPassword.trim() || !newPassword.trim() || !confirmNewPassword.trim()) {
            setPasswordUpdateMessage('All password fields are required.');
            setIsUpdatingPassword(false);
            return;
        }
        if (newPassword !== confirmNewPassword) {
            setPasswordUpdateMessage('New password and confirmation do not match.');
            setIsUpdatingPassword(false);
            return;
        }
        if (newPassword === oldPassword) {
            setPasswordUpdateMessage('New password cannot be the same as old password.');
            setIsUpdatingPassword(false);
            return;
        }
        // Appwrite's default minimum password length is 8
        if (newPassword.length < 8) {
            setPasswordUpdateMessage('New password must be at least 8 characters long.');
            setIsUpdatingPassword(false);
            return;
        }

        try {
            const updatedUser = await authService.updatePassword(newPassword, oldPassword);
            if (updatedUser) {
                setPasswordUpdateMessage('Password updated successfully! For security, you will be logged out.');
                setOldPassword('');
                setNewPassword('');
                setConfirmNewPassword('');
                dispatch(logoutRedux()); // Clear Redux state
                setTimeout(() => {
                    navigate('/login'); // Redirect to login page after a short delay
                }, 2000); // 2 seconds to show message
            } else {
                setPasswordUpdateMessage('Failed to update password. Please try again.');
            }
        } catch (err) {
            console.error("Error updating user password:", err);
            setPasswordUpdateMessage(`Error: ${err.message || 'Failed to update password.'}`);
            if (err.code === 401) {
                setPasswordUpdateMessage('Incorrect old password.');
            } else if (err.code === 400 && err.message.includes('password strength')) {
                 setPasswordUpdateMessage('New password is too weak. Please use a stronger password.');
            }
        } finally {
            setIsUpdatingPassword(false);
        }
    };

    if (isLoadingInitialData) {
        return (
            <div className="min-h-screen bg-gray-950 text-white flex items-center justify-center font-inter">
                <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-red-600"></div>
                <p className="ml-4 text-xl text-gray-400">Loading profile data...</p>
            </div>
        );
    }

    if (!userDataFromRedux) {
        // This case should ideally be handled by AuthLayout, but good to have a fallback
        return (
            <div className="min-h-screen bg-gray-950 text-white flex items-center justify-center font-inter">
                <p className="text-xl text-red-500">You must be logged in to edit your profile.</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-950 to-black text-white font-inter pt-10 pb-12 sm:pt-14 sm:pb-16 lg:pt-16 lg:pb-20">
            {/* Embedded styles for custom fonts and animations (same as Account.jsx) */}
            <style>
            {`
                 @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=Inter:wght@300;400;600;700;800&display=swap');
               
                 .font-playfair {
                     font-family: 'Playfair Display', serif;
                 }
                 .font-inter {
                     font-family: 'Inter', sans-serif;
                 }
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
            `}
            </style>
            <Container>
                <div className="flex flex-col items-center bg-gray-800 p-8 rounded-2xl shadow-2xl border border-gray-700 animate-fade-in-up w-full mx-auto">
                    {/* Header */}
                    <div className="w-full flex justify-between items-center mb-6">
                        <Button
                            onClick={() => navigate("/account")}
                            className="px-4 py-2 rounded-lg bg-gray-600 text-white flex items-center gap-2 hover:bg-gray-700 transition-colors"
                        >
                            <ArrowLeftIcon className="h-5 w-5" /> Back to Account
                        </Button>
                        <h2 className="text-4xl md:text-5xl font-extrabold text-red-400 leading-tight font-playfair">
                            Edit Profile
                        </h2>
                        <div></div> {/* Placeholder to balance flex */}
                    </div>

                    {/* Change Name Section */}
                    <div className="w-full bg-gray-700 p-6 rounded-lg shadow-inner mb-8 border border-gray-600">
                        <h3 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
                            <UserIcon className="h-6 w-6 text-red-400" /> Change Your Name
                        </h3>
                        <form onSubmit={handleNameChange} className="space-y-4">
                            <Input
                                label="New Name:"
                                placeholder="Enter your new name"
                                type="text"
                                value={newName}
                                onChange={(e) => setNewName(e.target.value)}
                                className="bg-gray-600 border border-gray-500 text-white"
                            />
                            <div className="flex gap-4">
                                <Button
                                    type="submit"
                                    disabled={isUpdatingName}
                                    className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200 disabled:opacity-50"
                                >
                                    {isUpdatingName ? 'Updating...' : 'Save Name'}
                                </Button>
                            </div>
                            {nameUpdateMessage && (
                                <p className={`text-sm mt-2 ${nameUpdateMessage.includes('successfully') ? 'text-green-400' : 'text-red-400'}`}>
                                    {nameUpdateMessage}
                                </p>
                            )}
                        </form>
                    </div>

                    {/* Change Email Section */}
                    <div className="w-full bg-gray-700 p-6 rounded-lg shadow-inner mb-8 border border-gray-600">
                        <h3 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
                            <EnvelopeIcon className="h-6 w-6 text-red-400" /> Change Your Email
                        </h3>
                        <form onSubmit={handleEmailChange} className="space-y-4">
                            <Input
                                label="New Email:"
                                placeholder="Enter your new email"
                                type="email"
                                value={newEmail}
                                onChange={(e) => setNewEmail(e.target.value)}
                                className="bg-gray-600 border border-gray-500 text-white"
                            />
                            <Input
                                label="Current Password:"
                                placeholder="Enter your current password to confirm email change"
                                type="password"
                                value={oldPassword} // Reusing oldPassword state for this form
                                onChange={(e) => setOldPassword(e.target.value)}
                                className="bg-gray-600 border border-gray-500 text-white"
                            />
                            <div className="flex gap-4">
                                <Button
                                    type="submit"
                                    disabled={isUpdatingEmail}
                                    className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200 disabled:opacity-50"
                                >
                                    {isUpdatingEmail ? 'Updating...' : 'Save Email'}
                                </Button>
                            </div>
                            {emailUpdateMessage && (
                                <p className={`text-sm mt-2 ${emailUpdateMessage.includes('successfully') ? 'text-green-400' : 'text-red-400'}`}>
                                    {emailUpdateMessage}
                                </p>
                            )}
                        </form>
                    </div>

                    {/* Change Password Section */}
                    <div className="w-full bg-gray-700 p-6 rounded-lg shadow-inner mb-8 border border-gray-600">
                        <h3 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
                            <KeyIcon className="h-6 w-6 text-red-400" /> Change Your Password
                        </h3>
                        <form onSubmit={handlePasswordChange} className="space-y-4">
                            <Input
                                label="Old Password:"
                                placeholder="Enter your old password"
                                type="password"
                                value={oldPassword}
                                onChange={(e) => setOldPassword(e.target.value)}
                                className="bg-gray-600 border border-gray-500 text-white"
                            />
                            <Input
                                label="New Password:"
                                placeholder="Enter your new password"
                                type="password"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                className="bg-gray-600 border border-gray-500 text-white"
                            />
                            <Input
                                label="Confirm New Password:"
                                placeholder="Confirm your new password"
                                type="password"
                                value={confirmNewPassword}
                                onChange={(e) => setConfirmNewPassword(e.target.value)}
                                className="bg-gray-600 border border-gray-500 text-white"
                            />
                            <div className="flex gap-4">
                                <Button
                                    type="submit"
                                    disabled={isUpdatingPassword}
                                    className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200 disabled:opacity-50"
                                >
                                    {isUpdatingPassword ? 'Updating...' : 'Save Password'}
                                </Button>
                            </div>
                            {passwordUpdateMessage && (
                                <p className={`text-sm mt-2 ${passwordUpdateMessage.includes('successfully') ? 'text-green-400' : 'text-red-400'}`}>
                                    {passwordUpdateMessage}
                                </p>
                            )}
                        </form>
                        <div className="mt-4 text-center">
                            <p className="text-gray-400 text-sm">
                                If you forgot your details , you can initiate to change it . <b>Thank You</b>
                               
                            </p>
                        </div>
                    </div>
                </div>
            </Container>
        </div>
    );
}

export default EditProfile;