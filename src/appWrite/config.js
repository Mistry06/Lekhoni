// appWrite/config.js

import conf from "../conf/conf.js";
import { Client, ID, Databases, Storage, Query, Permission, Role } from "appwrite";

export class Service {
    client = new Client();
    databases;
    bucket;

    constructor() {
        this.client
            .setEndpoint(conf.appwriteUrl)
            .setProject(conf.appwriteProjectId);
        this.databases = new Databases(this.client);
        this.bucket = new Storage(this.client);
    }

    /**
     * Creates a new post document in Appwrite.
     * Includes dynamic permissions based on post status and sets authorName.
     *
     * @param {object} params - The post data.
     * @param {string} params.title - Title of the post.
     * @param {string} params.slug - Unique slug for the post.
     * @param {string} params.content - HTML content of the post.
     * @param {string} params.image - File ID of the featured image.
     * @param {'active'|'inactive'} params.status - Status of the post.
     * @param {string} params.userid - ID of the user creating the post.
     * @param {string} params.authorName - Name of the author.
     * @returns {Promise<object>} The created document.
     */
    async createPost({ title, slug, content, image, status, userid, authorName }) {
        try {
            const permissions = [
                Permission.read(Role.user(userid)), // Allow the creator to read
                Permission.write(Role.user(userid)), // Allow the creator to write
            ];

            // If status is 'active', also allow 'any' to read
            if (status === 'active') {
                permissions.push(Permission.read(Role.any()));
            }

            return await this.databases.createDocument(
                conf.appwriteDatabaseId,
                conf.appwriteCollectionId,
                ID.unique(), // Use ID.unique() for the documentId
                {
                    title,
                    slug,
                    content,
                    image,
                    status,
                    userid,
                    authorName, // Ensure authorName is included in the document data
                    like: "[]", // Initialize like as an empty JSON string
                },
                permissions // Pass the dynamically created permissions
            );
        } catch (error) {
            console.error("Appwrite Service :: createPost :: error", error);
            throw error; // Re-throw to be handled by the caller
        }
    }

    /**
     * Updates an existing post document in Appwrite.
     * Manages permissions dynamically based on status and ensures authorName is updated.
     *
     * @param {string} documentId - The ID of the document to update.
     * @param {object} data - The updated post data.
     * @param {string} data.title - Updated title.
     * @param {string} data.content - Updated HTML content.
     * @param {string} data.image - Updated file ID of the featured image.
     * @param {'active'|'inactive'} data.status - Updated status.
     * @param {string} data.slug - Updated slug.
     * @param {string} data.like - Updated likes array as JSON string.
     * @param {string} data.authorName - Updated name of the author.
     * @returns {Promise<object>} The updated document.
     */
    async updatePost(documentId, { title, content, image, status, slug, like, authorName }) {
        try {
            // 1. Fetch the existing document to get its current permissions and other data
            const currentPost = await this.databases.getDocument(
                conf.appwriteDatabaseId,
                conf.appwriteCollectionId,
                documentId
            );

            // Start with the existing permissions from the document
            let updatedPermissions = [...currentPost.$permissions];

            // 2. Logic to manage 'any' read permission based on 'status'
            const hasAnyRead = updatedPermissions.some(p => p.includes('read("any")'));

            if (status === 'active' && !hasAnyRead) {
                // If the new status is active and 'any' read is not already present, add it
                updatedPermissions.push(Permission.read(Role.any()));
            } else if (status !== 'active' && hasAnyRead) {
                // If the new status is not active (e.g., inactive) and 'any' read is present, remove it
                updatedPermissions = updatedPermissions.filter(p => !p.includes('read("any")'));
            }

            // 3. Ensure the original creator (based on `currentPost.userid`) always retains their read/write permissions.
            // This is crucial if `userid` is the definitive owner, and the post is being updated by someone else (e.g., an admin).
            const originalCreatorId = currentPost.userid;
            if (originalCreatorId) { // Only add if originalCreatorId exists
                const hasOriginalCreatorRead = updatedPermissions.some(p => p.includes(`read("user:${originalCreatorId}")`));
                if (!hasOriginalCreatorRead) {
                    updatedPermissions.push(Permission.read(Role.user(originalCreatorId)));
                }
                const hasOriginalCreatorWrite = updatedPermissions.some(p => p.includes(`write("user:${originalCreatorId}")`));
                if (!hasOriginalCreatorWrite) {
                    updatedPermissions.push(Permission.write(Role.user(originalCreatorId)));
                }
            }


            // 4. Ensure the current logged-in user performing the update always has write and read access to this document.
            const currentUserId = this.client.getID(); // Get the ID of the currently logged-in user
            if (currentUserId) { // Only add if currentUserId exists
                const hasCurrentUserWrite = updatedPermissions.some(p => p.includes(`write("user:${currentUserId}")`));
                if (!hasCurrentUserWrite) {
                    updatedPermissions.push(Permission.write(Role.user(currentUserId)));
                }
                const hasCurrentUserRead = updatedPermissions.some(p => p.includes(`read("user:${currentUserId}")`));
                if (!hasCurrentUserRead) {
                    updatedPermissions.push(Permission.read(Role.user(currentUserId)));
                }
            }


            return await this.databases.updateDocument(
                conf.appwriteDatabaseId,
                conf.appwriteCollectionId,
                documentId,
                {
                    title,
                    content,
                    image,
                    status,
                    slug,
                    like,
                    authorName, // Ensure authorName is included in the updated data
                },
                updatedPermissions // Pass the carefully updated permissions array
            );
        } catch (error) {
            console.error("Appwrite Service :: updatePost :: error", error);
            throw error; // Re-throw to propagate the error
        }
    }

