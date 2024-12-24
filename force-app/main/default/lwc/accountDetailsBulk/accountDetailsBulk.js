import { LightningElement, api, track } from 'lwc';
import getAccountAndContacts from '@salesforce/apex/AccountDetailsController.getAccountAndContacts';

export default class AccountDetailsBulk extends LightningElement {
    @api recordId; // The Account ID passed from the page context
    @track accountData = {}; // Holds Account and Contacts data
    @track error; // Error message
    @track isLoading = true; // Loading state

    columns = [
        { label: 'First Name', fieldName: 'FirstName' },
        { label: 'Last Name', fieldName: 'LastName' },
        { label: 'Email', fieldName: 'Email' },
        { label: 'Phone', fieldName: 'Phone' }
    ];
    // On component load, fetch the account and related contacts
    connectedCallback() {
        if (this.recordId) {
            this.fetchAccountDetails();
        }
    }

    // Fetch Account details and related Contacts from Apex
    fetchAccountDetails() {
        this.isLoading = true;
        getAccountAndContacts({ accountId: this.recordId })
            .then((result) => {
                // Store Account and Contacts data
                this.accountData = result;
                console.log(this.accountData);
                this.error = null;
            })
            .catch((error) => {
                // Handle any error in the data fetch
                this.error = 'Error fetching data: ' + error.body.message;
                this.accountData = {};
            })
            .finally(() => {
                // Hide the loading spinner once data is fetched
                this.isLoading = false;
            });
    }
}