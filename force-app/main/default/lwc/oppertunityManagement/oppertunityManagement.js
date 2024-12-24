import { LightningElement, wire } from 'lwc';
import getOpportunities from '@salesforce/apex/OpportunityController.getOpportunities';
import getOwners from '@salesforce/apex/OpportunityController.getOwners';
import updateOpportunityStage from '@salesforce/apex/OpportunityController.updateOpportunityStage';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

export default class OpportunityManagement extends LightningElement {
    // Holds the list of opportunities fetched from the server
    opportunities = [];
    
    // Variable to store any error messages encountered during data fetching
    error;
    
    // Default value for selected stage filter (empty by default to show all stages)
    selectedStage = '';

    // New variable for selected owner filter
    selectedOwner = '';

    // Placeholder for owner filter options, populated once owners are fetched from the server
    ownerOptions = [];

    // Hardcoded list of stages for filtering
    stageOptions = [
        { label: 'Prospecting', value: 'Prospecting' },
        { label: 'Qualification', value: 'Qualification' },
        { label: 'Closed Won', value: 'Closed Won' },
        { label: 'Closed Lost', value: 'Closed Lost' }
    ];

    // Define columns for the lightning datatable
    // The Stage column is editable for in-line editing
    columns = [
        { label: 'Opportunity Name', fieldName: 'Name' },
        { label: 'Stage', fieldName: 'StageName', editable: true }, // Stage column is editable
        { label: 'Close Date', fieldName: 'CloseDate', type: 'date' },
        { label: 'Owner', fieldName: 'Owner.Name' }
    ];

    /**
     * @wire decorator used to fetch the list of owners.
     * If data is returned, populate the ownerOptions array with label-value pairs.
     * If an error occurs, show a toast message with the error.
     */
    @wire(getOwners)
    wiredOwners({ error, data }) {
        if (data) {
            this.ownerOptions = data.map(owner => ({
                label: owner.Name, // The name of the owner as the label
                value: owner.Id // The Id of the owner as the value
            }));
        } else if (error) {
            // If error occurs during the owner fetch, show an error toast
            this.showToast('Error', 'Failed to load owners', 'error');
        }
    }

    /**
     * @wire decorator used to fetch opportunities from the Apex controller.
     * Filters opportunities based on the selected stage and owner.
     */
    @wire(getOpportunities, { stageFilter: '$selectedStage', ownerFilter: '$selectedOwner' })
    wiredOpportunities({ error, data }) {
        if (data) {
            // If data is returned successfully, assign it to the opportunities array
            this.opportunities = data;
        } else if (error) {
            // If error occurs while fetching opportunities, show an error toast
            this.showToast('Error', 'Failed to load opportunities', 'error');
        }
    }

    /**
     * Handles the change event for the stage filter.
     * Updates the selectedStage property based on the selected stage value.
     */
    handleStageChange(event) {
        this.selectedStage = event.detail.value;
    }

    /**
     * Handles the change event for the owner filter.
     * Updates the selectedOwner property based on the selected owner value.
     */
    handleOwnerChange(event) {
        this.selectedOwner = event.detail.value;
    }

    /**
     * Handles changes in cell data within the lightning-datatable (used for in-line editing).
     * Specifically, if the StageName is updated, calls updateOpportunityStage to save the changes.
     */
    handleCellChange(event) {
        const draftValues = event.detail.draftValues; // Get draft values from the datatable
        const updatedFields = draftValues[0]; // Get the updated fields (assuming only one row is edited at a time)

        if (updatedFields.StageName) {
            // If StageName has been updated, call the updateOpportunityStage method to save it
            this.updateOpportunityStage(updatedFields.Id, updatedFields.StageName);
        }
    }

    /**
     * Calls the Apex method to update the stage of the opportunity.
     * Shows a success toast if the update is successful or an error toast if the update fails.
     */
    updateOpportunityStage(opportunityId, newStage) {
        updateOpportunityStage({ opportunityId, newStage }) // Call Apex to update the stage
            .then(() => {
                // Show a success toast when the update is successful
                this.showToast('Success', 'Opportunity stage updated successfully', 'success');
            })
            .catch(error => {
                // Show an error toast if the update fails
                this.showToast('Error', 'Failed to update opportunity stage', 'error');
            });
    }

    /**
     * Utility method to show toast notifications.
     * Displays success or error messages to the user.
     */
    showToast(title, message, variant) {
        this.dispatchEvent(new ShowToastEvent({
            title,
            message,
            variant // Can be 'success', 'error', or 'info'
        }));
    }
}