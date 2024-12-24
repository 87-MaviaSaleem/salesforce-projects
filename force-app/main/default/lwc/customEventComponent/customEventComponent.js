import { LightningElement, track } from 'lwc';

export default class CustomEventComponent extends LightningElement {
    @track currentMessage = ''; // Stores the current displayed message
    @track messageToSend = ''; // Stores the input message to be queued
    @track priorityLevel = 'medium'; // Default priority
    @track messageQueue = []; // Queue to store pending messages
    priorityOptions = [
        { label: 'High', value: 'high' },
        { label: 'Medium', value: 'medium' },
        { label: 'Low', value: 'low' },
    ];

    // Handle input change for the message
    handleInputChange(event) {
        this.messageToSend = event.target.value; // Update the message to send
    }

    // Handle priority change
    handlePriorityChange(event) {
        this.priorityLevel = event.target.value; // Update selected priority level
    }

    // Add a message to the queue with priority
    addToQueue() {
        if (this.messageToSend.trim() !== '') {
            const newMessage = {
                text: this.messageToSend,
                priority: this.priorityLevel
            };
            // Add the message to the queue based on priority
            if (this.priorityLevel === 'high') {
                this.messageQueue.unshift(newMessage); // Add high priority at the front
            } else {
                this.messageQueue.push(newMessage); // Add medium/low priority at the end
            }
            this.messageToSend = ''; // Clear the input field
        } else {
            alert('Message cannot be empty!'); // Basic validation
        }
    }

    // Process the next message from the queue (highest priority first)
    processNextMessage() {
        if (this.messageQueue.length > 0) {
            // Find the next message based on priority (high priority first)
            const nextMessage = this.messageQueue.shift(); // Remove the first message in the queue
            this.dispatchMessageEvent(nextMessage); // Dispatch custom event for processing
        } else {
            alert('No messages in the queue to process!');
        }
    }

    // Remove the last message from the queue
    removeLastMessage() {
        if (this.messageQueue.length > 0) {
            this.messageQueue.pop(); // Remove the last message from the queue
        } else {
            alert('No messages to remove!');
        }
    }

    // Dispatch a custom event with the next message
    dispatchMessageEvent(message) {
        const customEvent = new CustomEvent('messageevent', {
            detail: message.text, // Send the processed message text as the event detail
        });
        this.dispatchEvent(customEvent); // Dispatch the event
        this.currentMessage = message.text; // Update the currently displayed message
    }
}