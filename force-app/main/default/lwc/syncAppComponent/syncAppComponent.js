import { LightningElement, wire, track } from 'lwc'; // Import necessary modules from LWC
import getUsers from '@salesforce/apex/SyncAppController.getUsers'; // Import Apex method to fetch users
import syncWithExternalSystem from '@salesforce/apex/SyncAppController.syncWithExternalSystem'; // Import Apex method to sync data with an external system
import exportToCSV from '@salesforce/apex/SyncAppController.exportToCSV'; // Import Apex method to export data to CSV

export default class SyncAppComponent extends LightningElement {
    @track userData = []; // Tracks the user data fetched from the server
    @track errorMessage = ''; // Tracks any error messages that occur
    @track loading = false; // Tracks the loading state of the component
    @track currentPage = 1; // Tracks the current page number for pagination
    @track pageSize = 10; // Number of records per page (pagination size)
    @track totalRecords = 0; // Tracks the total number of records fetched

    // Fetches user data from Apex method using wire service
    @wire(getUsers, { pageNumber: '$currentPage', pageSize: '$pageSize' })
    wiredUsers({ data, error }) {
        if (data) {
            console.log('Fetched Users:', data.records); // Logs fetched user records
            console.log('Total Records:', data.totalRecords); // Logs the total number of records
            this.userData = data.records; // Sets the user data from the response
            this.totalRecords = data.totalRecords; // Sets the total record count for pagination
            this.errorMessage = ''; // Clears any previous error messages
        } else if (error) {
            console.error('Error fetching users:', error.body.message); // Logs the error
            this.errorMessage = `Error fetching users: ${error.body.message}`; // Sets the error message
        }
    }

    // Calculates the total number of pages based on total records and page size
    get totalPages() {
        return Math.ceil(this.totalRecords / this.pageSize); // Returns the total number of pages
    }

    // Returns the current set of paginated data based on the current page and page size
    get paginatedData() {
        const start = (this.currentPage - 1) * this.pageSize; // Calculate the start index
        const end = start + this.pageSize; // Calculate the end index
        return this.userData.slice(start, end); // Returns the slice of user data for the current page
    }

    // Determines if the "Next" button should be disabled (if on the last page)
    get isNextDisabled() {
        return this.currentPage >= this.totalPages; // Disables "Next" if on the last page
    }

    // Determines if the "Previous" button should be disabled (if on the first page)
    get isPreviousDisabled() {
        return this.currentPage <= 1; // Disables "Previous" if on the first page
    }

    // Handles the "Next" button click for pagination, increments the current page
    handleNextPage() {
        if (this.currentPage < this.totalPages) {
            this.currentPage++; // Increments the current page number
        }
    }

    // Handles the "Previous" button click for pagination, decrements the current page
    handlePreviousPage() {
        if (this.currentPage > 1) {
            this.currentPage--; // Decrements the current page number
        }
    }

    // Handles syncing data with the external system
    handleSyncData() {
        this.loading = true; // Shows the loading spinner
        syncWithExternalSystem()
            .then(() => {
                this.loading = false; // Hides the loading spinner after successful sync
            })
            .catch(error => {
                this.loading = false; // Hides the loading spinner in case of an error
                this.errorMessage = `Error syncing data: ${error.body.message}`; // Sets the error message
            });
    }

    // Handles exporting data to CSV
    handleExportCSV() {
        this.loading = true; // Shows the loading spinner
        exportToCSV({ userData: this.userData }) // Calls the Apex method to export the user data
            .then(result => {
                this.loading = false; // Hides the loading spinner after successful export
                // Creates a temporary link element to trigger the file download
                const link = document.createElement('a');
                link.href = 'data:text/csv;charset=utf-8,' + encodeURI(result); // Encodes CSV data for download
                link.target = '_blank'; // Opens the link in a new tab
                link.download = 'user_data.csv'; // Sets the filename for the downloaded file
                link.click(); // Triggers the download
            })
            .catch(error => {
                this.loading = false; // Hides the loading spinner in case of an error
                this.errorMessage = `Error exporting data: ${error.body.message}`; // Sets the error message
            });
    }
}