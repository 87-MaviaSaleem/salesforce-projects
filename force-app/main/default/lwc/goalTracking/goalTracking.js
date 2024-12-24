import { LightningElement, track, wire } from 'lwc';
import saveGoal from '@salesforce/apex/GoalController.saveGoal';
import getGoal from '@salesforce/apex/GoalController.getGoal';
import getActivities from '@salesforce/apex/ActivityController.getActivities';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

export default class GoalTracking extends LightningElement {
    @track goalTarget = '';
    @track goalCalories = '';
    @track goalDistance = '';
    @track progress = 0;
    @track progressPercentage = 0;

    // Fetch goal data when the component loads
    @wire(getGoal)
    wiredGoal({ error, data }) {
        if (data) {
            console.log('Goal Data:', data); // Log the goal data fetched
            this.goalTarget = data.Target_Duration__c;
            this.goalCalories = data.Target_Calories__c;
            this.goalDistance = data.Target_Distance__c;
            this.calculateProgress(); // Recalculate progress when goal data is available
        } else if (error) {
            console.error('Error loading goal:', error); // Log error if there's an issue
            this.showErrorToast('Error loading goal.');
        }
    }

    // Fetch activity data to calculate progress
    @wire(getActivities)
    wiredActivities({ error, data }) {
        if (data) {
            console.log('Activities Data:', data); // Log the activities data fetched
            const totalDuration = data.reduce((sum, activity) => sum + activity.Duration__c, 0);
            console.log('Total Duration:', totalDuration); // Log the total duration of activities
            this.progress = totalDuration;
            this.calculateProgress(); // Recalculate progress
        } else if (error) {
            console.error('Error loading activities:', error); // Log error if there's an issue
            this.showErrorToast('Error loading activities.');
        }
    }

    // Handle input field changes
    handleInputChange(event) {
        const field = event.target.dataset.id;
        if (field === 'goalTarget') {
            this.goalTarget = event.target.value;
        } else if (field === 'goalCalories') {
            this.goalCalories = event.target.value;
        } else if (field === 'goalDistance') {
            this.goalDistance = event.target.value;
        }
        console.log('Updated Goal Values:', this.goalTarget, this.goalCalories, this.goalDistance); // Log updated values
    }

    // Save the goal to Salesforce
    handleSaveGoal() {
        if (this.goalTarget && this.goalCalories && this.goalDistance) {
            saveGoal({
                targetDuration: this.goalTarget,
                targetCalories: this.goalCalories,
                targetDistance: this.goalDistance
            })
            .then(() => {
                this.showSuccessToast('Goal saved successfully!');
                this.calculateProgress(); // Recalculate progress after goal is saved
            })
            .catch(error => {
                console.error('Error saving goal:', error); // Log error if saving fails
                this.showErrorToast('Error saving goal: ' + error.body.message);
            });
        } else {
            this.showErrorToast('Please fill out all fields.');
        }
    }

    // Calculate the progress as a percentage
    calculateProgress() {
        if (this.goalTarget > 0) {
            this.progressPercentage = (this.progress / this.goalTarget) * 100;
        } else {
            this.progressPercentage = 0;
        }

        if (this.progress >= this.goalTarget) {
            this.showSuccessToast('Congratulations, you have reached your goal!');
        }

        console.log('Progress:', this.progress, 'Progress Percentage:', this.progressPercentage); // Log progress calculation
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

    // Edit goal functionality
    handleEditGoal() {
        this.goalTarget = '';
        this.goalCalories = '';
        this.goalDistance = '';
        this.progress = 0;
        this.progressPercentage = 0;
    }

    // Reset goal functionality
    handleResetGoal() {
        this.goalTarget = '';
        this.goalCalories = '';
        this.goalDistance = '';
        this.progress = 0;
        this.progressPercentage = 0;
    }
}