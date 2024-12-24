import { LightningElement, track, wire } from 'lwc';
import getShipments from '@salesforce/apex/ShipmentController1.getShipments'; // Apex method to fetch shipments
import addShipment from '@salesforce/apex/ShipmentController1.addShipment'; // Apex method to add a shipment
import updateShipmentStatusWithLocking from '@salesforce/apex/ShipmentController1.updateShipmentStatusWithLocking'; // Apex method to update shipment status
import { ShowToastEvent } from 'lightning/platformShowToastEvent'; // Import toast event for notifications

export default class ShipmentTracking extends LightningElement {
    // Reactive properties
    @track shipments = []; // Holds the list of all shipments
    @track trackingNumber = ''; // New shipment's tracking number
    @track deliveryAddress = ''; // New shipment's delivery address
    @track expectedDeliveryDate = ''; // New shipment's expected delivery date
    @track shipmentStatus = 'Pending'; // Default status for new shipments
    @track selectedShipment = null; // Holds details of the selected shipment for modal view
    @track filterStatus = 'All'; // Default filter to show all shipments

    // Options for the filter dropdown to filter shipments by status
    statusOptions = [
        { label: 'All', value: 'All' },
        { label: 'Pending', value: 'Pending' },
        { label: 'Delivered', value: 'Delivered' },
        { label: 'In Progress', value: 'In Progress' }
    ];

    // Configuration for the lightning-datatable columns
    columns = [
        { label: 'Tracking Number', fieldName: 'Shipment_Tracking_Number__c', type: 'text' },
        { label: 'Delivery Address', fieldName: 'Delivery_Address__c', type: 'text' },
        { label: 'Expected Date', fieldName: 'Expected_Delivery_Date__c', type: 'date' },
        { label: 'Status', fieldName: 'Status__c', type: 'text' },
        {
            type: 'button',
            typeAttributes: {
                label: 'View Details',
                name: 'viewDetails',
                variant: 'neutral'
            }
        }
    ];

    // Wire the Apex method to fetch shipments
    @wire(getShipments)
    wiredShipments({ error, data }) {
        if (data) {
            this.shipments = data; // Populate the shipment list
        } else if (error) {
            this.showToast('Error', 'Failed to fetch shipments.', 'error');
        }
    }

    /**
     * Handles changes to input fields and updates the corresponding property.
     */
    handleInputChange(event) {
        const field = event.target.name; // Get the field name
        if (field === 'trackingNumber') this.trackingNumber = event.target.value;
        else if (field === 'deliveryAddress') this.deliveryAddress = event.target.value;
        else if (field === 'expectedDeliveryDate') this.expectedDeliveryDate = event.target.value;
        else if (field === 'filterStatus') this.filterStatus = event.target.value;
    }

    /**
     * Adds a new shipment record by calling the Apex method.
     */
    handleAddShipment() {
        addShipment({
            trackingNumber: this.trackingNumber,
            deliveryAddress: this.deliveryAddress,
            expectedDeliveryDate: this.expectedDeliveryDate
        })
            .then(result => {
                this.showToast('Success', result, 'success');
                this.resetInputs(); // Reset input fields
                return refreshApex(this.shipments); // Refresh the shipment list
            })
            .catch(error => {
                this.showToast('Error', 'Failed to add shipment.', 'error');
                console.error(error);
            });
    }

    /**
     * Handles actions triggered from the datatable row (e.g., "View Details").
     */
    handleRowAction(event) {
        const actionName = event.detail.action.name; // Get the action name
        const row = event.detail.row; // Get the row data

        if (actionName === 'viewDetails') {
            this.selectedShipment = row; // Set the selected shipment details for viewing
        }
    }

    /**
     * Filters the shipments based on the selected status.
     */
    handleFilterChange() {
        if (this.filterStatus === 'All') {
            this.filteredShipments = [...this.shipments]; // Show all shipments
        } else {
            this.filteredShipments = this.shipments.filter(
                shipment => shipment.Status__c === this.filterStatus
            );
        }
    }

    /**
     * Updates the status of a selected shipment using optimistic locking.
     */
    handleUpdateStatus() {
        updateShipmentStatusWithLocking({
            shipmentId: this.selectedShipment.Id,
            status: this.shipmentStatus,
            lastModifiedDate: this.selectedShipment.LastModifiedDate
        })
            .then(result => {
                this.showToast('Success', result, 'success');
                this.selectedShipment = null; // Close the modal
                return refreshApex(this.shipments); // Refresh the shipment list
            })
            .catch(error => {
                this.showToast('Error', 'Failed to update shipment status.', 'error');
                console.error(error);
            });
    }

    /**
     * Closes the details modal by resetting the selectedShipment property.
     */
    closeModal() {
        this.selectedShipment = null;
    }

    /**
     * Displays a toast notification with a custom message.
     *
     * @param title - The title of the toast.
     * @param message - The body of the toast message.
     * @param variant - The type of toast ('success', 'error', 'info').
     */
    showToast(title, message, variant) {
        const event = new ShowToastEvent({
            title,
            message,
            variant
        });
        this.dispatchEvent(event); // Dispatch the toast event
    }

    /**
     * Resets input fields for adding a new shipment.
     */
    resetInputs() {
        this.trackingNumber = '';
        this.deliveryAddress = '';
        this.expectedDeliveryDate = '';
    }
}