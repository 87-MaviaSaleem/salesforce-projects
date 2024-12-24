import { LightningElement, wire, api } from 'lwc';
import { CurrentPageReference } from 'lightning/navigation';
import getAccountData from '@salesforce/apex/FinTechDataController.getAccountData';
import getTransactionHistory from '@salesforce/apex/FinTechDataController.getTransactionHistory';

export default class FinancialDashboard extends LightningElement {
    @api currentState = 'balance'; // Default state is 'balance'
    
    accountData; // Stores account data fetched from Apex
    transactionHistory; // Stores transaction data fetched from Apex
    error; // Stores error messages
    recordId; // Store the recordId from the current page context

    // Wire to fetch the current page reference and retrieve the recordId from URL parameters
    @wire(CurrentPageReference)
    setCurrentPageReference(currentPageReference) {
        console.log('Current Page Reference:', currentPageReference); // Log the entire page reference for debugging
        
        if (currentPageReference) {
            this.recordId = currentPageReference.attributes.recordId || null; 
            console.log('Record ID from Current Page Reference:', this.recordId);
            
            // Check if recordId is valid
            if (this.recordId) {
                // Fetch account and transaction data once the recordId is set
                this.fetchAccountData();
                this.fetchTransactionHistory();
            } else {
                console.log('Record ID is not available in page reference');
            }
        }
    }

    // Imperative method to fetch account data based on the recordId
    fetchAccountData() {
        if (this.recordId) {
            getAccountData({ accountId: this.recordId })
                .then((data) => {
                    this.accountData = data;
                    this.error = null; // Clear any previous errors
                    console.log('Account Data:', data);
                })
                .catch((error) => {
                    this.error = 'Failed to load account data.';
                    console.error('Error Fetching Account Data:', error);
                });
        }
    }

    // Imperative method to fetch transaction history based on the recordId
    fetchTransactionHistory() {
        if (this.recordId) {
            getTransactionHistory({ accountId: this.recordId })
                .then((data) => {
                    this.transactionHistory = data;
                    this.error = null; // Clear any previous errors
                    console.log('Transaction History:', data);
                })
                .catch((error) => {
                    this.error = 'Failed to load transaction history.';
                    console.error('Error Fetching Transaction History:', error);
                });
        }
    }

    // Getter to determine the current view state (either balance or transaction)
    get isBalanceView() {
        return this.currentState === 'balance';
    }

    get isTransactionView() {
        return this.currentState === 'transactions';
    }

    // Handler to change to balance view
    handleStateChangeBalance() {
        this.currentState = 'balance'; // Update the state to show account information
    }

    // Handler to change to transactions view
    handleStateChangeTransactions() {
        this.currentState = 'transactions'; // Update the state to show transaction history
    }
}