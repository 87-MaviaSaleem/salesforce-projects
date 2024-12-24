import { LightningElement } from 'lwc';

export default class myCustomerDataComponent extends LightningElement {
    customerData = null;
    isLoading = true;
    error = null;
    abortController = null;
    isRetrying = false;  // To manage the retry button state

    // Fetch customer data when the component is connected to the DOM
    connectedCallback() {
        this.fetchCustomerData();
        console.log('check1');
    }

    // Fetch customer data and handle errors
    async fetchCustomerData() {
        console.log('check2');

        this.abortController = new AbortController();
        const { signal } = this.abortController;

        this.isLoading = true;
        this.error = null; // Clear previous error when trying to fetch new data

        try {
            const response = await fetch('https://api.github.com/repositories?since=364');
            console.log('check3');

            // Check for successful response (status code 2xx)
            if (!response.ok) {
                throw new Error(`Failed to fetch customer data. Status: ${response.status}`);
            }

            // Parse and set the customer data
            this.customerData = await response.json();
        } catch (error) {
            console.log('check4'+error);
            // Handle fetch errors (network issues, request abortion, etc.)
            if (error.name === 'AbortError') {
                console.log('API request aborted.');
            } else if (error.message.includes('Failed to fetch')) {
                this.error = 'There was an issue connecting to the server. Please try again later.';
            } else {
                this.error = error.message; // Generic error handling
            }
        } finally {
            this.isLoading = false;
        }
    }

    // Handle the cleanup and abort when the component is removed from the DOM
    disconnectedCallback() {
        if (this.abortController) {
            this.abortController.abort();
        }
    }

    // Retry the API request if it fails
    handleRetry() {
        this.isRetrying = true;
        this.fetchCustomerData();
        this.isRetrying = false; // Set to false once the retry has been initiated
    }
}