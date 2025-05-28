import React, { useEffect, useState, useCallback } from 'react';
import { Container } from '../components';
import { useSelector } from 'react-redux';
import appwriteService from '../appWrite/config'; // Make sure this path is correct
import PostCard from '../components/postCard.jsx';
import { Link } from 'react-router-dom';
import DOMPurify from 'dompurify';
import { Query } from 'appwrite'; // Ensure Appwrite SDK Query is imported

import '../App.css'; // Assuming this holds any global custom keyframes not defined here

function Home() {
    const [allActivePosts, setAllActivePosts] = useState([]); // Holds ALL active posts fetched
    const [featuredPostsSubset, setFeaturedPostsSubset] = useState([]); // Holds up to 5 random posts for the featured section
    const authStatus = useSelector((state) => state.auth.status);
    const [loading, setLoading] = useState(true);
    const [currentFeaturedIndex, setCurrentFeaturedIndex] = useState(0); // Index for the 'featuredPostsSubset'

    useEffect(() => {
        setLoading(true);
        if (authStatus) {
            appwriteService.getPosts([Query.equal("status", "active")])
                .then((fetchedPosts) => {
                    if (fetchedPosts) {
                        const activePosts = fetchedPosts.documents;
                        setAllActivePosts(activePosts); // Store all fetched active posts

                        // --- Debugging Log: Check all active posts for image IDs ---
                        console.log("All Active Posts (with image IDs):", activePosts.map(p => ({ title: p.title, image: p.image, $id: p.$id })));
                        // --- End Debugging Log ---

                        // --- Logic for selecting up to 5 random posts for Featured Section ---
                        // Create a shallow copy to shuffle without modifying the original fetched array
                        const shuffledPosts = [...activePosts].sort(() => 0.5 - Math.random());
                        const selectedForFeatured = shuffledPosts.slice(0, 5); // Pick up to 5 random posts
                        setFeaturedPostsSubset(selectedForFeatured);

                        // --- Debugging Log: Check featured posts for image IDs ---
                        console.log("Featured Posts Subset (with image IDs):", selectedForFeatured.map(p => ({ title: p.title, image: p.image, $id: p.$id })));
                        // --- End Debugging Log ---

                        // Reset featured index based on the new 'selectedForFeatured' array
                        if (selectedForFeatured.length > 0) {
                            setCurrentFeaturedIndex(prevIndex =>
                                Math.min(prevIndex, selectedForFeatured.length - 1)
                            );
                        } else {
                            setCurrentFeaturedIndex(0); // Reset if no posts for featured
                        }
                    }
                })
                .catch(error => {
                    console.error("Error fetching posts for authenticated user:", error);
                    setAllActivePosts([]);
                    setFeaturedPostsSubset([]); // Clear featured posts on error
                    setCurrentFeaturedIndex(0); // Reset on error
                })
                .finally(() => setLoading(false));
        } else {
            setAllActivePosts([]);
            setFeaturedPostsSubset([]); // Clear featured posts if not authenticated
            setCurrentFeaturedIndex(0); // Reset if unauthenticated
            setLoading(false);
        }
    }, [authStatus]); // Dependency array: re-run if authStatus changes

    // Navigation functions now operate ONLY on 'featuredPostsSubset'
    const goToNextFeatured = () => {
        if (featuredPostsSubset.length === 0) return;
        setCurrentFeaturedIndex((prevIndex) => (prevIndex + 1) % featuredPostsSubset.length);
    };

    const goToPreviousFeatured = () => {
        if (featuredPostsSubset.length === 0) return;
        setCurrentFeaturedIndex((prevIndex) => (prevIndex - 1 + featuredPostsSubset.length) % featuredPostsSubset.length);
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-950 text-white">
                <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-red-600"></div>
                <p className="ml-4 text-xl font-medium">Loading your cinematic experience...</p>
            </div>
        );
    }

    if (!authStatus) {
        return (
            <div className="relative w-full min-h-screen flex items-center justify-center text-white overflow-hidden bg-gradient-to-br from-gray-950 to-black">
                <style>
                    {`
                    @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=Inter:wght@300;400;600;700;800&display=swap');
                    .font-playfair {
                        font-family: 'Playfair Display', serif;
                    }
                    .font-inter {
                        font-family: 'Inter', sans-serif;
                    }

                    @keyframes fadeIn {
                        from { opacity: 0; }
                        to { opacity: 1; }
                    }
                    @keyframes fadeInUp {
                        from { opacity: 0; transform: translateY(20px); }
                        to { opacity: 1; transform: translateY(0); }
                    }
                    @keyframes slideInRight {
                        from { opacity: 0; transform: translateX(50px); }
                        to { opacity: 1; transform: translateX(0); }
                    }

                    .animate-fade-in { animation: fadeIn 1s ease-out forwards; }
                    .animate-fade-in-up { animation: fadeInUp 0.8s ease-out forwards; }
                    .animate-slide-in-right { animation: slideInRight 0.8s ease-out forwards; animation-delay: 0.2s; }

                    .drop-shadow-3xl {
                        filter: drop-shadow(0 10px 20px rgba(0, 0, 0, 0.7)) drop-shadow(0 4px 8px rgba(0, 0, 0, 0.5));
                    }
                    `}
                </style>
                <Container className="text-center py-20 px-4">
                    <div className="text-7xl sm:text-9xl md:text-8xl font-extrabold mb-6 leading-tight animate-fade-in-up tracking-tighter drop-shadow-3xl text-center font-playfair">
                    Unleash Your Creativity.
                    </div>
                    <p className="text-xl md:text-2xl text-gray-300 mb-10 max-w-2xl mx-auto font-medium animate-fade-in font-inter">
                    The blank page awaits your brilliance. Start writing, inspire others, and build a portfolio of your thoughts that resonates globally.                    </p>
                    <div className="flex flex-col sm:flex-row justify-center gap-4 animate-slide-in-right">
                        <Link
                            to="/login"
                            className="inline-block px-10 py-4 rounded-lg bg-red-700 text-white text-xl font-bold shadow-xl hover:bg-red-800 transition-all duration-300 transform hover:scale-105 tracking-wide border border-red-600"
                        >
                            Sign In
                        </Link>
                        <Link
                            to="/signup"
                            className="inline-block px-10 py-4 rounded-lg border-2 border-white text-white text-xl font-bold hover:bg-white hover:text-gray-900 shadow-xl transition-all duration-300 transform hover:scale-105 tracking-wide"
                        >
                            Join Free
                        </Link>
                    </div>
                </Container>
            </div>
        );
    }

    // Get the currently featured post from the 'featuredPostsSubset'
    const currentFeaturedPost = featuredPostsSubset.length > 0 ? featuredPostsSubset[currentFeaturedIndex] : null;

    return (
        <div className="relative w-full min-h-screen text-white overflow-hidden py-10 bg-gradient-to-br from-gray-950 to-black">
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

                /* General Fade In */
                @keyframes fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
                .animate-fade-in { animation: fadeIn 1s ease-out forwards; }

                /* Fade In Up (for titles and main blocks) */
                @keyframes fadeInUpCustom {
                    from { opacity: 0; transform: translateY(20px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .animate-fadeInUpCustom { animation: fadeInUpCustom 0.8s ease-out forwards; opacity: 0; }

                /* Card Pop In (for individual post cards) */
                @keyframes cardPopIn {
                    from { opacity: 0; transform: scale(0.95) translateY(20px); }
                    to { opacity: 1; transform: scale(1) translateY(0); }
                }
                .animate-card-pop-in { animation: cardPopIn 0.6s ease-out forwards; }

                /* Text Shadow for Main Title */
                .text-shadow-hero {
                    text-shadow: 0 0 10px rgba(255, 0, 0, 0.4), 0 0 20px rgba(255, 0, 0, 0.2);
                }

                /* Text Shadow for Featured Post Title */
                .text-shadow-featured-title {
                    text-shadow: 0 0 10px rgba(0, 0, 0, 0.8), 0 0 20px rgba(0, 0, 0, 0.5);
                }

                /* Text Shadow for Featured Post Content */
                .text-shadow-sm-dark {
                    text-shadow: 0 1px 3px rgba(0, 0, 0, 0.6);
                }

                /* Horizontal line fade in */
                @keyframes lineFadeIn {
                    from { opacity: 0; width: 0; }
                    to { opacity: 1; width: 50%; } /* Default to 50% */
                }
                @keyframes lineFadeInWide { /* For the wider line */
                    from { opacity: 0; width: 0; }
                    to { opacity: 1; width: 75%; }
                }

                .animate-line-fade-in {
                    animation: lineFadeIn 1s ease-out forwards;
                    animation-delay: 0.2s; /* Slightly delayed from main content */
                    opacity: 0; /* Start invisible */
                }
                .animate-line-fade-in-wide { /* Apply this to the wider line */
                    animation: lineFadeInWide 1s ease-out forwards;
                    animation-delay: 0.2s; /* Slightly delayed from main content */
                    opacity: 0; /* Start invisible */
                }

                /* Specific for Featured Post Image/Container size increase */
                .featured-post-container {
                    width: calc(100% + 40px); /* Make it slightly wider than the container */
                    margin-left: -20px; /* Shift left to center the increased width */
                    margin-right: -20px; /* Shift right to center the increased width */
                }
                /* Adjust for larger screens to avoid excessive overflow if needed */
                @media (min-width: 1024px) { /* lg screens */
                    .featured-post-container {
                        width: calc(100% + 80px); /* Even wider on large screens */
                        margin-left: -40px;
                        margin-right: -40px;
                    }
                }
                @media (min-width: 1280px) { /* xl screens */
                    .featured-post-container {
                        width: calc(100% + 120px); /* Max width increase */
                        margin-left: -60px;
                        margin-right: -60px;
                    }
                }

                /* New: Gradient line for Featured Post (and its animation) */
                @keyframes indianLineAnimation {
                    0% {
                        background-position: 0% 50%;
                    }
                    100% {
                        background-position: 100% 50%;
                    }
                }

                .indian-line {
                    height: 3px;
                    background: linear-gradient(
                        to right,
                        #FF9933 0%, /* Saffron */
                        #FFD700 20%, /* Gold */
                        #00FF00 40%, /* Green */
                        #00BFFF 60%, /* Deep Sky Blue */
                        #800080 80%, /* Purple */
                        #FF007F 100%, /* Rose */
                        #FF9933 120% /* Loop back to the start for seamless animation */
                    );
                    background-size: 300% 100%; /* Make the gradient wider than the element for movement */
                    animation: indianLineAnimation 8s linear infinite; /* Adjust duration for speed */
                    border-radius: 5px;
                    box-shadow: 0 0 10px rgba(255, 165, 0, 0.6), 0 0 20px rgba(128, 0, 128, 0.4);
                }


                /* NEW ANIMATIONS BELOW */

                /* Featured Post Image Slide In */
                @keyframes imageSlideIn {
                    from { transform: translateY(20px); opacity: 0; }
                    to { transform: translateY(0); opacity: 1; }
                }
                .animate-image-slide-in {
                    animation: imageSlideIn 0.8s ease-out forwards;
                }

                /* Featured Post Content (Title, Text, Button) Fade In */
                @keyframes contentFadeIn {
                    from { opacity: 0; transform: translateY(10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .animate-content-fade-in {
                    animation: contentFadeIn 0.7s ease-out forwards;
                    animation-delay: 0.3s; /* Delay after image slides in */
                    opacity: 0;
                }

                /* Navigation Button Pulse on Hover */
                @keyframes pulseHover {
                    0% { transform: scale(1); }
                    50% { transform: scale(1.08); }
                    100% { transform: scale(1); }
                }
                .group-hover\\:animate-pulse-hover:hover {
                    animation: pulseHover 0.6s ease-in-out infinite;
                }

                /* All Posts Heading & Line Slide In From Left */
                @keyframes slideInLeft {
                    from { transform: translateX(-50px); opacity: 0; }
                    to { transform: translateX(0); opacity: 1; }
                }
                .animate-slide-in-left {
                    animation: slideInLeft 0.8s ease-out forwards;
                    animation-delay: 0.2s; /* Slightly delayed from page load */
                    opacity: 0;
                }
                `}
            </style>
            <Container>
                {/* Conditionally render sections based on whether there are any posts at all */}
                {allActivePosts.length > 0 ? (
                    <>
                        {/* Featured Post Section - Uses featuredPostsSubset */}
                        {featuredPostsSubset.length > 0 && ( // Only show featured section if there are posts selected for it
                            <div className="mb-20 pt-8 animate-fadeInUpCustom">
                                <h2 className="text-4xl md:text-5xl font-extrabold text-red-600 mb-8 tracking-wider text-center font-playfair text-shadow-hero">
                                    Featured Post
                                </h2>
                                {/* Colorful gradient line for Featured Post */}
                                <div className="indian-line mb-16"></div> {/* This is where the animated line is */}

                                <div className="relative h-80 md:h-96 lg:h-[500px] rounded-xl overflow-hidden shadow-2xl group cursor-pointer border border-gray-700 transform hover:scale-[1.005] transition-transform duration-300 featured-post-container"> {/* Added featured-post-container class */}
                                    {currentFeaturedPost && (() => {
                                        const imageId = currentFeaturedPost.image;
                                        let imageUrl = '';

                                        if (imageId) {
                                            const previewUrlObject = appwriteService.getFilePreview(imageId);

                                            // --- Debugging Log: Check generated URL for Featured Post ---
                                            console.log(`Featured Post: Post ID: ${currentFeaturedPost.$id}, Image ID: ${imageId}`);
                                            console.log("Featured Post: appwriteService.getFilePreview result:", previewUrlObject);
                                            // --- End Debugging Log ---

                                            if (previewUrlObject && typeof previewUrlObject.href === 'string') {
                                                imageUrl = previewUrlObject.href;
                                            } else if (typeof previewUrlObject === 'string') {
                                                imageUrl = previewUrlObject; // This is the expected format from getFilePreview for URL
                                            }
                                        }

                                        // --- Debugging Log: Final Image URL for Featured Post ---
                                        console.log(`Featured Post: Final Image URL for ${currentFeaturedPost.title}: ${imageUrl}`);
                                        // --- End Debugging Log ---

                                        return imageUrl ? (
                                            <img
                                                src={imageUrl}
                                                alt={currentFeaturedPost.title || "Featured Post Image"}
                                                className="w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-105 animate-image-slide-in" // Added animate-image-slide-in
                                            />
                                        ) : (
                                            <div className="w-full h-full bg-gray-700 flex items-center justify-center text-gray-400 text-2xl font-semibold">
                                                No Image Available
                                            </div>
                                        );
                                    })()}
                                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-transparent opacity-90"></div>
                                    {currentFeaturedPost && (
                                        <div className="absolute bottom-0 left-0 p-8 md:p-10 w-full animate-content-fade-in"> {/* Added animate-content-fade-in */}
                                            <h3 className="text-4xl md:text-6xl font-extrabold text-white mb-3 leading-tight text-shadow-featured-title tracking-tight font-playfair">
                                                {currentFeaturedPost.title}
                                            </h3>
                                            <div
                                                className="text-lg text-gray-300 max-w-xl hidden md:block font-normal text-shadow-sm-dark"
                                                dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(currentFeaturedPost.content.substring(0, 300) + (currentFeaturedPost.content.length > 300 ? '...' : '')) }}
                                            />
                                            <Link to={`/post/${currentFeaturedPost.$id}`} className="mt-6 inline-block px-10 py-3 rounded-lg bg-red-600 text-white text-lg font-bold shadow-md hover:bg-red-700 transition-colors duration-200 transform hover:scale-105 tracking-wide">
                                                Read Now
                                            </Link>
                                        </div>
                                    )}

                                    {/* Navigation Buttons for Featured Post - Operate on featuredPostsSubset */}
                                    {featuredPostsSubset.length > 1 && (
                                        <>
                                            <button
                                                onClick={goToPreviousFeatured}
                                                className="absolute left-6 top-1/2 -translate-y-1/2 p-4 bg-red-700 text-white rounded-full shadow-xl hover:bg-red-800 transition-colors duration-300 transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-75 z-10 group-hover:animate-pulse-hover" // Added pulse-hover
                                                aria-label="Previous featured post"
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                                                </svg>
                                            </button>
                                            <button
                                                onClick={goToNextFeatured}
                                                className="absolute right-6 top-1/2 -translate-y-1/2 p-4 bg-red-700 text-white rounded-full shadow-xl hover:bg-red-800 transition-colors duration-300 transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-75 z-10 group-hover:animate-pulse-hover" // Added pulse-hover
                                                aria-label="Next featured post"
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                                                </svg>
                                            </button>
                                        </>
                                    )}

                                    {/* Current Post Indicator - Reflects position within featuredPostsSubset */}
                                    {featuredPostsSubset.length > 0 && (
                                        <div className="absolute top-6 right-6 bg-black/60 text-white text-base px-4 py-2 rounded-full font-semibold z-10">
                                            {currentFeaturedIndex + 1}/{featuredPostsSubset.length}
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* Spacer Div for gap between Featured and All Posts sections */}
                        {featuredPostsSubset.length > 0 && <div className="my-20"></div>}


                        {/* All Posts Section - Now displays ALL active posts */}
                        <div className="mb-12"> {/* Removed general fadeInUpCustom here as we'll add specific slide-in */}
                            <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-8 tracking-wider text-center font-playfair animate-slide-in-left"> {/* Added animate-slide-in-left */}
                                All Posts
                            </h2>
                            {/* Simple line for All Posts */}
                            <hr className="border-t border-gray-700 w-1/2 mx-auto mb-16 animate-line-fade-in animate-slide-in-left" style={{animationDelay: '0.4s'}} /> {/* Added animate-slide-in-left and delayed */}

                            {allActivePosts.length > 0 ? (
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                    {allActivePosts.map((post, index) => (
                                        <div
                                            key={post.$id}
                                            className="p-2 animate-card-pop-in"
                                            style={{ animationDelay: `${index * 0.08}s` }}
                                        >
                                            {/* PostCard component itself will handle its image loading and display */}
                                            <PostCard {...post} className="h-full" />
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-center text-gray-400 text-xl font-medium mt-8">
                                    No posts to display yet.
                                </p>
                            )}
                        </div>
                    </>
                ) : (
                    // "No Posts Yet!" section card (when no posts are fetched at all, or if authStatus is false initially)
                    <div className="p-10 w-full text-center animate-fade-in">
                        <div className="rounded-2xl shadow-xl p-10 max-w-xl mx-auto border bg-gray-900 border-gray-700 animate-fadeInUpCustom">
                            <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4 tracking-wide text-center font-playfair">
                                No Posts Yet!
                            </h1>
                            <p className="text-lg text-gray-300 mb-6 font-medium font-inter">
                                It looks a little empty here. Be the first to create a post!
                            </p>
                            <Link
                                to="/add-post"
                                className="inline-block px-8 py-3 rounded-full bg-green-600 text-white text-lg font-semibold shadow-lg hover:bg-green-700 transition-all duration-300 transform hover:scale-105 tracking-wide border border-green-500"
                            >
                                Create Your First Post
                            </Link>
                        </div>
                    </div>
                )}
            </Container>
        </div>
    );
}

export default Home;