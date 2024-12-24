import { LightningElement, track } from 'lwc';

export default class BookingForm extends LightningElement {
    @track travelDate = '';
    @track destination = '';
    @track travelDateError = '';
    @track destinationError = '';
    @track travelDateSuccess = false;
    @track destinationSuccess = false;
    @track travelDateClass = '';  // Default empty class
    @track destinationClass = ''; // Default empty class
    @track fieldTips = '';
    @track isSubmitDisabled = true;
    @track showToast = false;
    @track toastMessage = '';
    @track toastClass = '';

    destinationOptions = [
        { label: 'New York', value: 'New York' },
        { label: 'Paris', value: 'Paris' },
        { label: 'Tokyo', value: 'Tokyo' },
        { label: 'Sydney', value: 'Sydney' }
    ];

    handleInputChange(event) {
        const fieldName = event.target.dataset.field;
        const value = event.target.value;

        try {
            console.log('Handling change for field:', fieldName);
            console.log('New value:', value);

            if (fieldName === 'travelDate') {
                this.validateTravelDate(value);
            } else if (fieldName === 'destination') {
                this.validateDestination(value);
            }

            this.updateSubmitState();
        } catch (error) {
            console.error('Error during validation:', error);
        }
    }

    showFieldTips(event) {
        const fieldName = event.target.dataset.field;
        this.fieldTips = fieldName === 'travelDate'
            ? 'Please select a valid travel date.'
            : 'Please choose your destination from the list.';
    }

    showErrorMessage(fieldName, errorMessage) {
        if (fieldName === 'travelDate') {
            this.travelDateError = errorMessage;
            this.travelDateClass = 'error';
            this.travelDateSuccess = false;
        } else if (fieldName === 'destination') {
            this.destinationError = errorMessage;
            this.destinationClass = 'error';
            this.destinationSuccess = false;
        }
    }

    validateTravelDate(value) {
        if (!value) {
            this.showErrorMessage('travelDate', 'Travel date is required.');
        } else {
            this.travelDateClass = 'success';
            this.travelDateError = '';
            this.travelDateSuccess = true;
        }
    }

    validateDestination(value) {
        if (!value) {
            this.showErrorMessage('destination', 'Destination is required.');
        } else {
            this.destinationClass = 'success';
            this.destinationError = '';
            this.destinationSuccess = true;
        }
    }

    updateSubmitState() {
        if (this.travelDateSuccess && this.destinationSuccess) {
            this.isSubmitDisabled = false;
        } else {
            this.isSubmitDisabled = true;
        }
    }

    handleSubmit() {
        this.showToastMessage('Booking submitted successfully!', 'success');
    }

    showToastMessage(message, type) {
        this.toastMessage = message;
        this.toastClass = type === 'success' ? 'toast' : 'toast error';
        this.showToast = true;

        setTimeout(() => {
            this.showToast = false;
        }, 4000);
    }
}