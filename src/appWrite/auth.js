import { Client, Account, ID } from 'appwrite';
import conf from '../conf/conf';

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
            return null;
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

    async deleteAccount() {
        try {
            await this.account.deleteSessions();
            return true;
        } catch (error) {
            console.log("Appwrite service :: deleteAccount :: error", error);
            throw new Error(`Failed to log out all sessions for account deletion: ${error.message}`);
        }
    }

    // This is the method you recently added and should be present only once
    async updateName(newName) {
        try {
            return await this.account.updateName(newName);
        } catch (error) {
            console.log("Appwrite service :: updateName :: error", error);
            throw error;
        }
    }
}

// Instantiate the service ONCE
const authService = new AuthService();

// Export the single instance as the default export
export default authService;