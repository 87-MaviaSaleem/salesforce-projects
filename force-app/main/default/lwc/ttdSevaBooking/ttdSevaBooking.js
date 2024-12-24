import { LightningElement, wire } from 'lwc';
import getSevas from '@salesforce/apex/SevaBookingController.getSevas'; // Fetch sevas from Apex
import bookSeva from '@salesforce/apex/SevaBookingController.bookSeva'; // Book seva from Apex
import { ShowToastEvent } from 'lightning/platformShowToastEvent'; // For showing notifications
import { refreshApex } from '@salesforce/apex'; // To refresh the cached data

export default class SevaBooking extends LightningElement {
    sevas = []; // Stores the list of sevas
    errorMessage = ''; // Stores error messages

    // Lifecycle hook: Called when the component is inserted into the DOM
    connectedCallback() {
        this.fetchSevas();
    }

    /**
     * Fetches available sevas by calling the Apex method.
     * Displays an error if the user is not authenticated or data fetching fails.
     */
    fetchSevas() {
        getSevas()
            .then(data => {
                this.sevas = data; // Populate the sevas list
            })
            .catch(error => {
                // Check for authentication error and display appropriate message
                if (error.body && error.body.message === 'User is not authenticated to view seva details.') {
                    this.errorMessage = 'Please log in to view available sevas.';
                } else {
                    this.errorMessage = 'An error occurred while fetching seva details.';
                }
                this.sevas = []; // Clear sevas on error
            });
    }

    /**
     * Handles the "Book Seva" button click.
     * Sends the seva ID to the Apex method to book the seva for the user.
     */
    handleBookSeva(event) {
        const sevaId = event.target.dataset.id; // Get the seva ID from the button's data attribute

        bookSeva({ sevaId }) // Call the Apex method
            .then(() => {
                // Show success notification
                this.showToast('Success', 'Seva booked successfully!', 'success');
                // Refresh the sevas list
                return refreshApex(this.fetchSevas());
            })
            .catch(error => {
                let errorMsg = 'Failed to book seva.';
                if (error.body && error.body.message) {
                    errorMsg = error.body.message; // Show detailed error message if available
                }
                this.showToast('Error', errorMsg, 'error');
            });
    }

    /**
     * Displays a toast message with the given title, message, and variant.
     * @param {string} title - The title of the toast
     * @param {string} message - The message to display
     * @param {string} variant - The type of toast ('success', 'error', etc.)
     */
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