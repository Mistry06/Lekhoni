// appWrite/config.js
import conf from "../conf/conf.js";
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

    async createPost({ title, slug, content, image, status, userid }) {
        try {
            return await this.databases.createDocument(
                conf.appwriteDatabaseId,
                conf.appwriteCollectionId,
                slug,
                {
                    title,
                    content,
                    image,
                    status,
                    userid,
                    like: "[]",
                }
            );
        } catch (error) {
            console.error("Appwrite Service :: createPost :: error", error);
            throw error;
        }
    }

    async updatePost(documentId, data, permissions = undefined) {
        try {
            return await this.databases.updateDocument(
                conf.appwriteDatabaseId,
                conf.appwriteCollectionId,
                documentId,
                data,
                permissions
            );
        } catch (error) {
            console.error("Appwrite Service :: updatePost :: error", error);
            throw error;
        }
    }

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
            return null;
        }
    }

    // REVISED getPosts METHOD:
    // This now checks for 'status' within the string representation of the query
    // which is more robust if the objects are not pure Appwrite Query instances.
    async getPosts(queries = []) {
        try {
            console.log("config.js (Service): Attempting to get posts with initial queries:", queries);

            let effectiveQueries = [...queries];

            // A more robust way to check if a status query is present,
            // considering that queries might be stringified or plain objects.
            const hasExplicitStatusQuery = queries.some(query => {
                // If it's an Appwrite Query object instance (ideal case)
                if (query instanceof Query) {
                    // Check if it's an 'equal' query for status
                    if (query.attribute === 'status') return true;
                    // Check if it's an 'or' query and contains status sub-queries
                    if (query.method === 'or' && Array.isArray(query.values)) {
                        return query.values.some(subQuery => subQuery.attribute === 'status');
                    }
                }
                // If it's a plain object or stringified, check its string representation
                const queryStr = typeof query === 'string' ? query : JSON.stringify(query);
                return queryStr.includes('"attribute":"status"') || queryStr.includes('status');
            });


            if (!hasExplicitStatusQuery) {
                // If no status query was explicitly provided by the caller, default to 'active'.
                effectiveQueries.push(Query.equal("status", "active"));
                console.log("config.js (Service): No explicit status query provided, defaulting to 'active'.");
            } else {
                console.log("config.js (Service): Explicit status query provided by caller, respecting it.");
            }

            console.log("config.js (Service): Final queries for listDocuments:", effectiveQueries);

            const response = await this.databases.listDocuments(
                conf.appwriteDatabaseId,
                conf.appwriteCollectionId,
                effectiveQueries
            );
            console.log("config.js (Service): Successfully got posts:", response);
            return response;
        } catch (error) {
            console.error("Appwrite Service :: getPosts :: error", error);
            return null;
        }
    }


    async uploadFile(file) {
        try {
            return await this.bucket.createFile(
                conf.appwriteBucketId,
                ID.unique(),
                file
            );
        } catch (error) {
            console.error("Appwrite Service :: uploadFile :: error", error);
            return false;
        }
    }

    async deleteFile(fileId) {
        try {
            await this.bucket.deleteFile(conf.appwriteBucketId, fileId);
            return true;
        } catch (error) {
            console.error("Appwrite Service :: deleteFile :: error", error);
            return false;
        }
    }

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