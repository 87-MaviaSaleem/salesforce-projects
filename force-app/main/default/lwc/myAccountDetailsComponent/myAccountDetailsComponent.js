import { LightningElement, api, wire } from 'lwc';
import getAccountDetails from '@salesforce/apex/AccountController.getAccountDetails';

export default class MyAccountDetailsComponent extends LightningElement {
    @api accountId; // Public property to receive accountId from parent
    accountData;
    error;
    isLoading = false;

    // Private property for internal use
    _accountId;

    // Getter and setter for accountId to detect changes
    get accountId() {
        return this._accountId;
    }

    set accountId(value) {
        // If accountId changes, trigger data fetch
        if (value !== this._accountId) {
            this._accountId = value;
            this.fetchAccountDetails();  // Fetch new data whenever accountId changes
        }
    }

    // Fetch account details from Apex when accountId is set
    fetchAccountDetails() {
        if (!this.accountId) {
            return; // Don't fetch if accountId is not defined
        }

        this.isLoading = true;
        this.error = null; // Reset previous errors

        // Call Apex method to fetch account data
        getAccountDetails({ accountId: this.accountId })
            .then((result) => {
                this.accountData = result;
                this.isLoading = false;
            })
            .catch((error) => {
                this.error = error.body.message || 'An error occurred while fetching account details';
                this.isLoading = false;
            });
    }

    // React to changes after the component has rendered
    renderedCallback() {
        console.log('Component has rendered or re-rendered');
        if (this.accountData) {
            // Any additional logic after the component has rendered
        }
    }

    // Initial data fetch when the component is inserted into the DOM
    connectedCallback() {
        console.log('Component connected to the DOM');
        if (this.accountId) {
            this.fetchAccountDetails();  // Fetch data on initial load if accountId is available
        }
    }
}