import { LightningElement, track } from 'lwc';
import searchOpportunities from '@salesforce/apex/OptimizedOppSearchController.searchOpportunities';

export default class OpportunitySearchWithDebouncingAndServerSideFetching extends LightningElement {
    @track filteredResults = [];

    // Opportunity Columns to be displayed in the Data Table
    @track columns = [
        { label: 'Opportunity Name', fieldName: 'Name', type: 'text' },
        { label: 'Stage', fieldName: 'StageName', type: 'text' },
        { label: 'Amount', fieldName: 'Amount', type: 'currency' },
        { label: 'Close Date', fieldName: 'CloseDate', type: 'date' }
    ];

    // Timer for Debouncing
    debounceTimer; 

    // Caching to avoid redundant server calls
    searchCache = {}; 

    // Optimized Search Logic
    handleSearch(event) {
        const searchKey = event.target.value.trim().toLowerCase();

        // Debounce implementation to delay the processing
        clearTimeout(this.debounceTimer);
        this.debounceTimer = setTimeout(() => {
            if (this.searchCache[searchKey]) {

                // If cached, use the cached results
                this.filteredResults = this.searchCache[searchKey];

            } else {

                // Otherwise, fetch results from the server
                this.fetchOpportunities(searchKey);

            }
        }, 300);
    }

    fetchOpportunities(query) {
        searchOpportunities({ searchKey: query })
            .then(results => {

                // Cache the results
                this.searchCache[query] = results; 
                this.filteredResults = results;

            })
            .catch(error => {

                console.error('Error faced while fetching the search results:', error);
                this.filteredResults = [];

            });
    }
}
