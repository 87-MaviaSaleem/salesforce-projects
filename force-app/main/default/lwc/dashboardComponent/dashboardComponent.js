// dashboardComponent.js
import { LightningElement, track } from 'lwc';

export default class DashboardComponent extends LightningElement {
    @track data = [];  // To store the user data
    @track isLoading = false;  // Track the loading state
    @track errorMessage = '';  // Track error messages

    // Getter for conditionally rendering 'No Data' message
    get isNoData() {
        return this.data.length === 0 && !this.isLoading;
    }

    async connectedCallback() {
        this.isLoading = true;  // Show loading spinner
        await this.fetchData();  // Fetch user data when component is initialized
    }

    async fetchData() {
        try {
            const response = await fetch('https://jsonplaceholder.typicode.com/users');  // Fetch user data from API

            console.log('API Response:', response);  // Log full response for debugging

            // if (response.ok) {
            //     const result = await response.json();  // Parse the JSON response
            //     console.log('Fetched data:', result);  // Log the fetched data for debugging
            //     this.data = result;  // Store the fetched data
            // } else {
            //     this.errorMessage = `Failed to fetch data from the server. Status: ${response.status}`;
            //     console.error('Error fetching data:', response);
            // }
        } catch (error) {
            this.errorMessage = 'Error fetching data. Please try again later.';
            //console.error('Error fetching data', error);
        } finally {
            //this.isLoading = false;  // Hide the loading spinner
        }
    }
}