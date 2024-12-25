import { LightningElement, track, wire } from 'lwc';
import getContacts from '@salesforce/apex/PaginatedContactController.getContacts';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

export default class PaginatedContacts extends LightningElement {

    @track contacts = [];
    @track currentPage = 1;
    @track pageSize = 10;
    @track totalContacts = 0;
    @track isLoading = false;
    
    // Contacts Columns to be displayed in the Data Table
    @track columns = [
        { label: 'Contact Name', fieldName: 'Name', type: 'text' },
        { label: 'Phone', fieldName: 'Phone', type: 'phone' },
        { label: 'Email', fieldName: 'Email', type: 'email' },
        { label: 'Department', fieldName: 'Department', type: 'text' }
    ];

    // To disable the "Previous" button 
    get isPreviousDisabled(){
        return this.currentPage === 1;
    }

    // To disable the "Next" button
    get isNextDisabled(){
        return this.currentPage * this.pageSize >= this.totalContacts;
    }

    // To calculate total no. of pages
    get totalPages(){
        return Math.ceil(this.totalContacts / this.pageSize);
    }

    // To calculate the offset for the current page
    get offset(){
        return (this.currentPage - 1) * this.pageSize;
    }

    get isFilterRecordAvailable(){
        return this.contacts.length > 0;
    }

    
    @wire(getContacts, { pageNumber: '$currentPage', pageSize: '$pageSize' })
    wiredContacts(result) {
        if (result.data) {

            this.contacts = result.data.contacts;
            this.totalContacts = result.data.total;
            this.isLoading = false;

            
        } else if (result.error) {

            console.error('Error faced while fetching the contacts:', error);
            this.isLoading = false;
            this.showToast('Error', 'Failed to fetch the contacts.', 'error');

        }
    }
    

    // Handle the "Next Page" button
    handleNextPage() {
        if (this.currentPage * this.pageSize < this.totalContacts) {
            this.isLoading = true;
            this.currentPage++;
        }
    }

    // Handle the "Previous Page" button
    handlePreviousPage() {
        if (this.currentPage > 1) {
            this.isLoading = true;
            this.currentPage--;
        }
    }


    // To show toast messages
    showToast(title, message, variant) {
        const event = new ShowToastEvent({
            title, message, variant
        });
        this.dispatchEvent(event);
    }
}