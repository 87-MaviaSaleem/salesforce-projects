import { LightningElement } from 'lwc';

export default class ChatbotInterface extends LightningElement {
    userMessage = '';
    isLoading = false;
    conversation = [];

    // Getter for checking if conversation exists
    get hasConversation() {
        return this.conversation.length > 0;
    }

    // Getter for Send button's disabled state
    get isSendButtonDisabled() {
        return this.isLoading || !this.userMessage;
    }

    // Event handler for user input change
    handleInputChange(event) {
        this.userMessage = event.target.value;
    }

    // Method to send the message
    async sendMessage() {
        if (this.userMessage.trim() === '') {
            return; // Don't send if the message is empty
        }

        this.isLoading = true;

        // Preprocess user message and add to conversation
        const userMessage = { 
            id: Date.now(), 
            sender: 'User', 
            text: this.userMessage,
            className: 'user-message'
        };
        this.conversation = [...this.conversation, userMessage];

        // Simulate backend call with a delay
        try {
            const response = await this.fetchResponseFromBackend(this.userMessage);

            if (!response || response.includes('error')) {
                throw new Error('Invalid response from backend');
            }

            // Preprocess bot message and add to conversation
            const botMessage = { 
                id: Date.now() + 1, 
                sender: 'Assistant', 
                text: response,
                className: 'bot-message'
            };

            this.conversation = [...this.conversation, botMessage];
        } catch (error) {
            const errorMessage = {
                id: Date.now() + 1,
                sender: 'Assistant',
                text: 'Sorry, I couldn\'t find an answer to that. Please rephrase your query.',
                className: 'error-message'
            };

            this.conversation = [...this.conversation, errorMessage];
            console.error('Error in fetching bot response:', error); 
        } finally {
            this.isLoading = false;
            this.userMessage = '';  // Clear the input field after sending the message
        }
    }

    // Simulate backend call for response
    async fetchResponseFromBackend(message) {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                if (Math.random() < 0.2) {
                    reject('Backend error');
                } else {
                    resolve(`${message}`);
                }
            }, 1500);
        });
    }

    // Method to clear the chat (conversation history)
    clearChat() {
        this.conversation = []; // Clears the conversation
        this.userMessage = ''; // Clears the input field
    }
}