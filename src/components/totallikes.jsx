// src/components/MyTotalLikes.jsx (New Component)
import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import appwriteService from '../appWrite/config'; // Your Appwrite service

function MyTotalLikes() {
    const [totalLikes, setTotalLikes] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const userData = useSelector((state) => state.auth.userData);
    const authStatus = useSelector((state) => state.auth.status);

    useEffect(() => {
        const fetchTotalLikes = async () => {
            if (!userData || !authStatus) {
                // Wait for user data to be available
                setLoading(false);
                return;
            }

            setLoading(true);
            setError(null);
            setTotalLikes(0); // Reset for new calculation

            try {
                // Fetch all posts where the current user is the author
                // Assuming appwriteService.getPosts allows filtering by 'userid'
                // You might need to adjust your appwriteService.getPosts method to support this
                const response = await appwriteService.getPosts([
                    // Assuming Query for Appwrite. You'll need to import Query from appwrite
                    // import { Query } from 'appwrite';
                    // Query.equal('userid', userData.$id)
                ]);

                if (response && response.documents) {
                    let sumOfLikes = 0;
                    response.documents.forEach(post => {
                        try {
                            if (post.like) {
                                const likedByUsersArray = JSON.parse(post.like);
                                if (Array.isArray(likedByUsersArray)) {
                                    sumOfLikes += likedByUsersArray.length;
                                }
                            }
                        } catch (parseError) {
                            console.warn(`Error parsing 'like' string for post ${post.$id}:`, parseError);
                            // Continue processing other posts even if one fails
                        }
                    });
                    setTotalLikes(sumOfLikes);
                } else {
                    // No posts found or response structure unexpected
                    setTotalLikes(0);
                }
            } catch (err) {
                console.error("Error fetching total likes:", err);
                setError("Failed to load total likes.");
                setTotalLikes(0); // Ensure count is 0 on error
            } finally {
                setLoading(false);
            }
        };

        // Only fetch if user data is available
        if (userData && authStatus) {
            fetchTotalLikes();
        } else if (!authStatus) {
            // If explicitly not authenticated, ensure loading is off and likes are 0
            setLoading(false);
            setTotalLikes(0);
        }
    }, [userData, authStatus]); // Re-run when user data or auth status changes

    if (loading) {
        return <p className="text-gray-400">Loading total likes...</p>;
    }

    if (error) {
        return <p className="text-red-500">{error}</p>;
    }

    // You can uncomment this if you want to show it only when logged in
    // if (!userData) {
    //     return <p className="text-gray-500">Log in to see your total likes.</p>;
    // }

    return (
        <div className="text-white text-lg font-semibold">
            Total Likes Across All My Posts: {totalLikes}
        </div>
    );
}

export default MyTotalLikes;