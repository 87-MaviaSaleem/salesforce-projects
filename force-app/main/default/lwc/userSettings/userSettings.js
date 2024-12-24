// userSettings.js
import { LightningElement, wire, track } from 'lwc';
import getCurrentUserId from '@salesforce/apex/UserSettingsController.getCurrentUserId';
import getUserSettings from '@salesforce/apex/UserSettingsController.getUserSettings';
import updateUserSettings from '@salesforce/apex/UserSettingsController.updateUserSettings';

export default class UserSettings extends LightningElement {
    @track userId;  // Declare userId property
    @track notificationSetting;
    @track visibility;

    @track isSaveSuccessful = false; // Track success message
    @track hasError = false; // Track error message
    @track errorMessage = ''; // Track error details

    visibilityOptions = [
        { label: 'Public', value: 'public' },
        { label: 'Private', value: 'private' }
    ];

    // Use wire to get current user ID from Apex
    @wire(getCurrentUserId)
    wiredUserId({ error, data }) {
        if (data) {
            this.userId = data;
            console.log('Current User ID:', this.userId);  // Log the current user ID
        } else if (error) {
            console.error('Error fetching user ID', error);
        }
    }

    @wire(getUserSettings, { userId: '$userId' })
    wiredUserSettings({ error, data }) {
        if (data) {
            this.notificationSetting = data.notificationSetting;
            this.visibility = data.dataVisibility;
        } else if (error) {
            console.error('Error fetching user settings', error);
        }
    }

    handleNotificationChange(event) {
        this.notificationSetting = event.target.checked;
    }

    handleVisibilityChange(event) {
        this.visibility = event.target.value;
    }

    handleSaveSettings() {
        const settings = {
            notificationSetting: this.notificationSetting,
            visibility: this.visibility
        };

        updateUserSettings({ userId: this.userId, settings })
            .then(() => {
                this.isSaveSuccessful = true;
                this.hasError = false;
                setTimeout(() => {
                    this.isSaveSuccessful = false;
                }, 3000); // Hide success message after 3 seconds
            })
            .catch(error => {
                this.hasError = true;
                this.isSaveSuccessful = false;
                this.errorMessage = error.body.message || 'Unknown error';
                console.error('Error saving user settings', error);
            });
    }
}