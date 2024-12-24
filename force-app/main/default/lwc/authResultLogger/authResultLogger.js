import { LightningElement } from 'lwc';
import loginUser from '@salesforce/apex/AuthenticationController.loginUser';
import saveTestResult from '@salesforce/apex/TestResultController.saveTestResult';

export default class AuthResultLogger extends LightningElement {
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
        this.errorMessage = '';
        this.authStatus = '';

        // Check if username and password are provided
        if (!this.username || !this.password) {
            this.errorMessage = 'Please enter both username and password.';
            return;
        }

        // Call the loginUser Apex method
        loginUser({ username: this.username, password: this.password })
            .then((result) => {
                let authStatus = 'Failure';
                if (result.success) {
                    authStatus = 'Success';
                    this.authStatus = 'Login successful!';
                } else {
                    this.errorMessage = result.errorMessage || 'Invalid credentials.';
                }

                this.logTestResult(authStatus, this.errorMessage);
            })
            .catch((error) => {
                this.errorMessage = 'An error occurred during login. Please try again later.';
                console.error('Error during login:', error);
                this.logTestResult('Failure', this.errorMessage);
            });
    }

    logTestResult(authStatus, errorMessage) {
        saveTestResult({ 
            authStatus: authStatus, 
            errorMessage: errorMessage,
            testDate: new Date()
        })
        .then(() => {
            console.log('Test result saved successfully');
        })
        .catch((error) => {
            console.error('Error saving test result:', error);
        });
    }
}