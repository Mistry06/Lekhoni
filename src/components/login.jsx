import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { login as authLogin } from '../store/authSlice';
import { Button, Input, Logo } from './index'; // Assuming these are well-designed components
import { useDispatch } from 'react-redux';
import authService from '../appWrite/auth';
import { useForm } from 'react-hook-form';

// Import your CSS file (make sure animations are defined here)
import '../App.css'

function Login() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { register, handleSubmit, formState: { errors } } = useForm(); // Destructure 'errors' from useForm
    const [error, setError] = useState('');
    const [refreshPrompt, setRefreshPrompt] = useState(false); // New state for refresh prompt

    const login = async (data) => {
        setError(''); // Clear previous errors
        setRefreshPrompt(false); // Clear previous refresh prompt
        try {
            const session = await authService.login(data);
            if (session) {
                const userData = await authService.getCurrentUser();
                console.log("Login.jsx: User data fetched after session creation:", userData); // Debug log

                if (userData) {
                    dispatch(authLogin({ userData })); // Correct payload structure
                    console.log("Login.jsx: Dispatching login action with user data.");
                    navigate('/'); // Redirect on successful login after dispatch
                } else {
                    // If userData is null even after successful session, handle gracefully
                    setError("Failed to retrieve user details after login. Please try again.");
                    console.error("Login.jsx: User data was null after getCurrentUser() despite session.");
                    // Optionally, you might want to log out from Redux here if userData is null
                    dispatch(authLogin({ userData: null })); // Explicitly set userData to null in Redux
                }
            } else {
                setError("Login session not created. Please check credentials.");
            }
        } catch (err) { // Renamed 'error' to 'err' to avoid conflict with state variable
            console.error("Login.jsx: Login error:", err); // More specific error logging

            // --- FIX START ---
            // Check for the specific Appwrite error message
            if (err.message && err.message.includes("Creation of a session is prohibited when a session is public.")) {
                setError("You are already logged in or have an public session.");
                setRefreshPrompt(true); // <--- Set this to true to trigger the refresh message
            } else {
                // For other errors, display Appwrite's error message or a generic one
                setError(err.message || "An unexpected error occurred during login. Please try again.");
            }
            // --- FIX END ---
        }
    };

    return (
        // Overall page container (implicitly on bg-gray-950 background of the main App)
        <div className="flex items-center justify-center w-full min-h-screen py-10">
            {/* Login form container - now dark themed */}
            <div className="mx-auto w-full max-w-md bg-gray-900 rounded-xl p-10 shadow-2xl border border-gray-800 animate-form-entrance">
                {/* Logo Section */}
                <div className="mb-8 flex justify-center"> {/* Increased margin bottom */}
                    <Link to="/" className="inline-block w-full max-w-[140px] transition-transform duration-200 hover:scale-105"> {/* Slightly larger logo area */}
                        {/* Logo will apply its own brightness filter for visibility on dark */}
                        <Logo width="100%" className="filter brightness-[1.8]" />
                    </Link>
                </div>

                {/* Heading and Subheading */}
                <h2 className="text-center text-3xl font-extrabold leading-tight text-white mb-2"> {/* Text color changed to white */}
                    Welcome Back!
                </h2>
                <p className="mt-2 text-center text-base text-gray-300"> {/* Text color changed to light gray */}
                    Don&apos;t have an account?&nbsp;
                    <Link
                        to="/signup"
                        className="font-semibold text-red-400 transition-colors duration-200 hover:text-red-300 hover:underline" // Link color changed to theme accent red
                    >
                        Sign Up
                    </Link>
                </p>

                {/* Error Message Display */}
                {error && (
                    <div className="bg-red-900 text-red-300 border border-red-700 p-3 rounded-md mt-6 text-center font-medium animate-error-shake animate-error-fade">
                        <p>{error}</p>
                        {refreshPrompt && ( // Conditionally render the refresh message
                            <p className="mt-2 font-semibold text-red-200">
                                Please refresh the page or clear your browser cookies.
                            </p>
                        )}
                    </div>
                )}

                {/* Login Form */}
                <form onSubmit={handleSubmit(login)} className="mt-8">
                    <div className="space-y-6">
                        <Input
                            label="Email Address"
                            placeholder="Enter your email"
                            type="email"
                            // Input styling adjusted for dark theme
                            className="px-4 py-2 w-full bg-gray-800 text-white border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200 placeholder-gray-500"
                            {...register("email", {
                                required: "Email is required",
                                validate: {
                                    matchPatern: (value) =>
                                        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(value) ||
                                        "Email address must be valid",
                                },
                            })}
                        />
                        {/* Display react-hook-form validation errors */}
                        {errors.email && <p className="text-red-400 text-sm mt-1">{errors.email.message}</p>}

                        <Input
                            label="Password"
                            type="password"
                            placeholder="Enter your password"
                            // Input styling adjusted for dark theme
                            className="px-4 py-2 w-full bg-gray-800 text-white border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200 placeholder-gray-500"
                            {...register("password", {
                                required: "Password is required",
                            })}
                        />
                        {/* Display react-hook-form validation errors */}
                        {errors.password && <p className="text-red-400 text-sm mt-1">{errors.password.message}</p>}

                        <Button
                            type="submit"
                            // Button styling adjusted to theme accent red
                            className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 rounded-md transition-all duration-200 hover:scale-[1.01] shadow-lg"
                        >
                            Sign In
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default Login;