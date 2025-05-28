import { Client, Account, ID } from 'appwrite';
import conf from '../conf/conf'; // Assuming conf.js holds your Appwrite project ID and URL

export class AuthService {
    client = new Client();
    account;

    constructor() {
        this.client
            .setEndpoint(conf.appwriteUrl)
            .setProject(conf.appwriteProjectId);
        this.account = new Account(this.client);
    }

    async createAccount({ email, password, name }) {
        try {
            const userAccount = await this.account.create(
                ID.unique(),
                email,
                password,
                name
            );
            if (userAccount) {
                // call another method
                return this.login({ email, password });
            } else {
                return userAccount;
            }
        } catch (error) {
            console.log("Appwrite service :: createAccount :: error", error);
            throw error;
        }
    }

    async login({ email, password }) {
        try {
            return await this.account.createEmailPasswordSession(email, password);
        } catch (error) {
            console.log("Appwrite service :: login :: error", error);
            throw error;
        }
    }

    async getCurrentUser() {
        try {
            return await this.account.get();
        } catch (error) {
            console.log("Appwrite service :: getCurrentUser :: error", error);
            return null; // Return null if no user is logged in or an error occurs
        }
    }

    async logout() {
        try {
            return await this.account.deleteSessions();
        } catch (error) {
            console.log("Appwrite service :: logout :: error", error);
            throw error;
        }
    }

    async updatePassword(newPassword, oldPassword) {
        try {
            return await this.account.updatePassword(newPassword, oldPassword);
        } catch (error) {
            console.log("Appwrite service :: updatePassword :: error", error);
            throw error;
        }
    }

    // ****** FIX FOR "Identity not found" error ******
    // IMPORTANT: This only deletes all active sessions for the user,
    // effectively logging them out everywhere.
    // IT DOES NOT delete the user's record from the Appwrite database itself.
    // For full user record deletion, you need to use Appwrite Cloud Functions
    // with the Admin SDK (`users.deleteUser(userId)`).
    async deleteAccount() {
        try {
            // Re-authentication already handled in Account.jsx via updatePassword
            // Now, delete all sessions for the current user.
            await this.account.deleteSessions();
            return true; // Indicate success for the client-side operation
        } catch (error) {
            console.log("Appwrite service :: deleteAccount :: error", error);
            throw new Error(`Failed to log out all sessions for account deletion: ${error.message}`);
        }
    }
    // *************************************************
}

const authService = new AuthService();

export default authService;