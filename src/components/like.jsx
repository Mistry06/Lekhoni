// like.jsx
import React, { useState, useEffect } from 'react'; // Import useEffect
import appwriteService from '../appWrite/config'; // Make sure this path is correct
import { useSelector } from 'react-redux';

// useLikeFunctionality now directly manages the 'like' string attribute
function useLikeFunctionality(initialLikes = 0, initialLikedByCurrentUser = false, postId) {
    // Initial state derived from props (which should be derived from the 'like' string)
    const [likes, setLikes] = useState(initialLikes);
    const [isLiked, setIsLiked] = useState(initialLikedByCurrentUser);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const userData = useSelector((state) => state.auth.userData);

    // This useEffect will re-sync local state if initial props change (e.g., when navigating to a new post)
    useEffect(() => {
        setLikes(initialLikes);
        setIsLiked(initialLikedByCurrentUser);
    }, [initialLikes, initialLikedByCurrentUser]);


    const toggleLike = async () => {
        if (isLoading || !userData) {
            if (!userData) setError("Please log in to like this post.");
            return;
        }

        setIsLoading(true);
        setError(null);

        try {
            const currentPost = await appwriteService.getPost(postId);

            if (!currentPost) {
                throw new Error("Post not found for liking/unliking.");
            }

            let likedByUsersArray = [];

            // Parse the 'like' string attribute from the fetched post
            try {
                if (currentPost.like) { // Use 'currentPost.like'
                    likedByUsersArray = JSON.parse(currentPost.like);
                    if (!Array.isArray(likedByUsersArray)) {
                        likedByUsersArray = []; // Ensure it's an array
                    }
                }
            } catch (parseError) {
                console.error("Error parsing 'like' string from Appwrite:", parseError);
                likedByUsersArray = []; // Fallback to empty array on parse error
            }

            const userid = userData.$id;
            let newLikedByUsersArray = [...likedByUsersArray];
            let newIsLiked;

            if (newLikedByUsersArray.includes(userid)) {
                // User has already liked, so unlike: remove ID from array
                newLikedByUsersArray = newLikedByUsersArray.filter((id) => id !== userid);
                newIsLiked = false;
            } else {
                // User has not liked, so like: add ID to array
                newLikedByUsersArray.push(userid);
                newIsLiked = true;
            }

            // Derive the new likes count from the array length
            const newLikesCount = newLikedByUsersArray.length;

            // 2. Update the post in Appwrite with the new 'like' string
            const updatedPost = await appwriteService.updatePost(
                postId,
                {
                    like: JSON.stringify(newLikedByUsersArray), // Update the 'like' string attribute
                },
                undefined // Explicitly pass undefined for permissions
            );

            if (updatedPost) {
                // 3. Update local state if Appwrite update was successful
                setLikes(newLikesCount);
                setIsLiked(newIsLiked);
            } else {
                throw new Error("Failed to update like status in database.");
            }
        } catch (err) {
            console.error("Error updating like status:", err);
            setError(err.message || "Failed to update like. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    return { likes, isLiked, isLoading, error, toggleLike };
}

export default useLikeFunctionality;