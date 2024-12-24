import { LightningElement, track } from 'lwc';
import fetchPatients from '@salesforce/apex/PatientController.fetchPatients';

export default class patientLWC extends LightningElement {
    // Trackable properties to manage state and reactivity
    @track patients = []; // Array to hold patient data
    @track isLoading = false; // Tracks whether data is being loaded
    @track hasMoreData = true; // Tracks if more data is available for loading
    @track error; // Stores error messages, if any

    // Pagination and filtering parameters
    lastPatientId = null; // Tracks the last patient's ID for pagination
    limit1 = 15; // Number of patient records to fetch per batch
    userRole = 'Doctor'; // Example user role for filtering (can be dynamically set)
    department = 'Cardiology'; // Example department for filtering (can be dynamically set)

    // Lifecycle hook that runs when the component is inserted into the DOM
    connectedCallback() {
        this.loadPatients(); // Fetch the initial batch of patients
    }

    /**
     * Fetches a batch of patient data from the Apex controller.
     * Uses pagination (lastPatientId) and filtering (userRole, department).
     */
    async loadPatients() {
        // Prevent multiple simultaneous fetches or unnecessary fetches when no more data is available
        if (this.isLoading || !this.hasMoreData) {
            return;
        }
        this.isLoading = true; // Set loading indicator to true

        try {
            // Call the Apex method and pass parameters for pagination and filtering
            const data = await fetchPatients({
                lastPatientId: this.lastPatientId,
                limit1: this.limit1,
                userRole: this.userRole,
                department: this.department,
            });

            // Append the new data to the existing patients list
            this.patients = [...this.patients, ...data];
                console.log('patients...'+patients);
            // If fewer records than the limit are returned, it means there is no more data
            if (data.length < this.limit1) {
                this.hasMoreData = false;
            } else {
                // Update lastPatientId for the next batch
                this.lastPatientId = data[data.length - 1].patient.Id;
            }
        } catch (error) {
            // Handle errors and set the error message
            this.error = error.body ? error.body.message : error.message;
        } finally {
            this.isLoading = false; // Reset the loading indicator
        }
    }

    /**
     * Handles the scroll event on the patient list.
     * Triggers data loading when the user scrolls near the bottom.
     * @param {Event} event - The scroll event.
     */
    handleScroll(event) {
        // Destructure properties from the scroll event target
        const { scrollTop, scrollHeight, clientHeight } = event.target;

        // If the user scrolls near the bottom of the container, load more data
        if (scrollHeight - scrollTop <= clientHeight + 50) {
            this.loadPatients();
        }
    }
}