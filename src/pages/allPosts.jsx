import React, { useState, useEffect } from "react";
import { PostCard, Container } from '../components';
import appwriteService from '../appWrite/config';
import { useSelector } from 'react-redux';
import { Query } from 'appwrite';
import { Link } from 'react-router-dom';

function AllPosts() {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const authStatus = useSelector((state) => state.auth.status);
    const userData = useSelector((state) => state.auth.userData);

    useEffect(() => {
        const fetchUserPosts = async () => {
            setLoading(true);

            if (!authStatus || !userData?.$id) {
                setPosts([]);
                setLoading(false);
                return;
            }

            try {
                const response = await appwriteService.getPosts([
                    Query.equal("userid", userData.$id), // Filter by current user's ID
                    // *** CRUCIAL CHANGE HERE: Add Query.or to include both 'public' and 'private' statuses ***
                    Query.or([
                        Query.equal("status", "public"),
                        Query.equal("status", "private")
                    ])
                ]);

                if (response?.documents?.length > 0) {
                    setPosts(response.documents);
                } else {
                    setPosts([]);
                }
            } catch (error) {
                console.error("Error fetching user's posts in AllPosts:", error);
                setPosts([]);
            } finally {
                setLoading(false);
            }
        };

        fetchUserPosts();
    }, [authStatus, userData]);

    const userName = userData?.name || "Your";

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-950 text-white">
                <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-red-600"></div>
                <p className="ml-4 text-2xl font-medium text-gray-300 font-inter">
                    Brewing a fresh pot of creativity... Your stories are on their way!
                </p>
            </div>
        );
    }

    return (
        <div className="w-full bg-gradient-to-br from-gray-950 to-black text-white min-h-screen py-16 px-4 sm:px-6 lg:px-8 overflow-hidden">
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
                @keyframes fadeInUpSmooth {
                    from {
                        opacity: 0;
                        transform: translateY(20px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
                .animate-fadeInUpSmooth {
                    animation: fadeInUpSmooth 0.8s ease-out forwards;
                    opacity: 0;
                }
                @keyframes fadeInMain {
                    from {
                        opacity: 0;
                    }
                    to {
                        opacity: 1;
                    }
                }
                .animate-fadeInMain {
                    animation: fadeInMain 1s ease-out forwards;
                    animation-delay: 0.3s;
                    opacity: 0;
                }
                @keyframes cardPopIn {
                    from {
                        opacity: 0;
                        transform: scale(0.9) translateY(20px);
                    }
                    to {
                        opacity: 1;
                        transform: scale(1) translateY(0);
                    }
                }
                .animate-card-pop-in {
                    animation: cardPopIn 0.5s ease-out forwards;
                }
                .glow-text-red {
                    text-shadow: 0 0 8px rgba(239, 68, 68, 0.5), 0 0 15px rgba(239, 68, 68, 0.3);
                }
                .info-box-shadow {
                    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.7), 0 0 35px rgba(0, 0, 0, 0.4) inset;
                }
                .info-box-shadow:hover {
                    transform: translateY(-3px);
                    box-shadow: 0 15px 35px rgba(0, 0, 0, 0.8), 0 0 45px rgba(0, 0, 0, 0.5) inset;
                }
                .indian-line {
                    height: 3px;
                    background: linear-gradient(
                        to right,
                        #FF9933 0%,
                        #FFD700 20%,
                        #00FF00 40%,
                        #00BFFF 60%,
                        #800080 80%,
                        #FF007F 100%
                    );
                    border-radius: 5px;
                    box-shadow: 0 0 10px rgba(255, 165, 0, 0.6), 0 0 20px rgba(128, 0, 128, 0.4);
                    animation: lineDraw 1.5s ease-out forwards;
                    opacity: 0;
                    width: 100%;
                }
                @keyframes lineDraw {
                    from {
                        width: 0%;
                        opacity: 0;
                    }
                    to {
                        width: 100%;
                        opacity: 1;
                    }
                }
                `}
            </style>

            <div className="mb-16 animate-fadeInUpSmooth">
                <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-red-600 mb-4 glow-text-red tracking-tight font-playfair transform hover:scale-102 transition-transform duration-300 text-left">
                    Your Creations:
                </h1>
                <p className="text-lg sm:text-xl text-gray-300 font-light leading-relaxed px-2 text-left font-inter">
                    Welcome to your unique space, dear creator. This is where every story, poem, and thought you've poured your heart into finds its cherished home. Consider this your personal **'sangrah'** (collection) – a vibrant tapestry woven with the threads of your imagination and the depth of your experiences. Here, your unique **'awaaz'** (voice) doesn't just resonate; it flourishes, reflecting your journey as a writer.
                </p>
            </div>

            <div className="indian-line mb-16"></div>

            {!authStatus ? (
                <div className="p-4 sm:p-6 w-full text-center opacity-0 animate-fadeInMain">
                    <div className="bg-gray-800 rounded-2xl info-box-shadow p-8 sm:p-12 max-w-xl mx-auto border border-gray-700 transition-all duration-300">
                        <h1 className="text-3xl md:text-4xl font-extrabold text-white mb-6 tracking-wide font-playfair">
                            Your Stories Await!
                        </h1>
                        <p className="text-lg text-gray-400 mb-8 font-normal leading-relaxed font-inter">
                            Log in to unveil your personal collection of posts and keep your creative journey going.
                        </p>
                        <Link
                            to="/login"
                            className="inline-block px-10 py-4 rounded-full bg-red-700 text-white text-xl font-semibold shadow-lg hover:bg-red-800 transition-all duration-300 transform hover:scale-105 tracking-wide border border-red-600 font-inter"
                        >
                            Dive In!
                        </Link>
                    </div>
                </div>
            ) : (
                posts.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 opacity-0 animate-fadeInMain">
                        {posts.map((post, index) => (
                            <div
                                key={post.$id}
                                className="w-full animate-card-pop-in transition-transform duration-300 hover:scale-103 hover:shadow-2xl rounded-xl"
                                style={{ animationDelay: `${index * 0.07}s` }}
                            >
                                <PostCard {...post} />
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="p-4 sm:p-6 w-full text-center opacity-0 animate-fadeInMain">
                        <div className="bg-gray-800 rounded-2xl info-box-shadow p-8 sm:p-12 max-w-xl mx-auto border border-gray-700 transition-all duration-300 group">
                            <h1 className="text-3xl md:text-4xl font-extrabold text-white mb-4 tracking-wide font-playfair">
                                Your Canvas Awaits Its Colors!
                            </h1>
                            <p className="text-lg text-gray-400 mb-8 font-normal leading-relaxed font-inter">
                                It looks like your personal collection is just waiting to begin. Don't let your brilliant ideas stay hidden!
                                Click below to share your first story, poem, or literary gem.
                            </p>
                            <Link
                                to="/add-post"
                                className="inline-flex items-center justify-center gap-3 px-10 py-4 rounded-full bg-teal-600 text-white text-xl font-semibold shadow-lg hover:bg-teal-700 transition-all duration-300 transform hover:scale-105 tracking-wide border border-teal-500 group-hover:shadow-xl group-hover:border-teal-400 font-inter"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-7 h-7">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                                </svg>
                                Add Your First Masterpiece!
                            </Link>
                        </div>
                    </div>
                )
            )}
        </div>
    );
}

export default AllPosts;