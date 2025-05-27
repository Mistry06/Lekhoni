// src/components/PostForm/PostForm.jsx

import React, { useCallback, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Button, Input, Select, RTE } from '../index'; // Assuming index.js correctly exports these
import appwriteService from '../../appWrite/config'; // Assumes config.js is correct
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

// PostForm now accepts 'post' (for editing) and 'userData' (for defaulting author name)
// The 'authorName' prop is no longer passed explicitly from AddPost.jsx
// Instead, PostForm will use 'userData' from Redux for default and allow user input.
function PostForm({ post }) { // Removed authorName prop
    const navigate = useNavigate();
    const userData = useSelector((state) => state.auth.userData); // Get userData directly

    const { register, handleSubmit, watch, setValue, control, getValues, formState: { errors } } = useForm({
        defaultValues: {
            title: post?.title || '',
            // For editing, use post.$id as the slug. For new posts, it's empty initially.
            slug: post?.$id || '',
            content: post?.content || '',
            status: post?.status || 'active',
            // Default authorName: existing post's author, OR current user's name/email, OR empty string
            authorName: post?.authorName || userData?.name || userData?.email || '', // NEW DEFAULT
        },
    });

    const submit = async (data) => {
        // Determine the final author name to save.
        // It prioritizes the value from the form input (`data.authorName`).
        // If the input is empty, it falls back to the logged-in user's name/email.
        // As a last resort, it uses "Anonymous".
        const finalAuthorName = data.authorName || userData?.name || userData?.email || "Anonymous";

        if (post) {
            // Scenario: Updating an existing post
            let fileId = post.image; // Start with the existing image ID

            if (data.image && data.image[0]) {
                // A new image was selected
                const file = await appwriteService.uploadFile(data.image[0]);
                if (file) {
                    fileId = file.$id;
                    // If there was an old image, delete it
                    if (post.image) {
                        await appwriteService.deleteFile(post.image);
                    }
                } else {
                    console.error("Failed to upload new image during post update. Keeping old image if exists.");
                }
            } else if (data.image === null && post.image) {
                // If the user explicitly cleared the image (e.g., if you add a clear button)
                // For now, if data.image is empty but post.image exists, we just keep post.image
                // unless you have a mechanism to explicitly remove it.
                // Assuming "data.image" will be empty array if no new file selected, not null.
                // If you want to allow removal, you'd add a "clear image" button.
                // For now, if no new image is provided, the old one remains.
            }


            const dataToUpdate = {
                title: data.title,
                content: data.content,
                image: fileId, // Use the new fileId or the existing one
                status: data.status,
                authorName: finalAuthorName, // Use the determined authorName from input/fallback
                like: post.like || "[]", // Ensure likes are carried over on update
            };

            const dbPost = await appwriteService.updatePost(post.$id, dataToUpdate);

            if (dbPost) {
                navigate(`/post/${dbPost.$id}`);
            } else {
                alert("Failed to update post.");
            }
        } else {
            // Scenario: Creating a new post
            if (!userData || !userData.$id) {
                console.error("User not authenticated or user ID unavailable. Cannot create post.");
                alert("Please log in to create a post.");
                navigate("/login");
                return;
            }

            let fileId = null;
            if (data.image && data.image[0]) {
                const file = await appwriteService.uploadFile(data.image[0]);
                if (file) {
                    fileId = file.$id;
                } else {
                    console.error("Failed to upload image during post creation. Post might be created without image.");
                }
            }

            const newPostData = {
                title: data.title,
                content: data.content,
                image: fileId, // Use the uploaded fileId or null
                status: data.status,
                userid: userData.$id, // The ID of the currently logged-in user
                authorName: finalAuthorName, // Use the determined authorName from input/fallback
                like: "[]", // Initialize likes as an empty JSON array string for new posts
            };

            // Assuming appwriteService.createPost expects the document ID as the second argument
            // or automatically generates one if not provided.
            // If you intend for the slug to be the document ID, pass it here.
            // If Appwrite handles doc ID, just pass newPostData.
            const dbPost = await appwriteService.createPost(newPostData, data.slug); // Pass data.slug as document ID

            if (dbPost) {
                navigate(`/post/${dbPost.$id}`);
            } else {
                alert("Failed to create post.");
            }
        }
    };

    // Slug transformation logic remains the same
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
                // Only auto-generate slug if it's a new post (not editing)
                // or if the slug field is currently empty.
                if (!post || getValues('slug') === '') {
                    setValue('slug', slugTransform(value.title), { shouldValidate: true });
                }
            }
        });

        return () => subscription.unsubscribe();
    }, [watch, slugTransform, setValue, post, getValues]); // Added post and getValues to dependencies

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

                {/* NEW AUTHOR NAME INPUT FIELD */}
                <Input
                    label="Author Name :"
                    placeholder="Your Name or Pseudonym"
                    className="mb-4 bg-gray-800 text-white border-gray-700 focus:border-red-600 focus:ring-red-600"
                    {...register('authorName', {
                        maxLength: {
                            value: 100, // Ensure this matches your Appwrite attribute size
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