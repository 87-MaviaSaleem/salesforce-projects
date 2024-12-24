import { LightningElement, wire } from 'lwc';
import { refreshApex } from '@salesforce/apex'; // Import refreshApex to refresh data
import getContacts from '@salesforce/apex/ContactController.getContacts';
import deleteContact from '@salesforce/apex/ContactController.deleteContact';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

export default class ContactManager extends LightningElement {
    contacts = [];
    searchKey = '';
    noResults = false;
    currentPage = 1;
    pageSize = 10;
    contactsWireResult; // Store wire result to use refreshApex

    // Fetch contacts with @wire and store the result in contactsWireResult
    @wire(getContacts, { searchKey: '$searchKey', pageSize: '$pageSize', pageNumber: '$currentPage' })
    wiredContacts(result) {
        this.contactsWireResult = result;
        if (result.data) {
            this.contacts = result.data;
            this.noResults = result.data.length === 0;
        } else if (result.error) {
            this.contacts = [];
            this.noResults = true;
            this.showToast('Error', 'Error fetching contacts', 'error');
            console.error(result.error);
        }
    }

    // Add fetchContacts method here to be called in tests
    fetchContacts() {
        return getContacts({ searchKey: this.searchKey, pageSize: this.pageSize, pageNumber: this.currentPage })
            .then(data => {
                this.contacts = data;
                this.noResults = data.length === 0;
            })
            .catch(error => {
                this.contacts = [];
                this.noResults = true;
                this.showToast('Error', 'Error fetching contacts', 'error');
                console.error(error);
            });
    }

    // Handler for the delete button
    handleDeleteContact(event) {
        const contactId = event.target.dataset.contactId;  // Get the contact ID from the button's data attribute
        deleteContact({ contactId }) // Call Apex delete method
            .then(() => {
                // Refresh the wire service to fetch updated data
                return refreshApex(this.contactsWireResult);
            })
            .then(() => {
                this.showToast('Success', 'Contact deleted successfully', 'success');
            })
            .catch(error => {
                this.showToast('Error', 'Error deleting contact', 'error');
                console.error(error);
            });
    }

    // Helper method to show toast messages
    showToast(title, message, variant) {
        const event = new ShowToastEvent({
            title,
            message,
            variant,
        });
        this.dispatchEvent(event);
    }
}