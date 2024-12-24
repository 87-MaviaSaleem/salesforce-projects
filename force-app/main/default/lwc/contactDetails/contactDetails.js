import { LightningElement, api, wire } from 'lwc';
import { getRecord } from 'lightning/uiRecordApi';

const FIELDS = [
    'Contact.FirstName',
    'Contact.LastName',
    'Contact.Email'
];

export default class ContactDetails extends LightningElement {
    @api recordId;  // The recordId is passed dynamically from the parent component or page
    contact = {};  // Initialize the contact object to prevent errors accessing its properties

    isLoading ='';  // Initialize the loading state

    // Use the wire adapter with the $recordId to automatically fetch updated data when the recordId changes
    @wire(getRecord, { recordId: '$recordId', fields: FIELDS })
    wiredContact({ error, data }) {
        console.log('Record ID:', this.recordId);  // Log the recordId to check if it's being passed

        if (data) {
            this.contact = data;  // Store the contact data
            this.isLoading = false;  // Set isLoading to false when data is loaded
            console.log('Fetched Contact Data:',  this.contact);  // Log the data to check if it's being fetched correctly
            console.log('Fetched Contact Data:',  this.contact.fields.FirstName.value);  // Log the data to check if it's being fetched correctly
        } else if (error) {
            this.isLoading = false;  // Set isLoading to false when an error occurs (if desired)
            this.contact = {};  // Clear the contact data in case of error
            console.log('Error:', error);  // Log the error to check if there's an issue with fetching the data
        }
    }
}