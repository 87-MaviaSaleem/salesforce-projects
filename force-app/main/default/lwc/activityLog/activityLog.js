import { LightningElement, track, wire } from 'lwc';
import saveActivity from '@salesforce/apex/ActivityController.saveActivity';
import getActivities from '@salesforce/apex/ActivityController.getActivities';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

export default class ActivityLog extends LightningElement {
    @track activityName = '';
    @track activityDuration = '';
    @track activityDate = '';
    @track activities = [];

    columns = [
        { label: 'Activity Name', fieldName: 'Name' },
        { label: 'Duration (minutes)', fieldName: 'Duration__c' },
        { label: 'Date', fieldName: 'Date__c' }
    ];

    // To hold the current activities fetched
    @wire(getActivities)
    wiredActivities({ error, data }) {
        if (data) {
            console.log(data);
            this.activities = data;
        } else if (error) {
            this.showErrorToast('Error loading activities.');
        }
    }

    // Handle input changes
    handleInputChange(event) {
        const field = event.target.dataset.id;
        if (field === 'activityName') {
            this.activityName = event.target.value;
        } else if (field === 'activityDuration') {
            this.activityDuration = event.target.value;
        } else if (field === 'activityDate') {
            this.activityDate = event.target.value;
            console.log(this.activityDate)
        }
    }

    // Save activity to Salesforce
    handleSaveActivity() {
        console.log('Activity Name:', this.activityName);
        console.log('Activity Duration:', this.activityDuration);
        console.log('Activity Date:', this.activityDate);  // Check the value here
    
        // Ensure the date is not empty or invalid
        if (!this.activityDate) {
            this.showErrorToast('Please select a valid date.');
            return;
        }
    
        // Proceed if all fields are filled out
        if (this.activityName && this.activityDuration && this.activityDate) {
            const formattedDate = new Date(this.activityDate).toISOString().split('T')[0];
            console.log('Formatted Date:', formattedDate);  // Check the formatted date here
    
            saveActivity({ 
                name: this.activityName, 
                duration: this.activityDuration, 
                activityDate: formattedDate // Pass the correctly formatted date
            })
            .then(() => {
                this.showSuccessToast('Activity saved successfully!');
                this.clearForm();
                this.refreshActivities();
            })
            .catch(error => {
                this.showErrorToast('Error saving activity: ' + error.body.message);
            });
        } else {
            this.showErrorToast('Please fill out all fields.');
        }
    }
    
    
    
    

    // Refresh the activities list
    refreshActivities() {
        getActivities()  // Call the method imperatively
            .then((result) => {
                this.activities = result;
            })
            .catch((error) => {
                this.showErrorToast('Error refreshing activities: ' + error.body.message);
            });
    }

    // Show success toast
    showSuccessToast(message) {
        const event = new ShowToastEvent({
            title: 'Success',
            message: message,
            variant: 'success',
        });
        this.dispatchEvent(event);
    }

    // Show error toast
    showErrorToast(message) {
        const event = new ShowToastEvent({
            title: 'Error',
            message: message,
            variant: 'error',
        });
        this.dispatchEvent(event);
    }

    // Clear form after saving
    clearForm() {
        this.activityName = '';
        this.activityDuration = '';
        this.activityDate = '';
    }
}