import { LightningElement, track, wire } from 'lwc';
import getSortedAccounts from '@salesforce/apex/AccountController.getFilteredSortedAccounts';

export default class demo extends LightningElement {
    @track accounts = []; // Stores the account data
    @track sortedBy = 'Name'; // Default column for sorting
    @track sortOrder = 'asc'; // Default sorting direction

    // Columns for the Lightning Datatable
    columns = [
        { label: 'Name', fieldName: 'Name', sortable: true },
        { label: 'Industry', fieldName: 'Industry', sortable: true },
        { label: 'Created Date', fieldName: 'CreatedDate', type: 'date', sortable: true },
    ];

    // Fetch sorted data from Apex
    @wire(getSortedAccounts, { sortBy: '$sortedBy', sortOrder: '$sortOrder' })
    wiredAccounts({ data, error }) {
        if (data) {
            this.accounts = data;
        } else if (error) {
            console.error('Error fetching sorted accounts:', error);
        }
    }

    // Handle sorting
    handleSort(event) {
        const { fieldName: sortedBy, sortDirection } = event.detail;
        this.sortedBy = sortedBy;
        this.sortOrder = sortDirection;
    }
}