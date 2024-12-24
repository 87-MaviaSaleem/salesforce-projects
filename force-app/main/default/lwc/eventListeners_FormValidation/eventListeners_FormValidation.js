import { LightningElement } from 'lwc';

export default class EventListeners_FormValidation extends LightningElement {
    
   // Email validation method
   validateEmail(event) {
    const email = event.target.value;
    const isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    event.target.style.borderColor = isValid ? 'green' : 'red';
}

// Lifecycle method to attach the event listener after component renders
renderedCallback() {
    const inputField = this.template.querySelector('lightning-input input');
    if (inputField) {
        inputField.addEventListener('keyup', this.validateEmail);
    }
}

// Lifecycle method to remove the event listener when component is destroyed
disconnectedCallback() {
    const inputField = this.template.querySelector('lightning-input input');
    if (inputField) {
        inputField.removeEventListener('keyup', this.validateEmail);
    }
}
}