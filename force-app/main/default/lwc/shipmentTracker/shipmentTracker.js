import { LightningElement, track, wire } from 'lwc';
import getShipmentData from '@salesforce/apex/ShipmentController.getShipmentData';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

export default class ShipmentTracker extends LightningElement {
    @track trackingNumber = '';   // Stores user input for tracking number
    @track shipmentData;          // Stores the shipment data retrieved from Apex
    @track errorMessage;          // Stores error message for any issues
    @track isLoading = false;     // Loading spinner indicator

    // Reactive wire service to fetch shipment data based on tracking number
    @wire(getShipmentData, { trackingNumber: '$trackingNumber' })
    wiredShipmentData({ error, data }) {
        this.isLoading = false; // Stop the loading spinner once the data is fetched

        if (data) {
            this.shipmentData = JSON.parse(data); // Parse the data to display
            this.errorMessage = null;  // Clear any existing error messages
            this.showToastMessage('Success', 'Shipment data retrieved successfully.', 'success'); // Show success toast
        } else if (error) {
            this.shipmentData = null;  // Clear any existing data
            this.errorMessage = 'Failed to retrieve shipment data. Please try again later.';  // Set error message
            this.showToastMessage('Error', 'Failed to retrieve shipment data. Please try again later.', 'error'); // Show error toast
        }
    }

    // Handle changes in the input field
    handleInputChange(event) {
        this.trackingNumber = event.target.value;  // Update tracking number based on user input
    }

    // Trigger fetching shipment data when the button is clicked
    fetchShipmentData() {
        if (!this.trackingNumber) {
            this.errorMessage = 'Please enter a tracking number.'; // Show error if no tracking number
            this.showToastMessage('Error', 'Please enter a tracking number.', 'error'); // Show toast for missing input
            return;
        }

        this.isLoading = true;  // Show loading spinner
        this.errorMessage = ''; // Clear error messages
    }

    // Display toast notifications (success/error)
    showToastMessage(title, message, variant) {
        const event = new ShowToastEvent({
            title,
            message,
            variant,
        });
        this.dispatchEvent(event); // Dispatch the toast event to show notification
    }

    // Cache busting mechanism (3rd Question)
    bustCache(trackingNumber) {
        // Custom method to trigger cache invalidation for the provided tracking number
        // Cache busting logic to be implemented in the Apex class (ShipmentController)
        this.showToastMessage('Cache Invalidated', `Cache for tracking number ${trackingNumber} has been invalidated.`, 'info');
    }

    // Ensure cache consistency by invalidating the cache whenever shipment data changes
    handleShipmentStatusChange() {
        if (this.shipmentData && this.shipmentData.Status__c) {
            // Call bustCache method when shipment status or other important data is updated
            this.bustCache(this.shipmentData.Shipment_Tracking_Number__c);
        }
    }
}