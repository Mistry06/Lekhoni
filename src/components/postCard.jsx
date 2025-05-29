import React from "react";
import { Link } from "react-router-dom";
import appwriteService from "../appWrite/config"; // Import your Appwrite service

function PostCard({ $id, title, image }) {
    let imageUrl = null;

    if (image) {
        // Get the file preview. This might return a URL object or a string.
        const preview = appwriteService.getFilePreview(image);

        // Check if 'preview' is a URL object and has an 'href' property,
        // otherwise, assume it's directly the URL string.
        if (preview && typeof preview.href === 'string') {
            imageUrl = preview.href;
        } else if (typeof preview === 'string') {
            imageUrl = preview;
        }
    }

    // Optional: Uncomment for debugging
    // console.log("PostCard - Post ID:", $id);
    // console.log("PostCard - Image ID:", image);
    // console.log("PostCard - Final Image URL:", imageUrl);

    return (
        <Link to={`/post/${$id}`}>
            {/* Main card container: Dark background, rounded, padding, shadow, border, and interpublic hover effects */}
            <div className="
                w-full h-full 
                bg-gray-900 border border-gray-800 
                rounded-xl p-4 sm:p-5 
                shadow-xl 
                flex flex-col 
                transform transition-all duration-300 
                hover:scale-105 hover:shadow-2xl hover:border-red-600 
                cursor-pointer
            ">
                {/* Image container with fixed height and centering */}
                <div className="w-full h-48 sm:h-52 md:h-60 flex justify-center items-center mb-4 overflow-hidden rounded-lg">
                    {imageUrl ? ( // Now just check if imageUrl is not null/undefined
                        <img
                            src={imageUrl} // Use the directly obtained URL string
                            alt={title}
                            className="rounded-lg w-full h-full object-cover transition-transform duration-300 hover:scale-105" // Image hover effect
                        />
                    ) : (
                        <div className="rounded-lg bg-gray-700 w-full h-full flex items-center justify-center text-gray-400 text-base font-medium">
                            No Image Available
                        </div>
                    )}
                </div>
                {/* Post Title */}
                <h2 className="text-xl font-bold text-white leading-tight mb-2 truncate">
                    {title}
                </h2>
                {/* Optional: Add a short description or meta info here */}
                {/* <p className="text-sm text-gray-400">A captivating story awaits...</p> */}
            </div>
        </Link>
    );
}

export default PostCard;