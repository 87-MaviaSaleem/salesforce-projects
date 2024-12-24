import { LightningElement, track } from 'lwc';
import createGatepass from '@salesforce/apex/GatepassController.createGatepass'; // Apex method for creating a gatepass
import getGatepasses from '@salesforce/apex/GatepassController.getGatepasses'; // Apex method for fetching gatepasses
import getGatepassById from '@salesforce/apex/GatepassController.getGatepassById'; // Apex method for fetching a single gatepass by ID
import updateGatepass from '@salesforce/apex/GatepassController.updateGatepass'; // Apex method for updating an existing gatepass
import { ShowToastEvent } from 'lightning/platformShowToastEvent'; // Importing Toast event for notifications

export default class GatepassLWC extends LightningElement {
    // Reactive variables to store filter criteria and gatepass details
    @track eventName = ''; // Stores the value for Event Name filter
    @track guestName = ''; // Stores the value for Guest Name filter
    @track gatepassDate = ''; // Stores the value for Gatepass Date filter
    @track gatepassTime = ''; // Stores the value for Gatepass Time filter
    @track filteredGatepasses = []; // Stores the filtered list of gatepasses based on search criteria
    @track selectedGatepass = null; // Stores the selected gatepass object for editing

    // Define the columns for the data table to display gatepasses
    columns = [
        { label: 'Event Name', fieldName: 'Event_Name__c' },
        { label: 'Guest Name', fieldName: 'Guest_Name__c' },
        { label: 'Gatepass Date', fieldName: 'Gatepass_Date__c' },
        { label: 'Gatepass Time', fieldName: 'Gatepass_Time__c' }
    ];

    // Handle input changes in the search/filter fields
    handleInputChange(event) {
        const field = event.target.name; // Get the name of the field that triggered the event
        // Update the corresponding property based on the field name
        if (field === 'eventName') {
            this.eventName = event.target.value;
        } else if (field === 'guestName') {
            this.guestName = event.target.value;
        } else if (field === 'gatepassDate') {
            this.gatepassDate = event.target.value;
        } else if (field === 'gatepassTime') {
            this.gatepassTime = event.target.value;
        }
    }

    // Load gatepasses based on the filters (eventName, guestName)
    loadGatepasses() {
        // Call the Apex method to fetch filtered gatepasses
        getGatepasses({ eventName: this.eventName, guestName: this.guestName })
            .then((result) => {
                this.filteredGatepasses = result; // Store the returned result in filteredGatepasses
            })
            .catch((error) => {
                this.showToast('Error', error.body.message, 'error'); // Show error toast if there's an issue
            });
    }

    // Create a new gatepass with the provided input values
    createGatepass() {
        // Call the Apex method to create a new gatepass
        createGatepass({ eventName: this.eventName, guestName: this.guestName, gatepassDate: this.gatepassDate, gatepassTime: this.gatepassTime })
            .then((result) => {
                this.showToast('Success', result, 'success'); // Show success toast
                this.loadGatepasses(); // Reload the gatepasses after creation
            })
            .catch((error) => {
                this.showToast('Error', error.body.message, 'error'); // Show error toast if something goes wrong
            });
    }

    // Handle the row action event when a gatepass is selected for editing
    handleRowAction(event) {
        const gatepassId = event.detail.row.Id; // Get the ID of the selected gatepass
        // Fetch the selected gatepass details using the ID
        getGatepassById({ gatepassId: gatepassId })
            .then((result) => {
                this.selectedGatepass = result; // Store the result in selectedGatepass for editing
            })
            .catch((error) => {
                this.showToast('Error', error.body.message, 'error'); // Show error toast if fetching fails
            });
    }

    // Handle changes to the fields when editing a selected gatepass
    handleEditChange(event) {
        const field = event.target.name; // Get the name of the field being edited
        // Update the corresponding field in the selected gatepass object
        if (field === 'eventName') {
            this.selectedGatepass.Event_Name__c = event.target.value;
        } else if (field === 'guestName') {
            this.selectedGatepass.Guest_Name__c = event.target.value;
        } else if (field === 'gatepassDate') {
            this.selectedGatepass.Gatepass_Date__c = event.target.value;
        } else if (field === 'gatepassTime') {
            this.selectedGatepass.Gatepass_Time__c = event.target.value;
        }
    }

    // Update the selected gatepass with the modified details
    updateGatepass() {
        // Call the Apex method to update the gatepass with the new details
        updateGatepass({
            gatepassId: this.selectedGatepass.Id, // ID of the gatepass to update
            eventName: this.selectedGatepass.Event_Name__c, // Updated event name
            guestName: this.selectedGatepass.Guest_Name__c, // Updated guest name
            gatepassDate: this.selectedGatepass.Gatepass_Date__c, // Updated gatepass date
            gatepassTime: this.selectedGatepass.Gatepass_Time__c // Updated gatepass time
        })
            .then((result) => {
                this.showToast('Success', result, 'success'); // Show success message
                this.selectedGatepass = null; // Reset the selectedGatepass variable after successful update
                this.loadGatepasses(); // Reload the gatepasses after update
            })
            .catch((error) => {
                this.showToast('Error', error.body.message, 'error'); // Show error message if update fails
            });
    }

    // Utility method to display toast notifications (success or error)
    showToast(title, message, variant) {
        const event = new ShowToastEvent({
            title: title, // Title of the toast message
            message: message, // Message content
            variant: variant, // Toast variant (success, error, etc.)
        });
        this.dispatchEvent(event); // Dispatch the event to show the toast message
    }

    // Lifecycle hook that runs when the component is connected to the DOM
    connectedCallback() {
        this.loadGatepasses(); // Load the initial list of gatepasses when the component loads
    }
}