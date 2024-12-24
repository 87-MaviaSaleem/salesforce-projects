import { LightningElement } from 'lwc';
import { createRecord } from 'lightning/uiRecordApi';
import LEAD_OBJECT from '@salesforce/schema/Lead';
import FIRST_NAME_FIELD from '@salesforce/schema/Lead.FirstName';
import LAST_NAME_FIELD from '@salesforce/schema/Lead.LastName';
import EMAIL_FIELD from '@salesforce/schema/Lead.Email';
import PHONE_FIELD from '@salesforce/schema/Lead.Phone';
import COMPANY_FIELD from '@salesforce/schema/Lead.Company';
import isDuplicateLead from '@salesforce/apex/LeadDuplicateCheck.isDuplicateLead'; // Import Apex method

export default class LeadCaptureForm extends LightningElement {
    firstName = '';
    lastName = '';
    email = '';
    phone = '';
    errorMessage = '';
    Company = '';
    isLoading = false; // Track loading state

    // Handle form field changes
    handleInputChange(event) {
        const field = event.target.dataset.id;
        if (field === 'firstName') this.firstName = event.target.value;
        if (field === 'lastName') this.lastName = event.target.value;
        if (field === 'email') this.email = event.target.value;
        if (field === 'phone') this.phone = event.target.value;
        if (field === 'Company') this.Company = event.target.value;
    }

    // Validate email format
    validateEmailFormat(email) {
        const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        return emailPattern.test(email);
    }

    // Validate phone format (basic validation example)
    validatePhoneNumber(phone) {
        const phonePattern = /^[0-9]{10}$/; // Example: Only allows 10 digit phone numbers
        return phonePattern.test(phone);
    }

    // Handle form submission with validation and duplicate check
    handleSubmit() {
        // Validate required fields
        if (!this.firstName || !this.lastName || !this.email || !this.phone || !this.Company) {
            this.errorMessage = 'Please fill in all the required fields.';
            return; // Prevent form submission
        }

        // Validate email format
        if (!this.validateEmailFormat(this.email)) {
            this.errorMessage = 'Please enter a valid email address.';
            return; // Prevent form submission
        }

        // Validate phone format
        if (!this.validatePhoneNumber(this.phone)) {
            this.errorMessage = 'Please enter a valid phone number (10 digits).';
            return; // Prevent form submission
        }

        this.isLoading = true; // Show spinner

        // Check for duplicate email
        isDuplicateLead({ email: this.email })
            .then((result) => {
                this.isLoading = false; // Hide spinner
                if (result) {
                    this.errorMessage = 'A lead with this email already exists.';
                } else {
                    this.errorMessage = ''; // Clear error message
                    this.createLead(); // Proceed with lead creation
                }
            })
            .catch((error) => {
                this.isLoading = false; // Hide spinner
                if (error.body && error.body.message) {
                    this.errorMessage = 'Error checking for duplicates: ' + error.body.message;
                } else {
                    this.errorMessage = 'Unexpected error occurred while checking for duplicates.';
                }
            });
    }

    // Create the Lead record if no duplicate is found
    createLead() {
        const fields = {};
        fields[FIRST_NAME_FIELD.fieldApiName] = this.firstName;
        fields[LAST_NAME_FIELD.fieldApiName] = this.lastName;
        fields[EMAIL_FIELD.fieldApiName] = this.email;
        fields[PHONE_FIELD.fieldApiName] = this.phone;
        fields[COMPANY_FIELD.fieldApiName] = this.Company;
        const recordInput = { apiName: LEAD_OBJECT.objectApiName, fields };

        this.isLoading = true; // Show spinner

        // Create the Lead record
        createRecord(recordInput)
            .then(() => {
                this.clearForm();
                this.isLoading = false; // Hide spinner
                alert('Lead submitted successfully!');
            })
            .catch((error) => {
                this.isLoading = false; // Hide spinner
                if (error.body && error.body.message) {
                    this.errorMessage = 'Error creating lead: ' + error.body.message;
                } else {
                    this.errorMessage = 'Unexpected error occurred while creating the lead.';
                }
            });
    }

    // Clear the form after successful submission
    clearForm() {
        this.firstName = '';
        this.lastName = '';
        this.email = '';
        this.phone = '';
        this.Company = '';
    }
}