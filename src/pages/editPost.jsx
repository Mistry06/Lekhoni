import React, { useState, useEffect } from "react";
import { Container, PostForm } from "../components"; // Assuming PostForm is correctly imported
import appwriteService from "../appWrite/config";
import { useNavigate, useParams } from "react-router-dom";
import { Link } from "react-router-dom"; // Import Link for "Explore Stories" button
import { useSelector } from 'react-redux'; // Import useSelector to get user data for permissions

function EditPost() {
    const [post, setPost] = useState(null);
    const [loading, setLoading] = useState(true); // Add loading state
    const { slug } = useParams();
    const navigate = useNavigate();
    const userData = useSelector((state) => state.auth.userData); // Get current user's data

    useEffect(() => {
        const fetchPostForEdit = async () => {
            setLoading(true); // Start loading
            if (slug) {
                try {
                    const postData = await appwriteService.getPost(slug);
                    if (postData) {
                        // Crucial permission check: Ensure the logged-in user is the author
                        if (postData.userid === userData?.$id) {
                            setPost(postData);
                        } else {
                            console.warn("EditPost: User does not have permission to edit this post.");
                            navigate("/all-posts"); // Redirect if not authorized
                        }
                    } else {
                        // If post data is null, it means post wasn't found or accessible
                        console.warn(`EditPost: Post with slug "${slug}" not found.`);
                        navigate("/all-posts"); // Redirect to all posts if not found
                    }
                } catch (error) {
                    console.error("EditPost: Error fetching post for editing:", error);
                    navigate("/all-posts"); // Redirect on error
                } finally {
                    setLoading(false); // Stop loading regardless of success/failure
                }
            } else {
                navigate("/all-posts"); // Redirect if slug doesn't exist in URL
                setLoading(false); // Stop loading
            }
        };

        // Only fetch if userData is available to perform the authorization check
        if (userData) {
            fetchPostForEdit();
        }
        // If userData is not yet available, keep loading and wait for Redux state
        // If userData becomes null (e.g., user logs out), this useEffect will implicitly
        // cause a redirect due to lack of postData.userid === userData?.$id match,
        // or a redirection from other components if they detect unauthenticated state.
    }, [slug, navigate, userData]); // Add userData to dependencies

    // --- Loading State UI ---
    if (loading || !userData) { // Also show loading if userData isn't ready for auth check
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-950 text-white">
                <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-red-600"></div>
                <p className="ml-4 text-xl font-medium">Fetching story for editing and verifying permissions...</p>
            </div>
        );
    }

    // --- Post Not Found / No Post Data UI ---
    // This will render if `post` is null after `loading` becomes false,
    // which includes cases where the user is not authorized or post genuinely doesn't exist.
    if (!post) {
        return (
            <div className="w-full bg-gradient-to-br from-gray-950 to-black text-white min-h-screen py-16 flex items-center justify-center">
                <div className="text-center animate-fade-in-up p-8 rounded-xl bg-gray-800 shadow-xl border border-gray-700">
                    <h2 className="text-3xl md:text-4xl font-extrabold text-red-600 mb-4">Access Denied or Story Not Found!</h2>
                    <p className="text-lg text-gray-300 mb-6">
                        The narrative you're trying to edit doesn't exist, or you do not have permission to modify it.
                    </p>
                    <Link to="/all-posts" className="inline-block px-8 py-3 rounded-full bg-red-600 text-white text-lg font-semibold shadow-lg hover:bg-red-700 transition-all duration-300 transform hover:scale-105">
                        Explore Other Stories
                    </Link>
                </div>
            </div>
        );
    }

    // --- Main Edit Post Content UI (when post is loaded and authorized) ---
    return (
        <div className="w-full bg-gradient-to-br from-gray-950 to-black text-white min-h-screen py-16 px-4 sm:px-6 lg:px-8">
            <Container>
                {/* Section for title and subtitle */}
                <div className="text-center mb-12 animate-fade-in-up">
                    <h1 className="text-5xl sm:text-6xl font-extrabold text-red-600 mb-4 drop-shadow-lg tracking-tight">
                        Refine Your Narrative
                    </h1>
                    <p className="text-xl text-gray-300 max-w-2xl mx-auto font-light">
                        Make your story shine with new edits and updates.
                    </p>
                </div>
                {/* Inline style block for custom animations and colorful line */}
                {/* Removed for brevity, assuming it's in a global CSS or separate file now,
                    or you can place it back if it's strictly local to this component */}
                <hr className="colorful-line mb-10 animate-line-fade-in-wide" />

                {/* Container for the PostForm component */}
                <div className="flex justify-center items-center animate-fade-in">
                    {/* Pass the loaded post data to PostForm */}
                    {/* No need to pass authorName, PostForm handles it internally */}
                    <PostForm post={post} />
                </div>
            </Container>
        </div>
    );
}

export default EditPost;