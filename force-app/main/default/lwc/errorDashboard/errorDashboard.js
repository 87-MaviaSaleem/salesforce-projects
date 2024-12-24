import { LightningElement, track } from 'lwc';
import getErrorStatistics from '@salesforce/apex/ErrorMetricsController.getErrorStatistics';

export default class ErrorDashboard extends LightningElement {
    @track errorData; // Holds the data for the datatable
    @track errorMessage; // Holds the error message if the Apex call fails

    // Columns definition for the lightning-datatable
    columns = [
        { label: 'Error Message', fieldName: 'errorMessage', type: 'text' },
        { label: 'Severity', fieldName: 'severity', type: 'text' },
        { label: 'Count', fieldName: 'count', type: 'number' },
    ];

    // Lifecycle hook to load data when the component is initialized
    connectedCallback() {
        this.loadErrorStatistics();
    }

    // Fetch data from the Apex method
    loadErrorStatistics() {
        getErrorStatistics()
            .then(result => {
                console.log('Fetched data:', JSON.stringify(result));
                this.errorData = result; // Set the result to the datatable data
                this.errorMessage = undefined; // Clear any previous error message
            })
            .catch(error => {
                // Handle error scenario
                console.error('Error fetching data:', error);
                this.errorMessage = error.body ? error.body.message : error.message;
                this.errorData = undefined; // Clear previous data
            });
    }
}