import conf from "../conf/conf.js"; // Assuming conf.js holds your Appwrite project configs
import { Client, ID, Databases, Storage, Query } from "appwrite";

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

    // Method to create a new post document in Appwrite
    async createPost({ title, slug, content, image, status, userid, authorName, like }) { 
        try {
            return await this.databases.createDocument(
                conf.appwriteDatabaseId,
                conf.appwriteCollectionId,
                slug, // Using slug as document ID
                {
                    title,
                    content,
                    image, // <--- This MUST be present and a valid file ID
                    status,
                    userid,
                    authorName,
                    like,
                }
            );
        } catch (error) {
            console.log("Appwrite service :: createPost :: error", error);
            throw error;
        }
    }
    // Method to update an existing post document
    async updatePost(slug, { title, content, image, status, authorName, like /* This is now an array from LikeButtonComponent */ }) {
        try {
            // *** IMPORTANT: Stringify the 'like' array before sending to Appwrite ***
            const dataToSend = {
                title,
                content,
                image,
                status,
                authorName,
                // Ensure 'like' is always a JSON string for Appwrite's string attribute
                like: JSON.stringify(like || []), // Stringify the array, default to empty array if null/undefined
            };

            // Filter out undefined values if they cause issues with Appwrite partial updates
            // (Appwrite updateDocument is usually good with partial updates, but it's good practice)
            Object.keys(dataToSend).forEach(key => {
                if (dataToSend[key] === undefined) {
                    delete dataToSend[key];
                }
            });


            return await this.databases.updateDocument(
                conf.appwriteDatabaseId,
                conf.appwriteCollectionId,
                slug,
                dataToSend
            );
        } catch (error) {
            console.error("Appwrite service :: updatePost :: error", error);
            throw error;
        }
    }

    // Method to delete a post document
    async deletePost(slug) {
        try {
            await this.databases.deleteDocument(
                conf.appwriteDatabaseId,
                conf.appwriteCollectionId,
                slug
            );
            return true;
        } catch (error) {
            console.error("Appwrite Service :: deletePost :: error", error);
            return false;
        }
    }

    // Method to get a single post document by its slug (ID)
    async getPost(slug) {
        try {
            console.log("config.js (Service): Attempting to get post with slug:", slug);
            const postDocument = await this.databases.getDocument(
                conf.appwriteDatabaseId,
                conf.appwriteCollectionId,
                slug
            );
            console.log("config.js (Service): Successfully got post:", postDocument);
            return postDocument;
        } catch (error) {
            console.error("config.js (Service): Error getting post:", error);
            return null; // Return null instead of false for consistency and easier checks
        }
    }

    // Method to get a list of posts with optional queries (e.g., filter by status)
    async getPosts(queries = []) {
        try {
            // Always add a query to filter for active posts
            queries.push(Query.equal("status", "active"));
            const response = await this.databases.listDocuments(
                conf.appwriteDatabaseId,
                conf.appwriteCollectionId,
                queries
            );
            // console.log("Appwrite response:", response); // Uncomment for debugging list response
            return response;
        } catch (error) {
            console.error("Appwrite Service :: getPosts :: error", error);
            return null; // Return null on error
        }
    }

    // Method to upload a file to Appwrite Storage
    async uploadFile(file) {
        try {
            return await this.bucket.createFile(
                conf.appwriteBucketId,
                ID.unique(), // Use Appwrite's unique ID generator for file IDs
                file
            );
        } catch (error) {
            console.error("Appwrite Service :: uploadFile :: error", error);
            return false; // Return false on error
        }
    }

    // Method to delete a file from Appwrite Storage
    async deleteFile(fileId) {
        try {
            await this.bucket.deleteFile(conf.appwriteBucketId, fileId);
            return true;
        } catch (error) {
            console.error("Appwrite Service :: deleteFile :: error", error);
            return false;
        }
    }

    // Method to get a public URL for a file preview (direct download URL)
    getFilePreview(fileId) {
        if (!fileId) {
            console.error("Error: File ID is required for preview.");
            return null;
        }
        try {
            // Using getFileDownload to get the direct URL for an image
            const imageUrl = this.bucket.getFileDownload(
                conf.appwriteBucketId,
                fileId
            );
            // console.log("Generated Image Download URL (via SDK):", imageUrl); // Uncomment for debugging
            return imageUrl;
        } catch (error) {
            console.error("Appwrite Service :: getFileDownload :: error", error);
            return null;
        }
    }
}

const appwriteService = new Service();
export default appwriteService;