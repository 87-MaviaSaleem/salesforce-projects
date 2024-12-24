import { LightningElement } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

export default class RealTimeEngagementTracker extends LightningElement {
    eventData = [];
    throttleTimeout;

    // Handle Click Event
    handleClick(event) {
        this.logEventData('click', event.target);
        this.showFeedback('Click recorded!');
    }

    // Handle Hover Event
    handleHover(event) {
        this.logEventData('hover', event.target);
        this.showFeedback('Hover recorded!');
    }

    // Handle Form Submit Event
    handleSubmit(event) {
        event.preventDefault();  // Prevent form submission for demo purposes
        this.logEventData('submit', event.target);
        this.showFeedback('Form submitted!');
    }

    // Log Event Data
    logEventData(eventType, targetElement) {
        const eventInfo = {
            eventType: eventType,
            targetElement: targetElement.tagName,
            elementId: targetElement.id || 'N/A',
            timestamp: new Date().toISOString()
        };

        // Add new event data to the eventData array
        this.eventData = [...this.eventData, eventInfo];  // This triggers reactivity in LWC
    }

    // Show Immediate Feedback to the User
    showFeedback(message) {
        const event = new ShowToastEvent({
            title: 'User Interaction',
            message: message,
            variant: 'success',
            mode: 'pester', // Ensures the toast stays visible for a while
        });
        this.dispatchEvent(event);
    }

    // Throttling Function to Limit Event Logging Frequency
    throttleEventLogging() {
        if (this.throttleTimeout) {
            clearTimeout(this.throttleTimeout);
        }

        this.throttleTimeout = setTimeout(() => {
            console.log('Logged Event Data:', this.eventData);
            // Here you can send data to the server or handle it further
            this.eventData = []; // Reset the array after logging (optional)
        }, 300);  // Log after 300ms delay (adjust as needed)
    }

    // Dynamic Event Listener Attachment
    connectedCallback() {
        this.attachDynamicEventListeners();
    }

    attachDynamicEventListeners() {
        // Dynamically attach event listeners to elements
        const button = this.template.querySelector('lightning-button');
        if (button) {
            button.addEventListener('click', (event) => this.handleClick(event));
        }

        const hoverElement = this.template.querySelector('div');
        if (hoverElement) {
            hoverElement.addEventListener('mouseover', (event) => this.handleHover(event));
        }
    }
}