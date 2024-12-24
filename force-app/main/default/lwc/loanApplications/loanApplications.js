import { LightningElement, wire, api } from 'lwc';
import getLoanApplications from '@salesforce/apex/LoanApplicationController.getLoanApplications';
import updateLoanStatus from '@salesforce/apex/LoanApplicationController.updateLoanStatus';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import { refreshApex } from '@salesforce/apex';

export default class LoanApplications extends LightningElement {
    @api customerId;
    loanApplications = [];

    // Picklist options for 'Change Status' column
    statusOptions = [
        { label: 'In Progress', value: 'In Progress' },
        { label: 'Approved', value: 'Approved' },
        { label: 'Rejected', value: 'Rejected' }
    ];

    // Columns definition for the lightning-datatable
    columns = [
        { label: 'Loan Amount', fieldName: 'Loan_Amount__c', type: 'currency' },
        { label: 'Loan Type', fieldName: 'Loan_Type__c' },
        { label: 'Status', fieldName: 'Application_Status__c' },
        {
            label: 'Change Status',
            type: 'picklist',
            fieldName: 'Application_Status__c',
            typeAttributes: {
                placeholder: 'Select Status',
                options: this.statusOptions,
                value: { fieldName: 'Application_Status__c' },
                onchange: this.handleStatusChange
            }
        }
    ];

    // Wire the loan application data from the Apex method
    @wire(getLoanApplications, { customerId: '$customerId' })
    wiredLoanApplications({ error, data }) {
        if (data) {
            this.loanApplications = data;
        } else if (error) {
            console.error('Error fetching loan applications:', error);
        }
    }

    // Handle the change in loan status from the picklist dropdown
    handleStatusChange(event) {
        const loanApplicationId = event.target.dataset.id;
        const newStatus = event.target.value;

        updateLoanStatus({ loanApplicationId, newStatus })
            .then(() => {
                // After updating the loan status, refresh the loan application list
                this.showToast('Success', 'Loan status updated', 'success');
                // Refresh the Apex wire data to fetch updated loan applications
                return refreshApex(this.wiredLoanApplications);
            })
            .catch(error => {
                this.showToast('Error', 'Failed to update loan status', 'error');
                console.error(error);
            });
    }

    // Utility function to display toast messages
    showToast(title, message, variant) {
        const event = new ShowToastEvent({
            title,
            message,
            variant
        });
        this.dispatchEvent(event);
    }
}