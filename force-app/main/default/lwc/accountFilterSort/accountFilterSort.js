import { LightningElement, track, wire } from 'lwc';
import getSearchFilterSort from '@salesforce/apex/AccountSearchFilterSortController.getSearchFilterSort';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

export default class accountFilterSort extends LightningElement {
    @track accounts = [];  // Stores the list of accounts
    @track searchValue = ''; // Search value for Account Name
    @track selectedIndustry = ''; // Selected Industry for filtering
    
    // Sorting State
    @track sortedBy = 'Name'; // Currently sorted column
    @track sortDirection = 'asc'; // Current sort direction

    // Industry filter options (mocked for simplicity, should come from Salesforce)
    industryOptions = [
        { label: 'Technology', value: 'Technology' },
        { label: 'Finance', value: 'Finance' },
        { label: 'Healthcare', value: 'Healthcare' },
        { label: 'Manufacturing', value: 'Manufacturing' }
    ];

    columns = [
        { label: 'Name', fieldName: 'Name', sortable: true },
        { label: 'Industry', fieldName: 'Industry', sortable: true },
        { label: 'Created Date', fieldName: 'CreatedDate', type: 'date', sortable: true }
    ];

    // Wire method to fetch filtered and sorted data from Apex
    @wire(getSearchFilterSort, { 
        accountName: '$searchValue', 
        industry: '$selectedIndustry', 
        sortBy: '$sortedBy', 
        sortOrder: '$sortDirection'
    })
    wiredAccounts({ data, error }) {
        if (data) {
            this.accounts = data;
            if (data.length === 0) {
                this.showToast('No Records Found', 'No matching accounts found.', 'info');
            }
        } else if (error) {
            this.showToast('Error', 'An error occurred while fetching accounts.', 'error');
        }
    }

    // Handle search input change (by Account Name)
    handleSearch(event) {
        this.searchValue = event.target.value;
    }

    // Handle industry filter change
    handleIndustryFilter(event) {
        this.selectedIndustry = event.target.value;
    }

    // Sort handler for lightning-datatable
    onHandleSort(event) {
        const { fieldName: sortedBy, sortDirection } = event.detail;
        this.sortedBy = sortedBy;
        this.sortDirection = sortDirection;
    }

    // Show toast notifications
    showToast(title, message, variant) {
        const evt = new ShowToastEvent({ title, message, variant });
        this.dispatchEvent(evt);
    }
}