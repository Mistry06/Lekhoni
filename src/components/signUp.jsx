import React, { useState } from 'react';
import authService from '../appWrite/auth.js';
import { Link, useNavigate } from 'react-router-dom';
import { login } from '../store/authSlice';
import { Button, Input, Logo } from './index.js'; // Assuming these are well-designed components
import { useDispatch } from 'react-redux';
import { useForm } from 'react-hook-form';

// Import the CSS file containing the animations
import '../App.css'; // Adjust path if your CSS file is elsewhere, e.g., '../animations.css'

function Signup() {
    const navigate = useNavigate();
    const [mainError, setMainError] = useState(""); // Renamed 'error' to 'mainError' for clarity
    const [loading, setLoading] = useState(false);
    const dispatch = useDispatch();
    const { register, handleSubmit, formState: { errors } } = useForm();

    // New states for email verification message and JWT handling
    const [emailVerificationMessage, setEmailVerificationMessage] = useState("");
    const [obtainedJwt, setObtainedJwt] = useState(null);
    const [jwtGenerationError, setJwtGenerationError] = useState(null);

    const create = async (data) => {
        setMainError(""); // Clear previous main errors
        setEmailVerificationMessage(""); // Clear previous verification messages
        setJwtGenerationError(""); // Clear previous JWT errors
        setObtainedJwt(null); // Clear previous JWT
        setLoading(true); // Set loading true on submission

        try {
            // 1. Create the user account in Appwrite
            const userData = await authService.createAccount(data);

            if (userData) {
                // 2. Get current user data to update Redux store (important if auto-login occurs)
                const currentUserData = await authService.getCurrentUser();
                if (currentUserData) {
                    dispatch(login(currentUserData)); // Update Redux store with current user data

                    // 3. Send the email verification link
                    // IMPORTANT: Ensure this URL matches what you configured in your Appwrite Console
                    // For development: 'http://localhost:3000/verify-email'
                    // For production: 'https://your-domain.com/verify-email'
                    try {
                        await authService.sendVerificationEmail('http://localhost:3000/verify-email');
                        setEmailVerificationMessage("A verification email has been sent to your inbox. Please click the link to verify your account!");
                    } catch (verificationError) {
                        console.error("Failed to send verification email:", verificationError);
                        setEmailVerificationMessage("Account created, but failed to send verification email. You can request it later from your profile.");
                    }

                    // 4. Immediately obtain a JWT for the newly created/logged-in session
                    // This JWT can be sent to your custom "own service" for authorization.
                    try {
                        const jwtResponse = await authService.createJwtForSession();
                        setObtainedJwt(jwtResponse.jwt);
                        console.log("JWT obtained after signup:", jwtResponse.jwt);
                        // --- IMPORTANT: This is where you'd typically make an API call to your custom service ---
                        // Example:
                        // await yourCustomServiceApi.post('/user-registered', {
                        //     userId: currentUserData.$id,
                        //     email: currentUserData.email,
                        //     name: currentUserData.name
                        // }, {
                        //     headers: { Authorization: `Bearer ${jwtResponse.jwt}` }
                        // });
                        // console.log("Data sent to custom service with JWT.");

                    } catch (jwtErr) {
                        console.error("Error generating JWT after signup:", jwtErr);
                        setJwtGenerationError("Account created, but an authorization token for your custom service could not be generated.");
                    }

                    // 5. Navigate the user after all immediate post-signup actions
                    // You might want to navigate to a "check your email" page or directly home
                    navigate("/"); // Navigate to home on successful login/signup completion
                } else {
                    setMainError("Account created, but could not retrieve current user data. Please try logging in.");
                }
            }
        } catch (err) {
            // Catch errors from createAccount
            setMainError(err.message || "An unexpected error occurred during signup.");
        } finally {
            setLoading(false); // Set loading false after operation completes
        }
    };

    return (
        <div className="flex items-center justify-center w-full py-10 min-h-screen bg-gradient-to-br from-gray-950 to-black">
            {/* Main form container - Dark themed, bg-gray-900 */}
            <div className="mx-auto w-full max-w-md bg-gray-900 rounded-xl p-10 shadow-2xl border border-gray-800 animate-form-entrance">
                <div className="mb-8 flex justify-center">
                    <Link to="/" className="inline-block w-full max-w-[140px] transition-transform duration-200 hover:scale-105">
                        <Logo width="100%" className="filter brightness-[1.8]" />
                    </Link>
                </div>

                <h2 className="text-center text-3xl font-extrabold leading-tight text-white mb-2">
                    Create Your Account
                </h2>
                <p className="mt-2 text-center text-base text-gray-300">
                    Already have an account?&nbsp;
                    <Link
                        to="/login"
                        className="font-semibold text-red-400 transition-colors duration-200 hover:text-red-300 hover:underline"
                    >
                        Sign In
                    </Link>
                </p>

                {/* Display messages/errors */}
                {mainError && (
                    <p className="text-red-300 text-sm mt-6 text-center font-medium bg-red-900 bg-opacity-70 p-3 rounded-md animate-error-shake animate-error-fade">
                        {mainError}
                    </p>
                )}
                {emailVerificationMessage && (
                    <p className="text-blue-300 text-sm mt-4 text-center font-medium bg-blue-900 bg-opacity-70 p-3 rounded-md">
                        {emailVerificationMessage}
                    </p>
                )}
                {jwtGenerationError && (
                    <p className="text-orange-300 text-sm mt-4 text-center font-medium bg-orange-900 bg-opacity-70 p-3 rounded-md">
                        {jwtGenerationError}
                    </p>
                )}
                {obtainedJwt && (
                    <p className="text-green-300 text-sm mt-4 text-center font-medium bg-green-900 bg-opacity-70 p-3 rounded-md break-all">
                        Authorization token generated! (DEBUG: {obtainedJwt.substring(0, 50)}...)
                    </p>
                )}


                <form onSubmit={handleSubmit(create)} className="mt-8">
                    <div className='space-y-6'>
                        <div>
                            <Input
                                label="Full Name"
                                placeholder="Enter your full name"
                                className="px-4 py-2 w-full bg-gray-800 text-white border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200 placeholder-gray-500"
                                {...register("name", {
                                    required: "Full Name is required",
                                    minLength: {
                                        value: 3,
                                        message: "Full Name must be at least 3 characters"
                                    },
                                    maxLength: {
                                        value: 50,
                                        message: "Full Name cannot exceed 50 characters"
                                    }
                                })}
                            />
                            {/* Display validation error for name */}
                            {errors.name && <p className="text-red-300 text-xs mt-1">{errors.name.message}</p>}
                        </div>

                        <div>
                            <Input
                                label="Email Address"
                                placeholder="Enter your email"
                                type="email"
                                className="px-4 py-2 w-full bg-gray-800 text-white border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200 placeholder-gray-500"
                                {...register("email", {
                                    required: "Email is required",
                                    validate: {
                                        // Stricter regex for email validation
                                        matchPatern: (value) =>
                                            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(value) ||
                                            "Email address must be a valid email format (e.g., user@example.com)",
                                    }
                                })}
                            />
                            {/* Display validation error for email */}
                            {errors.email && <p className="text-red-300 text-xs mt-1">{errors.email.message}</p>}
                        </div>

                        <div>
                            <Input
                                label="Password"
                                type="password"
                                placeholder="Enter your password"
                                className="px-4 py-2 w-full bg-gray-800 text-white border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200 placeholder-gray-500"
                                {...register("password", {
                                    required: "Password is required",
                                    minLength: {
                                        value: 8,
                                        message: "Password must be at least 8 characters long",
                                    },
                                    validate: {
                                        hasUpperCase: (value) =>
                                            /[A-Z]/.test(value) || "Password must contain at least one uppercase letter",
                                        hasLowerCase: (value) =>
                                            /[a-z]/.test(value) || "Password must contain at least one lowercase letter",
                                        hasNumber: (value) =>
                                            /[0-9]/.test(value) || "Password must contain at least one number",
                                        hasSymbol: (value) =>
                                            /[!@#$%^&*(),.?":{}|<>]/.test(value) || "Password must contain at least one symbol",
                                    },
                                })}
                            />
                            {/* Display validation error for password */}
                            {errors.password && <p className="text-red-300 text-xs mt-1">{errors.password.message}</p>}
                        </div>

                        <Button
                            type="submit"
                            className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 rounded-md transition-all duration-200 hover:scale-[1.01] shadow-lg"
                            disabled={loading} // Disable button when loading
                        >
                            {loading ? "Creating Account..." : "Create Account"}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default Signup;