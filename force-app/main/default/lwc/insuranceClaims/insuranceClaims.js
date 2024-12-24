import { LightningElement, wire, api } from 'lwc';
import getClaimsData from '@salesforce/apex/ClaimsController.getClaimsData'; // Apex method to fetch claims
import updateClaimStatus from '@salesforce/apex/ClaimsController.updateClaimStatus'; // Apex method to update claim status
import { ShowToastEvent } from 'lightning/platformShowToastEvent'; // For showing toast notifications
import { refreshApex } from '@salesforce/apex'; // To refresh wire service data

// Constants for claim action types
const ACTION_TYPES = {
    APPROVE: 'approve',
    REJECT: 'reject',
};

export default class ClaimDashboard extends LightningElement {
    claims = []; // Array to store the list of claims
    isLoading = true; // Boolean to manage the loading state
    errorMessage = ''; // To store error messages
    @api recordId; // RecordId for claim (potentially for file upload functionality)

    // Fetching claims data using @wire service from the Apex class
    @wire(getClaimsData)
    wiredClaims({ error, data }) {
        if (data) {
            this.claims = data; // Assign the fetched claims to the local property
            this.isLoading = false; // Data is loaded, stop the spinner
        } else if (error) {
            this.errorMessage = error.body.message; // Set the error message
            this.isLoading = false; // Stop the spinner
        }
    }

    // Method to handle claim actions (Approve/Reject)
    handleClaimAction(event) {
        const claimId = event.target.dataset.id; // Get claim ID from the button's data attributes
        const actionType = event.target.dataset.action; // Get the action type (approve/reject)

        // Check for valid action type
        if (![ACTION_TYPES.APPROVE, ACTION_TYPES.REJECT].includes(actionType)) {
            this.showToast('Error', 'Invalid action type', 'error');
            return;
        }

        // Call the Apex method to update the claim status
        updateClaimStatus({ claimId, actionType })
            .then(() => {
                // After successful update, refresh the claims list to reflect the changes
                this.isLoading = true; // Start loading spinner
                return refreshApex(this.wiredClaims); // Refresh the wire service data to get updated claims
            })
            .catch(error => {
                this.errorMessage = error.body.message; // Display the error message
                this.showToast('Error', this.errorMessage, 'error');
            });
    }

    // Method to handle file uploads after the file upload process completes
    handleFileUploadFinished(event) {
        const uploadedFiles = event.detail.files; // Get the details of the uploaded files
        console.log('Uploaded files: ', uploadedFiles); // Log uploaded files (can be removed or extended)

        // Notify the user with a success toast message
        this.showToast('Success', 'Claim document has been uploaded successfully.', 'success');

        // After the file is uploaded, refresh the claims data to show the updated documents
        this.isLoading = true; // Start loading spinner
        return refreshApex(this.wiredClaims); // Refresh the wire service data
    }

    // Helper method to show toast notifications
    showToast(title, message, variant) {
        this.dispatchEvent(
            new ShowToastEvent({
                title,
                message,
                variant,
            })
        );
    }
}