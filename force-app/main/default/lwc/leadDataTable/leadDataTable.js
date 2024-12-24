import { LightningElement, track, wire } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent'; // Import Toast event
import getLeads from '@salesforce/apex/LeadController.getLeads';
import createLead from '@salesforce/apex/LeadController.createLead';
import updateLead from '@salesforce/apex/LeadController.updateLead';
import deleteLead from '@salesforce/apex/LeadController.deleteLead';

const COLUMNS = [
    { label: 'First Name', fieldName: 'FirstName' },
    { label: 'Last Name', fieldName: 'LastName' },
    { label: 'Email', fieldName: 'Email' },
    { label: 'Company', fieldName: 'Company' },
    { label: 'Status', fieldName: 'Status' },
    {
        type: 'action',
        typeAttributes: {
            rowActions: [
                { label: 'Edit', name: 'edit' },
                { label: 'Delete', name: 'delete' }
            ]
        }
    }
];

export default class LeadDataTable extends LightningElement {
    @track leads = [];
    columns = COLUMNS;
    @track recordId = null; // Holds the record ID for editing
    saveButtonLabel = 'Save Lead'; // Button label

    // Wire method to fetch lead records
    @wire(getLeads)
    wiredLeads({ error, data }) {
        if (data) {
            this.leads = data;
        } else if (error) {
            console.error('Error fetching leads', error);
        }
    }

    // Handle Insert button click
    handleInsert() {
        this.recordId = null; // Reset recordId to create a new record
        this.saveButtonLabel = 'Save Lead'; // Change button label for Insert
    }

    // Handle Edit button click
    handleEdit(row) {
        this.recordId = row.Id; // Set the recordId for editing
        this.saveButtonLabel = 'Update Lead'; // Change button label to 'Update'
    }

    // Handle form submit (Insert or Update)
    handleFormSubmit(event) {
        event.preventDefault(); // Prevent the form from automatically submitting
    
        // Manually collect the form data using the template
        const fields = {};
        const inputs = this.template.querySelectorAll('lightning-input-field');
        inputs.forEach(input => {
            fields[input.fieldName] = input.value; // Collect all field values
        });
    
        // Check if recordId is set (edit mode) or not (insert mode)
        if (this.recordId) {
            // Update existing lead
            fields.Id = this.recordId;
            updateLead({ updatedLeads: [fields] })
                .then(() => {
                    // Update the leads array with the updated lead
                    this.leads = this.leads.map(lead => lead.Id === fields.Id ? fields : lead);
                    this.recordId = null; // Reset recordId after saving
                    // Show success toast for update
                    this.showToast('Success', 'Lead updated successfully!', 'success');
                })
                .catch(error => {
                    console.error('Error updating lead:', error);
                    // Show error toast
                    this.showToast('Error', 'Error updating lead.', 'error');
                });
        } else {
            // Create new lead
            createLead({
                firstName: fields.FirstName,
                lastName: fields.LastName,
                email: fields.Email,
                company: fields.Company,
                status: fields.Status
            })
            .then(result => {
                // Add the new lead to the leads array
                this.leads = [...this.leads, result];
                this.recordId = null; // Reset recordId after saving
                // Show success toast for insert
                this.showToast('Success', 'Lead created successfully!', 'success');
            })
            .catch(error => {
                console.error('Error creating lead:', error);
                // Show error toast
                this.showToast('Error', 'Error creating lead.', 'error');
            });
        }
    }

    // Handle row actions (edit or delete)
    handleRowAction(event) {
        const actionName = event.detail.action.name;
        const row = event.detail.row;
        if (actionName === 'edit') {
            this.handleEdit(row);
        } else if (actionName === 'delete') {
            this.handleDelete(row);
        }
    }

    // Handle Delete action
    handleDelete(row) {
        deleteLead({ leadId: row.Id })
            .then(() => {
                // Filter out the deleted lead from the leads array
                this.leads = this.leads.filter(lead => lead.Id !== row.Id);
                // Show success toast for delete
                this.showToast('Success', 'Lead deleted successfully!', 'success');
            })
            .catch(error => {
                console.error('Error deleting lead:', error);
                // Show error toast
                this.showToast('Error', 'Error deleting lead.', 'error');
            });
    }

    // Utility method to show toast messages
    showToast(title, message, variant) {
        const evt = new ShowToastEvent({
            title: title,
            message: message,
            variant: variant, // 'success', 'error', 'warning', etc.
        });
        this.dispatchEvent(evt); // Dispatch the toast event
    }
}