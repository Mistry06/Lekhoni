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
    async createPost({ title, content, image, status, userid, authorName, like }) {
        try {
            // Use ID.unique() to generate a random document ID for the new post
            return await this.databases.createDocument(
                conf.appwriteDatabaseId,
                conf.appwriteCollectionId,
                ID.unique(), // <--- Use Appwrite's unique ID generator here
                {
                    title,
                    content,
                    image,
                    status,
                    userid,
                    authorName,
                    like,
                    // Removed 'slug' from the data object as it's no longer needed as a document attribute
                }
            );
        } catch (error) {
            console.log("Appwrite service :: createPost :: error", error);
            throw error;
        }
    }

    // Method to update an existing post document
    async updatePost(slug, data) {
        try {
            // Create a mutable copy of the data.
            // This is flexible, allowing you to pass any fields for update.
            const dataToSend = { ...data };
    
            // It's good practice to filter out undefined values if they appear,
            // although Appwrite's updateDocument typically handles partial updates well.
            Object.keys(dataToSend).forEach(key => {
                if (dataToSend[key] === undefined) {
                    delete dataToSend[key];
                }
            });
    
            // Perform the document update using the Appwrite SDK.
            // The 'like' attribute in 'dataToSend' is already a JSON string (e.g., "[\"user1\", \"user2\"]"),
            // so we **do not** apply JSON.stringify again here.
            return await this.databases.updateDocument(
                conf.appwriteDatabaseId,
                conf.appwriteCollectionId,
                slug,
                dataToSend // Pass the dataToSend object directly
            );
        } catch (error) {
            // Log any errors that occur during the Appwrite update operation.
            // This log is vital for debugging in your browser's console.
            console.error("Appwrite service :: updatePost :: error", error);
            // Re-throw the error so the calling function (like.jsx) can catch it
            // and update its state, providing proper feedback to the user.
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
  // appwriteService/config.js
  async getPosts(queries = []) {
    try {
        // This is correct: no hardcoded 'status' filter here.
        // It simply passes whatever 'queries' array it receives.
        console.log("Appwrite Service DEBUG: getPosts called with queries:", queries);
        const response = await this.databases.listDocuments(
            conf.appwriteDatabaseId,
            conf.appwriteCollectionId,
            queries // Correctly passes the queries array directly
        );
        console.log("Appwrite Service DEBUG: getPosts response:", response);
        return response;
    } catch (error) {
        console.error("Appwrite Service :: getPosts :: error", error);
        return null;
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