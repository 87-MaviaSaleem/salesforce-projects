import { LightningElement, track } from 'lwc';
import syncFitnessData from '@salesforce/apex/FitnessDataController.syncFitnessData';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

export default class FitnessDataSync extends LightningElement {
    @track isSyncing = false;    // Controls spinner visibility
    @track syncData = null;      // Holds the synced data
    @track errorMessage = '';    // Holds any error messages

    // Handle the sync button click event
    handleSync() {
        this.isSyncing = true;  // Show spinner while syncing
        this.syncData = null;   // Clear any previously synced data
        this.errorMessage = ''; // Clear previous error message

        // Call the Apex method to sync data from third-party apps
        syncFitnessData()
            .then((result) => {
                this.isSyncing = false; // Hide spinner after sync completes
                if (result) {
                    this.syncData = result; // Display the synced data
                    this.showToast('Success', 'Fitness data synced successfully!', 'success');
                } else {
                    this.showErrorToast('No data returned from the sync.');
                }
            })
            .catch((error) => {
                this.isSyncing = false; // Hide spinner after error
                this.showErrorToast('Error syncing data: ' + error.body.message);
            });
    }

    // Show success toast
    showToast(title, message, variant) {
        const event = new ShowToastEvent({
            title: title,
            message: message,
            variant: variant,
        });
        this.dispatchEvent(event);
    }

    // Show error toast
    showErrorToast(message) {
        this.errorMessage = message; // Set error message for display
        this.showToast('Error', message, 'error');
    }
}