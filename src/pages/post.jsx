// src/pages/Post.jsx - SIMPLIFIED, relying on authorName being stored in the post document

import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import appwriteService from "../appWrite/config";
// No need to import authService here if authorName is stored with the post
import { Button, Container } from "../components";
import parse from "html-react-parser";
import { useSelector } from "react-redux";
import DOMPurify from 'dompurify';
import LikeButtonComponent from '../components/LikeButtonComponent';
import { EllipsisVerticalIcon, PencilSquareIcon, TrashIcon } from '@heroicons/react/24/solid';

const REFRESH_INTERVAL_MS = 30 * 1000; // 30 seconds

export default function Post() {
    const [post, setPost] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isAuthor, setIsAuthor] = useState(false);
    const [authDataReady, setAuthDataReady] = useState(false);
    const [mobileActionsOpen, setMobileActionsOpen] = useState(false);

    const { slug } = useParams();
    const navigate = useNavigate();

    const userData = useSelector((state) => state.auth.userData);
    const authStatus = useSelector((state) => state.auth.status);

    useEffect(() => {
        const currentAuthDataReady = authStatus !== undefined && (userData !== undefined);
        if (currentAuthDataReady !== authDataReady) {
            setAuthDataReady(currentAuthDataReady);
        }
    }, [userData, authStatus, authDataReady]);

    useEffect(() => {
        let refreshInterval;
        let isMounted = true;

        const fetchDataAndDetermineAuthor = async () => {
            if (!post) {
                setLoading(true);
            }

            if (!slug) {
                console.error("Post.jsx: No story identifier (slug) provided in URL. Redirecting to all stories.");
                navigate("/all-posts");
                if (isMounted) setLoading(false);
                return;
            }

            if (authDataReady) {
                try {
                    const fetchedPost = await appwriteService.getPost(slug);
                    if (isMounted) {
                        if (fetchedPost) {
                            setPost(fetchedPost);
                            const currentIsAuthor = fetchedPost && userData ? fetchedPost.userid === userData.$id : false;
                            setIsAuthor(currentIsAuthor);
                        } else {
                            console.warn(`Post.jsx: Story with identifier "${slug}" not found.`);
                            navigate("/all-posts");
                        }
                    }
                } catch (error) {
                    if (error.code === 0 && error.message === 'Aborted') {
                        console.warn("Post.jsx: Request aborted, likely due to component unmount or navigation.");
                    } else {
                        console.error("Post.jsx [fetchDataAndDetermineAuthor]: Error fetching story:", error);
                        navigate("/all-posts");
                    }
                } finally {
                    if (isMounted) {
                        setLoading(false);
                    }
                }
            } else if (!authDataReady && !post) {
                if (isMounted) setLoading(true);
            }
        };

        fetchDataAndDetermineAuthor();

        if (authDataReady) {
            refreshInterval = setInterval(fetchDataAndDetermineAuthor, REFRESH_INTERVAL_MS);
        }

        return () => {
            isMounted = false;
            if (refreshInterval) {
                clearInterval(refreshInterval);
            }
        };
    }, [slug, navigate, authDataReady, userData]);

    const deletePost = async () => {
        if (window.confirm("Are you sure you want to permanently delete this story? This action cannot be undone.")) {
            try {
                const status = await appwriteService.deletePost(post.$id);
                if (status) {
                    if (post.image) {
                        await appwriteService.deleteFile(post.image);
                    }
                    navigate("/all-posts");
                } else {
                    alert("Failed to delete story. Please try again.");
                }
            } catch (error) {
                console.error("Error deleting post:", error);
                alert("Failed to delete story. An error occurred.");
            }
        }
    };

    // --- Loading State UI ---
    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-950 text-white">
                <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-red-600"></div>
                <p className="ml-4 text-xl font-medium font-inter">Summoning your story from the archives...</p>
            </div>
        );
    }

    // --- Post Not Found / No Post Data UI ---
    if (!post) {
        return (
            <div className="w-full bg-gradient-to-br from-gray-950 to-black text-white min-h-screen py-16 flex items-center justify-center">
                <Container>
                    <div className="text-center animate-fade-in-up p-8 rounded-xl bg-gray-800 shadow-xl border border-gray-700">
                        <h2 className="text-3xl md:text-4xl font-extrabold text-red-600 mb-4 font-playfair">Story Not Found!</h2>
                        <p className="text-lg text-gray-300 mb-6 font-inter">
                            The narrative you're looking for might have been moved or doesn't exist.
                            Perhaps it's a forgotten whisper in the digital wind, waiting to be rediscovered.
                        </p>
                        <Link to="/all-posts" className="inline-block px-8 py-3 rounded-full bg-red-600 text-white text-lg font-semibold shadow-lg hover:bg-red-700 transition-all duration-300 transform hover:scale-105 font-inter">
                            Explore Other Stories
                        </Link>
                    </div>
                </Container>
            </div>
        );
    }

    // This variable will now correctly use post.authorName if it exists, otherwise fall back.
    // This assumes you've migrated old data or only creating new posts.
    const displayAuthorName = post.authorName || "An Author";

    const formatDate = (dateString) => {
        if (!dateString) return '';
        try {
            const date = new Date(dateString);
            return date.toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
            });
        } catch (e) {
            console.error("Error formatting date:", e);
            return dateString;
        }
    };

    return (
        <div className="w-full bg-gradient-to-br from-gray-950 to-black text-white min-h-screen py-16 px-4 sm:px-6 lg:px-8">
            <Container>
                {/* Global styles for animation/fonts */}
                <style>
                    {`
                    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;600;700;800&family=Playfair+Display:wght@700;900&display=swap');
                    .font-inter { font-family: 'Inter', sans-serif; }
                    .font-playfair { font-family: 'Playfair Display', serif; }
                    @keyframes fadeInUpCustom { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
                    .animate-fadeInUpCustom { animation: fadeInUpCustom 0.8s ease-out forwards; opacity: 0; }
                    .animate-fade-in { animation: fadeIn 0.8s ease-out forwards; opacity: 0; }
                    @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }

                    @keyframes subtlePulse {
                        0% { box-shadow: 0 0 10px rgba(255, 0, 0, 0.2); }
                        50% { box-shadow: 0 0 20px rgba(255, 0, 0, 0.4); }
                        100% { box-shadow: 0 0 10px rgba(255, 0, 0, 0.2); }
                    }
                    .animate-subtle-pulse {
                        animation: subtlePulse 3s infinite ease-in-out;
                    }
                    /* Subtle dividing line animation */
                    @keyframes drawLine {
                        from { width: 0%; opacity: 0; }
                        to { width: 100%; opacity: 1; }
                    }
                    .story-divider {
                        height: 2px;
                        background: linear-gradient(to right, transparent, #555, transparent);
                        margin: 1.5rem auto;
                        animation: drawLine 1s ease-out forwards;
                        opacity: 0;
                        animation-delay: 0.5s;
                    }

                    /* New animation for post content fading in more gradually */
                    @keyframes contentFadeIn {
                        from { opacity: 0; transform: translateY(10px); }
                        to { opacity: 1; transform: translateY(0); }
                    }
                    .animate-content-fade-in {
                        animation: contentFadeIn 1.2s ease-out forwards;
                        opacity: 0;
                        animation-delay: 0.7s;
                    }
                    `}
                </style>
                {/* Main content box */}
                <div className="relative bg-gray-900 rounded-3xl shadow-2xl p-6 md:p-10 lg:p-12 animate-fade-in
                        border border-transparent hover:border-red-600 transition-all duration-500
                        before:content-[''] before:absolute before:inset-0 before:rounded-3xl
                        before:p-[2px] before:-z-10 before:bg-gradient-to-br before:from-red-600 before:via-purple-600 before:to-blue-600
                        before:opacity-0 hover:before:opacity-100 before:transition-opacity before:duration-500 overflow-hidden">

                    {/* Like Button (Top-Right Corner of the main container) */}
                    <div className="absolute top-6 right-6 z-10">
                        {post && (
                            <LikeButtonComponent
                                postId={post.$id}
                                initialLikes={post.like ? JSON.parse(post.like).length : 0}
                                initialLikedByCurrentUser={
                                    userData && post.like && JSON.parse(post.like).includes(userData.$id)
                                }
                            />
                        )}
                    </div>

                    <div className="flex flex-col md:flex-row gap-8 lg:gap-12 relative">
                        {/* Featured Image Section */}
                        <div className="w-full md:w-1/2 lg:w-2/5 relative rounded-2xl overflow-hidden shadow-2xl group animate-fadeInUpCustom
                                transform transition-transform duration-500 hover:scale-[1.02] border border-gray-700">
                            {post.image ? (
                                <img
                                    src={appwriteService.getFilePreview(post.image)}
                                    alt={post.title}
                                    className="w-full h-[300px] md:h-[450px] object-cover object-center transition-transform duration-500 group-hover:scale-105"
                                />
                            ) : (
                                <div className="w-full h-[300px] md:h-[450px] bg-gray-700 flex items-center justify-center text-gray-400 text-xl font-semibold font-inter">
                                    No Image Available
                                </div>
                            )}
                            <div className="absolute inset-0 bg-black opacity-30 group-hover:opacity-10 transition-opacity duration-500"></div>
                        </div>

                        {/* Story Header & Content Section (Combined with light background) */}
                        <div className="w-full md:w-1/2 lg:w-3/5 flex flex-col animate-fade-in
                                bg-gray-800 bg-opacity-70 rounded-lg p-6">
                            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white mb-4 leading-tight drop-shadow-lg tracking-tight font-playfair">
                                {post.title}
                            </h1>

                            {/* Subtle dividing line */}
                            <hr className="story-divider" />

                            {/* Main Story Content */}
                            <div className="text-lg text-gray-300 leading-relaxed space-y-4 animate-content-fade-in mt-4">
                                <div className="prose prose-invert max-w-none font-inter">
                                    {post.content ? parse(DOMPurify.sanitize(post.content)) : <p>No content available for this story.</p>}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Author Name - Positioned right below the main content/image flexbox */}
                    <div className="w-full text-right text-lg text-gray-400 font-semibold italic animate-fade-in font-inter mt-6 pr-4">
                        — By <span className="text-red-400">{displayAuthorName}</span>
                    </div>

                    {/* Horizontal Line below author name and above buttons/dates */}
                    <hr className="story-divider my-4" />

                    {/* Dates (Left) and Buttons (Right) Section */}
                    <div className="flex flex-col sm:flex-row justify-between items-center text-lg text-gray-400 font-semibold italic animate-fade-in font-inter">
                        {/* Left side: Post Date */}
                        <div className="text-left mb-4 sm:mb-0">
                            {post.$createdAt && (
                                <>
                                    Published: <span className="text-red-400">{formatDate(post.$createdAt)}</span>
                                    {post.$updatedAt && post.$updatedAt !== post.$createdAt && (
                                        <span className="ml-4">Updated: <span className="text-red-400">{formatDate(post.$updatedAt)}</span></span>
                                    )}
                                </>
                            )}
                        </div>

                        {/* Right side: Author Action Buttons - Responsive */}
                        {isAuthor && (
                            <div className="relative flex items-center gap-4 w-full sm:w-auto justify-end">
                                {/* Desktop/Tablet Buttons */}
                                <div className="hidden sm:flex flex-row items-center gap-4">
                                    <Link to={`/edit-post/${post.$id}`}>
                                        <Button
                                            className="bg-red-700 hover:bg-red-800 text-white font-bold py-2 px-6 rounded-full shadow-lg transition-all duration-300 transform hover:-translate-y-1 hover:scale-105 tracking-wide font-inter text-base"
                                        >
                                            Refine
                                        </Button>
                                    </Link>
                                    <Button
                                        onClick={deletePost}
                                        className="bg-red-700 hover:bg-red-800 text-white font-bold py-2 px-6 rounded-full shadow-lg transition-all duration-300 transform hover:-translate-y-1 hover:scale-105 tracking-wide font-inter text-base"
                                    >
                                        Delete
                                    </Button>
                                </div>

                                {/* Mobile Actions Button (Hamburger/Ellipsis) */}
                                <div className="sm:hidden">
                                    <button
                                        onClick={() => setMobileActionsOpen(!mobileActionsOpen)}
                                        className="text-white focus:outline-none p-2 rounded-md hover:bg-gray-700 transition-colors"
                                    >
                                        <EllipsisVerticalIcon className="h-6 w-6 text-red-500" />
                                    </button>
                                </div>

                                {/* Mobile Dropdown Menu for Actions */}
                                {mobileActionsOpen && (
                                    <div className="sm:hidden absolute bottom-full right-0 mb-2 w-48 bg-gray-800 rounded-lg shadow-lg py-2 z-20 animate-fade-in-down">
                                        <Link to={`/edit-post/${post.$id}`} onClick={() => setMobileActionsOpen(false)}>
                                            <div className="flex items-center px-4 py-2 text-gray-300 hover:bg-gray-700 hover:text-white transition-colors duration-200 cursor-pointer">
                                                <PencilSquareIcon className="h-5 w-5 mr-2" /> Refine
                                            </div>
                                        </Link>
                                        <div
                                            onClick={() => {
                                                deletePost();
                                                setMobileActionsOpen(false);
                                            }}
                                            className="flex items-center px-4 py-2 text-gray-300 hover:bg-gray-700 hover:text-white transition-colors duration-200 cursor-pointer"
                                        >
                                            <TrashIcon className="h-5 w-5 mr-2" /> Delete
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </Container>
        </div>
    );
}