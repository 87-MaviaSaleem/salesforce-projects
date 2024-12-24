import { LightningElement, wire, track } from 'lwc';
import getPaginatedLeads from '@salesforce/apex/LeadService.getPaginatedLeads';

export default class LeadSpinnerList extends LightningElement {
    @track leads = []; // Holds the list of leads
    @track isLoading = true; // Spinner control
    @track offset = 0; // Current offset for pagination
    @track limit1 = 10; // Number of records per page
    @track statusFilter = ''; // Status filter for leads
    @track hasNextPage = true; // Indicates if there are more pages
    @track error = null; // Holds error messages
    @track currentPage = 1; // Current page number
    @track totalPages = 0; // Total number of pages
    @track lastRefreshTime = null; // Tracks the last refresh time

    get options() {
        return [
            { label: 'Open - Not Contacted', value: 'Open - Not Contacted' },
            { label: 'Working - Contacted', value: 'Working - Contacted' },
            { label: 'Active', value: 'Active' },
        ];
    }
    // Wire the Apex method to fetch leads
    @wire(getPaginatedLeads, { statusFilter: '$statusFilter', offset: '$offset', limit1: '$limit1' })
    wiredLeads({ error, data }) {
        if (data) {
            this.leads = data; // Update the leads list
            this.isLoading = false; // Hide spinner
            this.hasNextPage = data.length === this.limit1; // Determine if there are more leads
            this.error = null; // Clear any previous errors
            this.updatePagination(); // Update pagination information
        } else if (error) {
            this.leads = [];
            this.isLoading = false; // Hide spinner on error
            this.error = error; // Store the error
        }
    }

    // Update pagination information
    updatePagination() {
        this.currentPage = Math.floor(this.offset / this.limit1) + 1;
        this.totalPages = this.hasNextPage ? this.currentPage + 1 : this.currentPage;
    }

    // Handle status filter change
    handleStatusChange(event) {
        this.statusFilter = event.target.value; // Update the status filter
        this.offset = 0; // Reset pagination to the first page
        this.isLoading = true; // Show spinner while data reloads
    }

    // Handle refreshing the leads list
    handleRefresh() {
        this.offset = 0; // Reset to the first page
        this.isLoading = true; // Show spinner while data reloads
        this.lastRefreshTime = new Date().toLocaleTimeString(); // Update refresh time
    }

    // Load the next page of leads
    handleNextPage() {
        if (this.hasNextPage) {
            this.offset += this.limit1; // Move to the next page
            this.isLoading = true; // Show spinner while data reloads
        }
    }

    // Load the previous page of leads
    handlePrevPage() {
        if (this.offset > 0) {
            this.offset -= this.limit1; // Move to the previous page
            this.isLoading = true; // Show spinner while data reloads
        }
    }

    // Utility to check if the "Previous" button should be disabled
    get disablePrev() {
        return this.offset === 0;
    }

    // Utility to check if the "Next" button should be disabled
    get disableNext() {
        return !this.hasNextPage;
    }
}