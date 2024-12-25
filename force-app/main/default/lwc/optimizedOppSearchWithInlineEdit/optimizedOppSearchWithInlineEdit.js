import { LightningElement, track } from 'lwc';
import searchOpportunities from '@salesforce/apex/OptimizedOppSearchAndEditController.searchOpportunities';
import { updateRecord } from 'lightning/uiRecordApi';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

export default class OptimizedOppSearchWithPaginationAndInlineEdit extends LightningElement {
    @track filteredResults = []; // Data to display in the table
    @track draftValues = []; // Tracks inline edits
    @track currentPage = 1; // Current page number
    @track pageSize = 10; // Number of records per page
    @track totalRecords = 0; // Total matching records
    @track isLoading = false; // Spinner state
    @track searchKey = ''; // Search input value (empty to show all opportunities initially)

    // Columns for the table with inline editing enabled
    @track columns = [
        { label: 'Opportunity Name', fieldName: 'Name', type: 'text', editable: true },
        { label: 'Stage', fieldName: 'StageName', type: 'text', editable: true },
        { label: 'Amount', fieldName: 'Amount', type: 'currency', editable: true },
        { label: 'Close Date', fieldName: 'CloseDate', type: 'date' }
    ];

    debounceTimer; // Timer for debounce logic
    searchCache = {}; // Caches search results for efficiency

    // Computed properties for disabling pagination buttons
    get isPreviousDisabled() {
        return this.currentPage === 1;
    }

    get isNextDisabled() {
        return this.currentPage * this.pageSize >= this.totalRecords;
    }

    get totalPages() {
        return Math.ceil(this.totalRecords / this.pageSize);
    }

    get isFilterRecordAvailable() {
        return this.filteredResults.length > 0;
    }

    // Fetch opportunities when the component loads
    connectedCallback() {
        this.fetchOpportunities(); // Fetch all opportunities initially
    }

    // Handle search input with debouncing
    handleSearch(event) {
        const searchKey = event.target.value.trim().toLowerCase();
        this.searchKey = searchKey; 

        // Reset debounce timer
        clearTimeout(this.debounceTimer); 
        this.debounceTimer = setTimeout(() => {
            this.currentPage = 1; 
            this.fetchOpportunities(); 
        }, 300); // Debounce delay
    }

    // Fetch opportunities with pagination and search
    fetchOpportunities() {
        this.isLoading = true; // Show spinner

        searchOpportunities({ 
            searchKey: this.searchKey, 
            pageNumber: this.currentPage, 
            pageSize: this.pageSize 
        })
        .then(result => {
            this.filteredResults = result.opportunities;
            this.totalRecords = result.total;
            this.isLoading = false; // Hide spinner
        })
        .catch(error => {
            console.error('Error fetching opportunities:', error);
            this.filteredResults = [];
            this.isLoading = false; // Hide spinner
        });
    }

    // Handle next page button
    handleNextPage() {
        if (!this.isNextDisabled) {
            this.currentPage++;
            this.fetchOpportunities();
        }
    }

    // Handle previous page button
    handlePreviousPage() {
        if (!this.isPreviousDisabled) {
            this.currentPage--;
            this.fetchOpportunities();
        }
    }

    // Handle inline edits
    handleSave(event) {
        this.draftValues = event.detail.draftValues; 

        // Prepare updates for each edited record
        const updatePromises = this.draftValues.map(draft => {
            const fields = Object.assign({}, draft);
            return updateRecord({ fields });
        });

        Promise.all(updatePromises)
            .then(() => {
                // Success toast
                this.dispatchEvent(
                    new ShowToastEvent({
                        title: 'Success',
                        message: 'Records updated successfully!',
                        variant: 'success'
                    })
                );

                this.draftValues = []; // Clear draft values
                this.fetchOpportunities(); // Refresh the table
            })
            .catch(error => {
                // Error toast
                this.dispatchEvent(
                    new ShowToastEvent({
                        title: 'Error',
                        message: `Error updating records: ${error.body.message}`,
                        variant: 'error'
                    })
                );
            });
    }
}