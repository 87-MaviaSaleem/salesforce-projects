import { LightningElement } from 'lwc';
import loginUser from '@salesforce/apex/AuthenticationController.loginUser';

export default class AuthTestComponent extends LightningElement {
    username = '';
    password = '';
    errorMessage = '';
    authStatus = '';

    handleUsernameChange(event) {
        this.username = event.target.value;
    }

    handlePasswordChange(event) {
        this.password = event.target.value;
    }

    handleLogin() {
        // Clear previous messages
        this.errorMessage = '';
        this.authStatus = '';

        if (!this.username || !this.password) {
            this.errorMessage = 'Username and Password are required.';
            return; // Stop if fields are empty
        }

        // Call Apex method
        loginUser({ username: this.username, password: this.password })
            .then((result) => {
                // Handle result from Apex method
                if (result.success) {
                    this.authStatus = 'Login successful!';
                } else {
                    this.errorMessage = result.errorMessage || 'Authentication failed. Please check your credentials.';
                }
            })
            .catch((error) => {
                this.errorMessage = 'An error occurred. Please try again later.';
                console.error('Error during login:', error);
            });
    }
}