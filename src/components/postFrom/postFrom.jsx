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
            // For existing posts, use the current $id for the slug field, otherwise empty.
            // Note: The slug is typically the document ID in Appwrite for posts.
            slug: post?.$id || '',
            content: post?.content || '',
            status: post?.status || 'active',
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

        if (post) {
            // Scenario: Updating an existing post
            let fileId = post.image; // Start with the existing image ID

            // Handle new image upload during update
            if (data.image && data.image[0]) {
                try {
                    const file = await appwriteService.uploadFile(data.image[0]);
                    if (file) {
                        fileId = file.$id;
                        // If there was an old image, delete it
                        if (post.image) {
                            await appwriteService.deleteFile(post.image);
                        }
                    } else {
                        console.error("PostForm: Failed to upload new image during post update. Service returned no file.");
                        alert("Failed to upload new image. Keeping old image if exists. Please try again.");
                    }
                } catch (error) {
                    console.error("PostForm: Error uploading new image during post update:", error);
                    alert(`Error uploading new image: ${error.message || 'Unknown error'}. Post update will continue with old image if exists.`);
                }
            } else if (post.image && !data.image[0]) {
                 // Case: User explicitly removed the image by not providing a new one
                 // This effectively means removing the image from the post if it was previously there.
                 // Only set fileId to null if the image is NOT required for updates in your Appwrite schema.
                 // If it IS required for updates, you might need to handle this differently (e.g., prevent removal).
                 // For now, it will proceed to update with fileId = null, which would cause an error
                 // if `image` is required on update. Your `isImageRequiredForUpdate` flag will catch this.
                 // console.warn("PostForm: User did not provide a new image for an existing post. Old image will be removed if no new image is selected and schema allows.");
                 fileId = null; // Set to null if image is optional and not provided, effectively removing it.
            }


            // Prepare data for update.
            // Note: `data.like` is already an array here due to `defaultValues` parsing.
            // It needs to be stringified before sending to Appwrite.
            const dataToUpdate = {
                title: data.title,
                content: data.content,
                image: fileId, // Use the new fileId or the existing one
                status: data.status,
                authorName: finalAuthorName,
                // Stringify the 'like' array before sending to Appwrite's JSON attribute
                like: JSON.stringify(data.like || []),
            };

            // Validate if image is required for updates based on Appwrite schema
            // Replace `false` with `true` if your Appwrite 'image' attribute is required for updates
            const isImageRequiredForUpdate = false;
            if (isImageRequiredForUpdate && !fileId) {
                alert("Cannot update post: A featured image is required.");
                return; // Abort update if image is required and missing
            }

            try {
                const dbPost = await appwriteService.updatePost(post.$id, dataToUpdate);

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

            let fileId = null;
            // Check if a file was provided and if it's valid
            if (data.image && data.image[0]) {
                try {
                    const file = await appwriteService.uploadFile(data.image[0]);
                    if (file) {
                        fileId = file.$id;
                    } else {
                        // This block means uploadFile successfully completed but returned null/undefined (unlikely for Appwrite SDK)
                        console.error("PostForm: Failed to upload image for new post. Service returned no file.");
                        alert("Failed to upload image. Please ensure the image is valid and try again.");
                        return; // Stop execution if upload failed
                    }
                } catch (error) {
                    // This block means uploadFile threw an error
                    console.error("PostForm: Error during file upload for new post:", error);
                    alert(`Error uploading image: ${error.message || 'Unknown error'}. Please try again.`);
                    return; // Stop execution if upload threw an error
                }
            }

            // --- CRITICAL FIX START ---
            // If we are creating a new post AND the image is required (which it is by `required: !post`),
            // AND we still don't have a valid `fileId` after trying to upload,
            // then we MUST stop here and inform the user.
            if (!fileId) { // This handles cases where no file was selected OR upload failed
                alert("Please select a featured image. It is required for new posts.");
                return; // Stop execution if no image was successfully provided and it's required
            }
            // --- CRITICAL FIX END ---

            const newPostData = {
                title: data.title,
                content: data.content,
                image: fileId, // This will now always be a valid file ID due to the check above
                status: data.status,
                userid: userData.$id, // The ID of the currently logged-in user
                authorName: finalAuthorName,
                like: JSON.stringify([]), // Initialize likes as an empty JSON array string for new posts
                slug: data.slug, // Ensure slug is also included here as it's part of the data for createPost
            };

            try {
                const dbPost = await appwriteService.createPost(newPostData);

                console.log("PostForm: Create post to DB result:", dbPost);

                if (dbPost) {
                    navigate(`/post/${dbPost.$id}`);
                } else {
                    alert("Failed to create post. No response from service.");
                }
            } catch (error) {
                console.error("PostForm: Error creating post in DB:", error);
                alert(`Error creating post: ${error.message || 'Unknown error'}`);
            }
        }
    };

    const slugTransform = useCallback((name) => {
        if (name && typeof name === 'string')
            return name
                .trim()
                .toLowerCase()
                .replace(/[^a-zA-Z\d\s]+/g, "-")
                .replace(/\s/g, "-");
        return '';
    }, []);

    useEffect(() => {
        const subscription = watch((value, { name }) => {
            if (name === 'title') {
                // Only auto-generate slug if it's a new post (no `post` object)
                // or if the slug field is currently empty (allowing manual override).
                if (!post || getValues('slug') === '') {
                    setValue('slug', slugTransform(value.title), { shouldValidate: true });
                }
            }
        });

        return () => subscription.unsubscribe();
    }, [watch, slugTransform, setValue, post, getValues]);

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

                <Input
                    label="Slug :"
                    placeholder="Slug"
                    className="mb-4 bg-gray-800 text-white border-gray-700 focus:border-red-600 focus:ring-red-600"
                    {...register("slug", { required: true })}
                    onInput={(e) => {
                        setValue("slug", slugTransform(e.currentTarget.value), { shouldValidate: true });
                    }}
                    // Slug is only disabled if we are editing an existing post
                    disabled={post ? true : false}
                />
                {errors.slug && <p className="text-red-400 text-sm mt-1">Slug is required.</p>}

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
                {/* Display image required error only if it's a new post AND the error exists */}
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
                    options={["active", "inactive"]}
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