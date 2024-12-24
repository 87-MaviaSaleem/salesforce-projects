import { LightningElement, wire } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import getTickets from '@salesforce/apex/SupportTicketController.getTickets';
import updateTicketStatus from '@salesforce/apex/SupportTicketController.updateTicketStatus';
import { refreshApex } from '@salesforce/apex';

export default class TicketStatusUpdater extends LightningElement {
    ticketData; // Holds ticket data fetched from the server
    wiredTicketResult; // Holds the wire result for refreshing data

    // Columns for the datatable, including a button to update the ticket status
    columns = [
        { label: 'Ticket Name', fieldName: 'Name' },
        { label: 'Status', fieldName: 'Status__c' },
        {
            type: 'button',
            typeAttributes: {
                label: 'Update Status',
                name: 'updateStatus',
                variant: 'brand',
                iconName: 'utility:refresh',
                iconPosition: 'left',
                // Dynamically disable the button if the ticket status is "Resolved"
                disabled: { fieldName: 'isResolved' } 
            }
        }
    ];

    @wire(getTickets)
    tickets(result) {
        this.wiredTicketResult = result; // Store wire result for refreshing data
        if (result.data) {
            // Add a flag to indicate if the ticket status is already resolved
            this.ticketData = result.data.map(ticket => ({
                ...ticket,
                isResolved: ticket.Status__c === 'Resolved' // Dynamically disable if resolved
            }));
        } else if (result.error) {
            this.showToast('Error', 'Error fetching tickets', 'error');
        }
    }

    // Handle the "Update Status" button click event
    handleUpdateStatus(event) {
        const ticketId = event.detail.row.Id; // Get the ticket ID
        const newStatus = 'Resolved'; // Set the status to 'Resolved'

        // Call the Apex method to update the ticket status
        updateTicketStatus({ ticketId, newStatus })
            .then(() => {
                this.showToast('Success', 'Ticket status updated successfully.', 'success');
                return refreshApex(this.wiredTicketResult); // Refresh ticket data
            })
            .catch((error) => {
                this.showToast('Error', 'Failed to update ticket status.', 'error');
            });
    }

    // Display a toast notification
    showToast(title, message, variant) {
        this.dispatchEvent(
            new ShowToastEvent({
                title,
                message,
                variant
            })
        );
    }
}