    /**
     * Deletes a post document from Appwrite.
     * Assumes slug is the document ID.
     *
     * @param {string} documentId - The ID of the document to delete.
     * @returns {Promise<boolean>} True if successful, false otherwise.
     */
    async deletePost(documentId) { // Renamed parameter for clarity (it's the document ID being passed)
        try {
            await this.databases.deleteDocument(
                conf.appwriteDatabaseId,
                conf.appwriteCollectionId,
                documentId
            );
            return true;
        } catch (error) {
            console.error("Appwrite Service :: deletePost :: error", error);
            return false;
        }
    }

    /**
     * Retrieves a single post document from Appwrite.
     * Assumes slug is the document ID.
     *
     * @param {string} documentId - The ID of the document to retrieve.
     * @returns {Promise<object|null>} The post document or null if not found/error.
     */
    async getPost(documentId) { // Renamed parameter for clarity (it's the document ID being passed)
        try {
            console.log("config.js (Service): Attempting to get post with ID:", documentId);
            const postDocument = await this.databases.getDocument(
                conf.appwriteDatabaseId,
                conf.appwriteCollectionId,
                documentId
            );
            console.log("config.js (Service): Successfully got post:", postDocument);
            return postDocument;
        } catch (error) {
            console.error("config.js (Service): Error getting post:", error);
            return null;
        }
    }

    /**
     * Retrieves a list of post documents from Appwrite.
     * No default 'active' status filter is applied, allowing flexible querying.
     * Adds a default limit if not provided by the caller.
     *
     * @param {Array<Query>} queries - An array of Appwrite Query objects.
     * @returns {Promise<object|null>} An object containing documents and total count, or null on error.
     */
    async getPosts(queries = []) {
        try {
            console.log("config.js (Service): Attempting to get posts with initial queries:", queries);

            // Check if a limit query is already present
            const hasLimitQuery = queries.some(query => {
                if (query instanceof Query) {
                    return query.method === 'limit';
                }
                // Fallback for non-Query objects, though ideally queries should be Query instances
                const queryStr = typeof query === 'string' ? query : JSON.stringify(query);
                return queryStr.includes('"method":"limit"');
            });

            let finalQueries = [...queries];
            if (!hasLimitQuery) {
                finalQueries.push(Query.limit(5000)); // Default limit to avoid fetching excessive data
            }

            console.log("config.js (Service): Final queries for listDocuments:", finalQueries);

            const response = await this.databases.listDocuments(
                conf.appwriteDatabaseId,
                conf.appwriteCollectionId,
                finalQueries
            );
            console.log("config.js (Service): Successfully got posts:", response);
            return response;
        } catch (error) {
            console.error("Appwrite Service :: getPosts :: error", error);
            return { documents: [], total: 0 }; // Return consistent empty data on error
        }
    }

    /**
     * Uploads a file to Appwrite storage.
     *
     * @param {File} file - The file object to upload.
     * @returns {Promise<object|boolean>} The file object if successful, false otherwise.
     */
    async uploadFile(file) {
        try {
            return await this.bucket.createFile(
                conf.appwriteBucketId,
                ID.unique(), // Generate a unique ID for the file
                file
            );
        } catch (error) {
            console.error("Appwrite Service :: uploadFile :: error", error);
            return false;
        }
    }

    /**
     * Deletes a file from Appwrite storage.
     *
     * @param {string} fileId - The ID of the file to delete.
     * @returns {Promise<boolean>} True if successful, false otherwise.
     */
    async deleteFile(fileId) {
        try {
            await this.bucket.deleteFile(conf.appwriteBucketId, fileId);
            return true;
        } catch (error) {
            console.error("Appwrite Service :: deleteFile :: error", error);
            return false;
        }
    }

    /**
     * Gets the preview URL for a file from Appwrite storage.
     *
     * @param {string} fileId - The ID of the file to get preview for.
     * @returns {string|null} The URL for the file preview, or null if fileId is missing or error occurs.
     */
    getFilePreview(fileId) {
        if (!fileId) {
            console.error("Error: File ID is required for preview.");
            return null;
        }
        try {
            const imageUrl = this.bucket.getFileDownload(
                conf.appwriteBucketId,
                fileId
            );
            return imageUrl;
        } catch (error) {
            console.error("Appwrite Service :: getFileDownload :: error", error);
            return null;
        }
    }
}

const appwriteService = new Service();
export default appwriteService;