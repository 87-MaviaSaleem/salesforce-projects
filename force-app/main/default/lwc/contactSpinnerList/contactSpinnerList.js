import { LightningElement, wire } from 'lwc';
import getAllContacts from '@salesforce/apex/ContactController1.getAllContacts';

export default class ContactSpinnerList extends LightningElement {
    contacts = [];
    isLoading = true;
    offset = 0;
    limit1 = 10; // Number of records per page
    hasNextPage = true;
    searchTerm = '%';

    // Computed properties for button states
    get isPreviousDisabled() {
        return this.offset === 0 || this.isLoading;
    }

    get isNextDisabled() {
        return !this.hasNextPage || this.isLoading;
    }

    @wire(getAllContacts, { offset: '$offset', limit1: '$limit1', searchTerm: '$searchTerm' })
    wiredContacts({ error, data }) {
        if (data) {
            this.contacts = data;
            this.isLoading = false;
            this.hasNextPage = data.length === this.limit1;
        } else if (error) {
            this.isLoading = false;
            console.error(error);
        }
    }

    handleSearchChange(event) {
        // Update the raw search term as entered by the user
        this.rawSearchTerm = event.target.value.trim();
        console.log('Raw Search Term:', this.rawSearchTerm);

        // Prepare the term for querying by adding wildcards
        this.searchTerm = this.rawSearchTerm ? `%${this.rawSearchTerm}%` : '%';
        console.log('Formatted Search Term Sent to Apex:', this.searchTerm);

        // Reset pagination and trigger data load
        this.offset = 0;
        this.isLoading = true;
    }

    loadNextPage() {
        this.offset += this.limit1;
        this.isLoading = true;
    }

    loadPreviousPage() {
        this.offset = Math.max(0, this.offset - this.limit1);
        this.isLoading = true;
    }
}