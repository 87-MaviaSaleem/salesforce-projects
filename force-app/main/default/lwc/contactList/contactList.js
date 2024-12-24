import { LightningElement, wire, api, track } from 'lwc';
import { refreshApex } from '@salesforce/apex';
import getContacts from '@salesforce/apex/ContactController.getContacts';
import updateContacts from '@salesforce/apex/ContactController.updateContacts';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

const columns = [
    { label: 'Name', fieldName: 'Name' },
    { label: 'Email', fieldName: 'Email', editable: true },
    // Add other columns as needed
];

export default class ContactList extends LightningElement {
    @api recordId;
    @track contacts;
    @track error;
    @track errorMessage;
    @track draftValues = [];
    @track wiredContactResult;
    @track tableErrors;
    columns = columns;

    @wire(getContacts, { accountId: '$recordId' })
    wiredContacts(result) {
        this.wiredContactResult = result;
        const { data, error } = result;
        if (data) {
            this.contacts = data;
            this.error = undefined;
            this.errorMessage = undefined;
            this.tableErrors = undefined;
        } else if (error) {
            this.error = error;
            this.contacts = undefined;
            this.errorMessage = error.body.message;
        }
    }

    handleSave(event) {
        const updatedFields = event.detail.draftValues;

        updateContacts({ contacts: updatedFields })
            .then(() => {
                // Clear draft values
                this.draftValues = [];
                // Refresh the data
                return refreshApex(this.wiredContactResult);
            })
            .then(() => {
                this.error = undefined;
                this.errorMessage = undefined;
                this.tableErrors = undefined;
                this.dispatchEvent(
                    new ShowToastEvent({
                        title: 'Success',
                        message: 'Contacts updated successfully',
                        variant: 'success',
                    }),
                );
            })
            .catch(error => {
                this.error = error;
                const errorMessages = this.reduceErrors(error);
                this.errorMessage = errorMessages.join(', ');

                // Set errors on datatable
                const rowErrors = {};
                updatedFields.forEach(draft => {
                    rowErrors[draft.Id] = {
                        title: 'Error updating record',
                        messages: errorMessages,
                        fieldNames: ['Email'],
                    };
                });
                this.tableErrors = {
                    rows: rowErrors,
                };
            });
    }

    reduceErrors(error) {
        let errorMessages = [];
        // Extract error messages from various parts of the error object
        if (Array.isArray(error.body)) {
            error.body.forEach(e => {
                errorMessages.push(e.message);
            });
        } else if (error.body && error.body.message) {
            errorMessages.push(error.body.message);
        } else if (error.body && error.body.pageErrors && error.body.pageErrors.length > 0) {
            error.body.pageErrors.forEach(e => {
                errorMessages.push(e.message);
            });
        } else if (error.body && error.body.output && error.body.output.errors && error.body.output.errors.length > 0) {
            error.body.output.errors.forEach(e => {
                errorMessages.push(e.message);
            });
        } else if (error.message) {
            errorMessages.push(error.message);
        } else {
            errorMessages.push('Unknown error');
        }
        return errorMessages;
    }
}