import { LightningElement } from 'lwc';

export default class UserProfileComponent extends LightningElement {
    // User preference options
    themeOptions = [
        { label: 'Light Mode', value: 'light' },
        { label: 'Dark Mode', value: 'dark' }
    ];
    languageOptions = [
        { label: 'English', value: 'en' },
        { label: 'Spanish', value: 'es' },
        { label: 'French', value: 'fr' }
    ];
    notificationOptions = [
        { label: 'Email Notifications', value: 'email' },
        { label: 'SMS Notifications', value: 'sms' },
        { label: 'Push Notifications', value: 'push' }
    ];

    // Default user preferences
    theme = 'light';
    language = 'en';
    notificationPreferences = ['email'];
    profilePicture = null; // Default: no profile picture
    selectedProfile = 'work'; // Default profile
    profiles = {
        work: {
            theme: 'light',
            language: 'en',
            notifications: ['email'],
            picture: null
        },
        personal: {
            theme: 'dark',
            language: 'es',
            notifications: ['sms'],
            picture: null
        }
    };

    // Options for switching profiles
    profileOptions = [
        { label: 'Work Profile', value: 'work' },
        { label: 'Personal Profile', value: 'personal' }
    ];

    // Lifecycle hook to load stored preferences from localStorage
    connectedCallback() {
        this.loadPreferences();
    }

    // Handle theme change
    handleThemeChange(event) {
        this.theme = event.detail.value;
        this.updateProfilePreference('theme', this.theme);
        this.savePreferences(); // Save updated preferences to localStorage
        this.dispatchProfileChangeEvent();
    }

    // Handle language change
    handleLanguageChange(event) {
        this.language = event.detail.value;
        this.updateProfilePreference('language', this.language);
        this.savePreferences(); // Save updated preferences to localStorage
        this.dispatchProfileChangeEvent();
    }

    // Handle notification preferences change
    handleNotificationChange(event) {
        this.notificationPreferences = event.detail.value;
        this.updateProfilePreference('notifications', this.notificationPreferences);
        this.savePreferences(); // Save updated preferences to localStorage
        this.dispatchProfileChangeEvent();
    }

    // Handle profile picture upload
    handleProfilePictureUpload(event) {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                this.profilePicture = reader.result;
                this.updateProfilePreference('picture', this.profilePicture);
                this.savePreferences(); // Save updated preferences
                this.dispatchProfileChangeEvent();
            };
            reader.readAsDataURL(file);
        }
    }

    // Handle profile selection change
    handleProfileSelection(event) {
        this.selectedProfile = event.detail.value;
        this.loadProfilePreferences(); // Load preferences for the selected profile
        this.dispatchProfileChangeEvent(); // Notify other components
    }

    // Update specific preference for the selected profile
    updateProfilePreference(key, value) {
        if (this.profiles[this.selectedProfile]) {
            this.profiles[this.selectedProfile][key] = value;
        }
    }

    // Save all profiles and preferences to localStorage
    savePreferences() {
        localStorage.setItem('userProfiles', JSON.stringify(this.profiles)); // Persist multiple profiles
    }

    // Load profiles and preferences from localStorage
    loadPreferences() {
        const savedProfiles = localStorage.getItem('userProfiles');
        if (savedProfiles) {
            this.profiles = JSON.parse(savedProfiles);
            this.loadProfilePreferences(); // Set preferences for the selected profile
        }
    }

    // Load preferences for the selected profile
    loadProfilePreferences() {
        const currentProfile = this.profiles[this.selectedProfile];
        if (currentProfile) {
            this.theme = currentProfile.theme;
            this.language = currentProfile.language;
            this.notificationPreferences = currentProfile.notifications;
            this.profilePicture = currentProfile.picture;
        }
    }

    // Dispatch a custom event to notify other components about profile updates
    dispatchProfileChangeEvent() {
        const profileChangeEvent = new CustomEvent('profilechange', {
            detail: {
                theme: this.theme,
                language: this.language,
                notifications: this.notificationPreferences,
                picture: this.profilePicture
            }
        });
        this.dispatchEvent(profileChangeEvent);
    }
}