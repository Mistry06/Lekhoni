// src/components/PostForm/PostForm.jsx

import React, { useCallback, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Button, Input, Select, RTE } from '../index';
import appwriteService from '../../appWrite/config';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

function PostForm({ post }) {
    const navigate = useNavigate();
    const userData = useSelector((state) => state.auth.userData);

    const { register, handleSubmit, watch, setValue, control, getValues, formState: { errors } } = useForm({
        defaultValues: {
            title: post?.title || '',
            // Removed slug from defaultValues as it's no longer a user-editable field
            content: post?.content || '',
            status: post?.status || 'public',
            // Pre-fill authorName from post data, or user data, or leave empty for user input
            authorName: post?.authorName || userData?.name || userData?.email || '',
            // Initialize 'like' as a parsed array if it exists and is valid JSON, otherwise an empty array.
            // This is for internal form state; it will be stringified before saving to Appwrite.
            like: post?.like ? JSON.parse(post.like || '[]') : [],
        },
    });

    const submit = async (data) => {
        // --- Critical Check: Ensure user data is available ---
        if (!userData || !userData.$id) {
            console.error("PostForm: User not authenticated or user ID unavailable. Cannot create/update post.");
            alert("You need to be logged in to perform this action.");
            navigate("/login"); // Redirect to login if user data is missing
            return;
        }

        // Determine the final author name to save.
        // Prioritize user input, then Redux user's name, then email, then 'Anonymous'.
        const finalAuthorName = data.authorName || userData?.name || userData?.email || "Anonymous";

        // Handle image upload/retention logic outside of the if/else for update/create
        let fileId = null; // Will hold the new or existing file ID

        if (data.image && data.image[0]) { // A new image file was selected (for either create or update)
            try {
                const uploadedFile = await appwriteService.uploadFile(data.image[0]);
                if (uploadedFile) {
                    fileId = uploadedFile.$id;
                    // If updating, and a new image was uploaded, delete the old one
                    if (post && post.image) {
                        await appwriteService.deleteFile(post.image);
                    }
                } else {
                    console.error("PostForm: Failed to upload image. Service returned no file.");
                    alert("Failed to upload image. Please ensure the image is valid and try again.");
                    return; // Stop submission if new image upload fails
                }
            } catch (error) {
                console.error("PostForm: Error during file upload:", error);
                alert(`Error uploading image: ${error.message || 'Unknown error'}. Please try again.`);
                return; // Stop submission if upload threw an error
            }
        } else if (post && post.image) {
            // No new image selected, but this is an UPDATE scenario and an old image exists.
            // Retain the old image's file ID.
            fileId = post.image;
        } else if (!post) {
            // New post creation, but no image was selected.
            // This case is handled by the `required: !post` validation on the input.
            // If validation passes (i.e., image was selected for new post), fileId will be set above.
            // If validation fails (no image for new post), handleSubmit won't even call `submit`.
            // However, adding an explicit check here as a fail-safe:
            if (!fileId && !post) { // If it's a new post AND no image was successfully processed
                console.error("PostForm: Image is required for new posts but was not provided.");
                alert("Please select a featured image. It is required for new posts.");
                return;
            }
        }

        // Prepare common data object for both create and update
        const postData = {
            title: data.title,
            content: data.content,
            image: fileId, // This is now correctly handled for all scenarios
            status: data.status,
            authorName: finalAuthorName,
            // Stringify the 'like' array before sending to Appwrite's JSON attribute
            like: JSON.stringify(data.like || []),
        };

        if (post) {
            // Scenario: Updating an existing post
            try {
                // When updating, we use the existing post's $id (which is the random ID now)
                const dbPost = await appwriteService.updatePost(post.$id, postData);

                if (dbPost) {
                    navigate(`/post/${dbPost.$id}`);
                } else {
                    alert("Failed to update post. No response from service.");
                }
            } catch (error) {
                console.error("PostForm: Error updating post in DB:", error);
                alert(`Error updating post: ${error.message || 'Unknown error'}`);
            }

        } else {
            // Scenario: Creating a new post
            // For new posts, ensure userid is included. Slug will be handled by appwriteService.createPost with ID.unique().
            const newPostCompleteData = {
                ...postData,
                userid: userData.$id, // The ID of the currently logged-in user
                // Removed 'slug' from here as it will be generated randomly by Appwrite now
            };

            try {
                // Call createPost without passing a slug; Appwrite will generate a unique ID
                const dbPost = await appwriteService.createPost(newPostCompleteData);

                console.log("PostForm: Create post to DB result:", dbPost);

                if (dbPost) {
                    navigate(`/post/${dbPost.$id}`); // Navigate using the new random $id
                } else {
                    alert("Failed to create post. No response from service.");
                }
            } catch (error) {
                console.error("PostForm: Error creating post in DB:", error);
                alert(`Error creating post: ${error.message || 'Unknown error'}`);
            }
        }
    };

    // slugTransform and its useEffect are removed as the slug field is no longer user-visible/generated from title.
    // If you later decide you still need a human-readable slug as a *separate attribute*
    // (distinct from the Appwrite document ID), you would re-add a variation of slugTransform
    // and include 'slug' in the 'newPostCompleteData' object.

    return (
        <form onSubmit={handleSubmit(submit)} className="flex flex-wrap -mx-2">
            <div className="w-full lg:w-2/3 px-2 mb-4">
                <Input
                    label="Title :"
                    placeholder="Title"
                    className="mb-4 bg-gray-800 text-white border-gray-700 focus:border-red-600 focus:ring-red-600"
                    {...register("title", { required: true })}
                />
                {errors.title && <p className="text-red-400 text-sm mt-1">Title is required.</p>}

                {/* Removed the Slug Input field */}

                <Input
                    label="Author Name :"
                    placeholder="Your Name or Pseudonym"
                    className="mb-4 bg-gray-800 text-white border-gray-700 focus:border-red-600 focus:ring-red-600"
                    {...register('authorName', {
                        maxLength: {
                            value: 100,
                            message: "Author name cannot exceed 100 characters."
                        }
                    })}
                />
                {errors.authorName && <p className="text-red-400 text-sm mt-1">{errors.authorName.message}</p>}

                <RTE label="Content :" name="content" control={control} defaultValue={getValues("content")} />
            </div>
            <div className="w-full lg:w-1/3 px-2">
                <Input
                    label="Featured Image :"
                    type="file"
                    className="mb-4 bg-gray-800 text-white border-gray-700 focus:border-red-600 focus:ring-red-600 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-red-600 file:text-white hover:file:bg-red-700"
                    accept="image/png, image/jpg, image/jpeg, image/gif"
                    {...register("image", { required: !post })} // Image is required only for new posts
                />
                {errors.image && !post && <p className="text-red-400 text-sm mt-1">Featured image is required for new posts.</p>}

                {post && post.image && (
                    <div className="w-full mb-4 rounded-lg overflow-hidden border border-gray-700">
                        <img
                            src={appwriteService.getFilePreview(post.image)}
                            alt={post.title}
                            className="w-full h-[auto] object-cover"
                        />
                    </div>
                )}
                <Select
                    options={["Public", "Private"]}
                    label="Status"
                    className="mb-4 bg-gray-800 text-white border-gray-700 focus:border-red-600 focus:ring-red-600"
                    {...register("status", { required: true })}
                />
                {errors.status && <p className="text-red-400 text-sm mt-1">Status is required.</p>}

                <Button type="submit"
                    className="w-full mt-4 bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-md transition-colors duration-200">
                    {post ? "Update Post" : "Submit Post"}
                </Button>
            </div>
        </form>
    );
}

export default PostForm;