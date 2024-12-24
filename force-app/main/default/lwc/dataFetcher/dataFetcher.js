import { LightningElement, track } from 'lwc';
import fetchDataWithRetries from '@salesforce/apex/ApiBestPractices.fetchDataWithRetries'; // Import Apex method to fetch data
import isApiLimitAvailable from '@salesforce/apex/ApiBestPractices.isApiLimitAvailable'; // Import Apex method to check API limit availability
import logError from '@salesforce/apex/ApiBestPractices.logError'; // Import Apex method to log errors

export default class DataFetcher extends LightningElement {
    @track data;  // Variable to store fetched data
    @track error; // Variable to store error messages

    // Lifecycle hook: Executes when the component is inserted into the DOM
    connectedCallback() {
        this.fetchData(); // Initiate the data fetching process when the component is loaded
    }

    // Method to fetch data with retries and handle errors
    async fetchData() {
        try {
            // First, check if there are available API callouts before proceeding
            const isLimitOk = await isApiLimitAvailable();
            if (!isLimitOk) {
                // If API limit is exceeded, display an error and log it
                this.error = 'API limit exceeded. Please try again later.';
                await logError({ message: this.error });
                return; // Stop execution if the API limit is exceeded
            }

            // Proceed to fetch data with retries if the API limit is available
            const result = await fetchDataWithRetries({ endpoint: 'https://example.com/api', maxRetries: 3 });
            this.data = result; // Store the successful result in the `data` property
        } catch (error) {
            // Handle any errors during the fetch process
            this.error = error.body ? error.body.message : error.message;
            await logError({ message: this.error }); // Log the error message
        }
    }
}