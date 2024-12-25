import { LightningElement, track, wire } from 'lwc';
import getContacts from '@salesforce/apex/PaginatedContactControllerWithEditSort.getContacts';
import { updateRecord } from 'lightning/uiRecordApi';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

export default class PaginatedContactWithInlineEditAndSort extends LightningElement {
@track contacts = []; 
@track draftValues = []; 
@track currentPage = 1; 
@track pageSize = 10; 
@track totalContacts = 0; 
@track isLoading = false; 

//Default Values
sortBy = 'Name';
sortDirection = 'desc';

// Contact Columns with Inline Editing
@track columns = [
    { label: 'Contact Name', fieldName: 'Name', type: 'text', editable: true, sortable: true },
    { label: 'Phone', fieldName: 'Phone', type: 'phone', editable: true, sortable: true },
    { label: 'Email', fieldName: 'Email', type: 'email', editable: true, sortable: true },
    { label: 'Department', fieldName: 'Department', type: 'text', editable: true, sortable: true }
];

// Disable Previous Button
get isPreviousDisabled() {
    return this.currentPage === 1;
}

// Disable Next Button
get isNextDisabled() {
    return this.currentPage * this.pageSize >= this.totalContacts;
}

// Calculate Total Pages
get totalPages() {
    return Math.ceil(this.totalContacts / this.pageSize);
}

// Check if there are records available
get isFilterRecordAvailable() {
    return this.contacts.length > 0;
}

@wire(getContacts, { pageNumber: '$currentPage', pageSize: '$pageSize', sortBy : '$sortBy', sortDirection : '$sortDirection' })
wiredContacts(result) {
    if (result.data) {
        this.contacts = result.data.contacts;
        this.totalContacts = result.data.total;
        this.isLoading = false;
    } else if (result.error) {
        console.error('Error fetching contacts:', result.error);
        this.isLoading = false;
        this.showToast('Error', 'Failed to fetch contacts.', 'error');
    }
}

// Handle Next Page
handleNextPage() {
    if (!this.isNextDisabled) {
        this.isLoading = true;
        this.currentPage++;
    }
}

// Handle Previous Page
handlePreviousPage() {
    if (!this.isPreviousDisabled) {
        this.isLoading = true;
        this.currentPage--;
    }
}

// Handle Inline Edits
handleSave(event) {
    this.draftValues = event.detail.draftValues; 

    const updatePromises = this.draftValues.map(draft => {
        const fields = Object.assign({}, draft); 
        return updateRecord({ fields });
    });

    Promise.all(updatePromises)
        .then(() => {
            // Show success toast
            this.showToast('Success', 'Records updated successfully!', 'success');
            this.draftValues = []; 
        })
        .catch(error => {
            let errorMessage = 'An unknown error occurred.';
            if (error.body && error.body.message) {
                errorMessage = error.body.message; 
            } else if (error.message) {
                errorMessage = error.message; 
            }

            // Show error toast
            this.showToast('Error', `Error updating records: ${errorMessage}`, 'error');
        });
}

//Handling the sort event by updating the sortBy and sortDirection variables
handleSort(event) {
this.sortBy = event.detail.fieldName;
this.sortDirection = event.detail.sortDirection;
}

// Show Toast Notifications
showToast(title, message, variant) {
    const toastEvent = new ShowToastEvent({ title, message, variant });
    this.dispatchEvent(toastEvent);
}
}
