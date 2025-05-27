import { Client, Account, ID } from 'appwrite';
import conf from '../conf/conf'; // Your Appwrite configuration

export class AuthService {
    client = new Client(); // Appwrite Client instance
    account; // Appwrite Account service instance

    constructor() {
        // Initialize the Appwrite client with your project details
        this.client
            .setEndpoint(conf.appwriteUrl) // Your Appwrite API Endpoint
            .setProject(conf.appwriteProjectId); // Your Appwrite Project ID
        
        // Initialize the Appwrite Account service
        this.account = new Account(this.client);
    }

    /**
     * Creates a new user account.
     * @param {object} { email, password, name }
     * @returns {Promise<object>} Returns the user account object.
     */
    async createAccount({ email, password, name }) {
        try {
            const userAccount = await this.account.create(
                ID.unique(), // Unique ID for the user
                email,
                password,
                name
            );
            if (userAccount) {
                // If account creation is successful, directly login the user for convenience
                return this.login({ email, password });
            } else {
                return userAccount;
            }
        } catch (error) {
            console.error("Appwrite service :: createAccount :: error", error);
            throw error; // Re-throw the error for component to handle
        }
    }

    /**
     * Logs in a user with email and password.
     * @param {object} { email, password }
     * @returns {Promise<object>} Returns the session object.
     */
    async login({ email, password }) {
        try {
            return await this.account.createEmailPasswordSession(email, password);
        } catch (error) {
            console.error("Appwrite service :: login :: error", error);
            throw error;
        }
    }

    /**
     * Retrieves the currently logged-in user's account details.
     * @returns {Promise<object|null>} Returns the user account object or null if no user is logged in.
     */
    async getCurrentUser() {
        try {
            return await this.account.get();
        } catch (error) {
            console.error("Appwrite service :: getCurrentUser :: error", error);
            // If there's an error (e.g., user not logged in, 401 Unauthorized), return null
            return null;
        }
    }

    /**
     * Logs out the current user by deleting all their sessions.
     * @returns {Promise<boolean>} Returns true on successful logout.
     */
    async logout() {
        try {
            await this.account.deleteSessions();
            return true;
        } catch (error) {
            console.error("Appwrite service :: logout :: error", error);
            throw error;
        }
    }

    /**
     * Updates the current user's name.
     * @param {string} name The new name for the user.
     * @returns {Promise<object>} Returns the updated user object.
     */
    async updateName(name) {
        try {
            const updatedUser = await this.account.updateName(name);
            return updatedUser;
        } catch (error) {
            console.error("Appwrite service :: updateName :: error", error);
            throw error;
        }
    }

    /**
     * Updates the current user's email address.
     * Requires the current password for security.
     * @param {string} newEmail The new email address.
     * @param {string} password The current password of the user.
     * @returns {Promise<object>} Returns the updated user object.
     */
    async updateEmail(newEmail, password) {
        try {
            const updatedUser = await this.account.updateEmail(newEmail, password);
            return updatedUser;
        } catch (error) {
            console.error("Appwrite service :: updateEmail :: error", error);
            throw error;
        }
    }

    /**
     * Updates the current user's password.
     * Requires the old password for security.
     * @param {string} newPassword The new password.
     * @param {string} oldPassword The old (current) password of the user.
     * @returns {Promise<object>} Returns the updated user object.
     */
    async updatePassword(newPassword, oldPassword) {
        try {
            const updatedUser = await this.account.updatePassword(newPassword, oldPassword);
            return updatedUser;
        } catch (error) {
            console.error("Appwrite service :: updatePassword :: error", error);
            throw error;
        }
    }

    /**
     * Initiates the password recovery process by sending a recovery email.
     * @param {string} email The email address associated with the account.
     * @param {string} recoveryUrl The URL in your application where the user will be redirected to reset their password (e.g., 'https://yourdomain.com/reset-password').
     * @returns {Promise<object>} Returns the recovery initiation response.
     */
    async createPasswordRecovery(email, recoveryUrl) {
        try {
            return await this.account.createRecovery(email, recoveryUrl);
        } catch (error) {
            console.error("Appwrite service :: createPasswordRecovery :: error", error);
            throw error;
        }
    }

    /**
     * Confirms the password recovery and sets a new password.
     * This is used on the password reset page after the user clicks the recovery link.
     * @param {string} userId The user's ID (from URL query parameter).
     * @param {string} secret The recovery secret (from URL query parameter).
     * @param {string} newPassword The new password to set.
     * @returns {Promise<object>} Returns the updated user object.
     */
    async confirmPasswordRecovery(userId, secret, newPassword) {
        try {
            return await this.account.updateRecovery(userId, secret, newPassword);
        } catch (error) {
            console.error("Appwrite service :: confirmPasswordRecovery :: error", error);
            throw error;
        }
    }

    // You might also want a method for email verification if you use it:
    /**
     * Sends an email verification link to the current user.
     * @param {string} verificationUrl The URL in your application where the user will be redirected after verification (e.g., 'https://yourdomain.com/verification-success').
     * @returns {Promise<object>}
     */
    async createVerification(verificationUrl) {
        try {
            return await this.account.createVerification(verificationUrl);
        } catch (error) {
            console.error("Appwrite service :: createVerification :: error", error);
            throw error;
        }
    }

    /**
     * Confirms the user's email verification.
     * @param {string} userId The user's ID (from URL query parameter).
     * @param {string} secret The verification secret (from URL query parameter).
     * @returns {Promise<object>}
     */
    async confirmVerification(userId, secret) {
        try {
            return await this.account.updateVerification(userId, secret);
        } catch (error) {
            console.error("Appwrite service :: confirmVerification :: error", error);
            throw error;
        }
    }
}

// Create a single instance of the AuthService to be imported and used throughout the application
const authService = new AuthService();
export default authService;