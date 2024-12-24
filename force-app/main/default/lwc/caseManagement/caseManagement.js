import { LightningElement, wire } from 'lwc';
import getActiveCases from '@salesforce/apex/CaseController.getActiveCases';
import updateCaseStatus from '@salesforce/apex/CaseController.updateCaseStatus';
import updateCasePriority from '@salesforce/apex/CaseController.updateCasePriority';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

export default class CaseManagement extends LightningElement {
    cases = [];
    error;
    selectedStatus = '';  // Default is empty (show all cases)
    statusOptions = [
        { label: 'All', value: '' },
        { label: 'New', value: 'New' },
        { label: 'In Progress', value: 'In Progress' },
        { label: 'Closed', value: 'Closed' }
    ];

    columns = [
        { label: 'Case Number', fieldName: 'CaseNumber' },
        { label: 'Subject', fieldName: 'Subject' },
        { label: 'Status', fieldName: 'Status', editable: true, type: 'text' },
        { label: 'Priority', fieldName: 'Priority', editable: true, type: 'text' },
        { label: 'Owner', fieldName: 'Owner.Name' }  // Additional column for owner's name
    ];

    // Wire the Apex method to fetch active cases
    @wire(getActiveCases, { statusFilter: '$selectedStatus' })
    wiredCases({ error, data }) {
        if (data) {
            this.cases = data;
        } else if (error) {
            this.handleError(error);
        }
    }

    // Handle case status change from combobox
    handleStatusChange(event) {
        this.selectedStatus = event.detail.value;
    }

    // Handle changes in datatable cells (Status and Priority)
    handleCellChange(event) {
        const draftValues = event.detail.draftValues;
        const updatedFields = draftValues[0];

        if (updatedFields.Status) {
            this.updateStatus(updatedFields.Id, updatedFields.Status);
        }

        if (updatedFields.Priority) {
            this.updatePriority(updatedFields.Id, updatedFields.Priority);
        }
    }

    // Update case status via Apex
    updateStatus(caseId, newStatus) {
        updateCaseStatus({ caseId, newStatus })
            .then(() => this.showToast('Success', 'Status updated successfully', 'success'))
            .catch(error => this.handleError(error));
    }

    // Update case priority via Apex
    updatePriority(caseId, newPriority) {
        updateCasePriority({ caseId, newPriority })
            .then(() => this.showToast('Success', 'Priority updated successfully', 'success'))
            .catch(error => this.handleError(error));
    }

    // Handle errors and display appropriate toast messages
    handleError(error) {
        let message = 'An unknown error occurred.';
        let variant = 'error';

        if (error.body && error.body.message) {
            if (error.body.message.includes('Permission Error')) {
                message = 'You do not have permission to access this case or update it.';
            } else if (error.body.message.includes('Invalid Status')) {
                message = 'The selected status is not valid. Please choose a valid status.';
            } else if (error.body.message.includes('Invalid Priority')) {
                message = 'The selected priority is not valid. Please choose a valid priority.';
            } else {
                message = error.body.message;
            }
        }

        this.showToast('Error', message, variant);
    }

    // Display toast message
    showToast(title, message, variant) {
        this.dispatchEvent(
            new ShowToastEvent({
                title,
                message,
                variant
            })
        );
    }
}