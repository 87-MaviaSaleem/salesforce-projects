import { LightningElement, wire, track } from 'lwc';
import getAccounts from '@salesforce/apex/AccountController.getAccounts'; 
export default class AccountDataTable extends LightningElement {

    // To store the accounts
    @track accounts; 

    // Datatable column configuration
    @track columns = [
        { label: 'Name', fieldName: 'Name', sortable: true },
        { label: 'Industry', fieldName: 'Industry'},
        { label: 'Annual Revenue', fieldName: 'AnnualRevenue', type: 'currency', sortable: true },
        
    ];
    @track sortedBy; 
    @track sortedDirection = 'asc'; 

    // Wire service to fetch accounts using the Apex method
    @wire(getAccounts)
    wiredAccounts({ error, data }) {
        if (data) {
            this.accounts = data;
        } else if (error) {
            console.error('Error fetching accounts:', error);
        }
    }
    
    // Handle column sorting
    handleSort(event) {
        const { fieldName: sortedBy, sortDirection } = event.detail;
        this.sortedBy = sortedBy;
        this.sortedDirection = sortDirection;
        this.sortData(sortedBy, sortDirection);
    }
    // Sort the data
    sortData(fieldname, direction) {
        let parseData = JSON.parse(JSON.stringify(this.accounts));
        let keyValue = (a) => {
            return a[fieldname];
        };
        let isReverse = direction === 'asc' ? 1 : -1;
        parseData.sort((x, y) => {
            x = keyValue(x) ? keyValue(x) : ''; // Handle undefined values
            y = keyValue(y) ? keyValue(y) : '';
            return isReverse * ((x > y) - (y > x));
        });
        this.accounts = parseData;
    }
}