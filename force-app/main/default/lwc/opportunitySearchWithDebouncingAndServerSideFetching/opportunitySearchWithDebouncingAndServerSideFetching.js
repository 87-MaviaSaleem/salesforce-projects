import { LightningElement, track } from 'lwc';
import searchOpportunities from '@salesforce/apex/OptimizedOppSearchController.searchOpportunities';

export default class OpportunitySearchWithDebouncingAndPagination extends LightningElement {
    @track searchKey = ''; // Default to blank to show all opportunities
    @track filteredResults = []; 
    @track currentPage = 1;
    @track pageSize = 10; 
    @track totalRecords = 0; 
    @track isLoading = false; 

    // Table columns
    @track columns = [
        { label: 'Opportunity Name', fieldName: 'Name', type: 'text' },
        { label: 'Stage', fieldName: 'StageName', type: 'text' },
        { label: 'Amount', fieldName: 'Amount', type: 'currency' },
        { label: 'Close Date', fieldName: 'CloseDate', type: 'date' }
    ];

    debounceTimer; 
    searchCache = {}; 

    // To disable the "Previous" button 
    get isPreviousDisabled() {
        return this.currentPage === 1;
    }

    // To disable the "Next" button 
    get isNextDisabled() {
        return this.currentPage * this.pageSize >= this.totalRecords;
    }

    // To get total pages 
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
        clearTimeout(this.debounceTimer);

        // Debounce to avoid frequent server calls
        this.debounceTimer = setTimeout(() => {
            this.currentPage = 1; 
            this.fetchOpportunities(); 
        }, 300);
    }

    // Fetch opportunities with pagination
    fetchOpportunities() {
        this.isLoading = true;

        searchOpportunities({ 
            searchKey: this.searchKey, 
            pageNumber: this.currentPage, 
            pageSize: this.pageSize 
        })
        .then(result => {
            this.filteredResults = result.opportunities;
            this.totalRecords = result.total;
            this.isLoading = false;
        })
        .catch(error => {
            console.error('Error fetching opportunities:', error);
            this.filteredResults = [];
            this.isLoading = false;
        });
    }

    // Handle "Next" page button 
    handleNextPage() {
        if (!this.isNextDisabled) {
            this.currentPage++;
            this.fetchOpportunities();
        }
    }

    // Handle "Previous" page button 
    handlePreviousPage() {
        if (!this.isPreviousDisabled) {
            this.currentPage--;
            this.fetchOpportunities();
        }
    }
}