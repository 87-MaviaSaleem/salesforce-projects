//import { LightningElement, api } from 'lwc';
import { LightningElement } from 'lwc';
import Id from '@salesforce/user/Id';
import getPageSuggestions from '@salesforce/apex/PredictiveNavigationController.getPageSuggestions';
import trackUserInteraction from '@salesforce/apex/PredictiveNavigationController.trackUserInteraction';

export default class PredictiveNavigation extends LightningElement {
   // @api userId; // User ID passed as a parameter to identify the user
   userId = Id;
    suggestedPages = []; // Array to hold the page suggestions
    isLoading = false; // Flag to show loading state
    error; // Variable to store any error message
    sessionDuration = 15; // Simulated session duration (in minutes)
    currentPage = '/home'; // Simulated current page the user is on

    // Lifecycle hook called when the component is inserted into the DOM
    connectedCallback() {
        if (this.userId) {
            this.loadSuggestions(); // Fetch suggestions if userId is provided
            this.trackInteraction(); // Track user interaction data
        } else {
            this.error = 'User ID is not provided.'; // Show error if userId is missing
        }
    }

    /**
     * Fetches page suggestions from the Apex controller based on user behavior
     */
    loadSuggestions() {
        this.isLoading = true; // Show loading spinner while fetching data
        
        // Call the Apex method to get page suggestions
        getPageSuggestions({ userId: this.userId })
            .then((result) => {
                this.suggestedPages = result; // Set the suggestions once fetched
                this.isLoading = false; // Hide loading spinner
            })
            .catch((error) => {
                this.error = error.body.message; // Capture any errors
                this.isLoading = false; // Hide loading spinner
            });
    }

    /**
     * Tracks the user's interaction with the current page (session and page visit data)
     */
    trackInteraction() {
        // Send the interaction data to the Apex class to store it
        trackUserInteraction({
            userId: this.userId,
            pageId: this.currentPage,
            sessionDuration: this.sessionDuration
        })
            .then(() => {
                console.log('User interaction tracked successfully');
            })
            .catch((error) => {
                console.error('Error tracking interaction:', error.body.message);
            });
    }

    /**
     * Navigate the user to the selected page when a suggestion is clicked
     */
    navigateToPage(event) {
        const url = event.target.dataset.url; // Get the page URL from the button's data-url attribute
        window.location.href = url; // Redirect the user to the suggested page
    }
}