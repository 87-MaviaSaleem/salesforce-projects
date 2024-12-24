import { LightningElement } from 'lwc';

export default class FormChild extends LightningElement {
    name = '';
    email = '';

    // Update input values dynamically
    handleInputChange(event) {
        this[event.target.name] = event.target.value;
    }

    // Dispatch custom event with form data
    handleSubmit() {
        const formData = { name: this.name, email: this.email };
        const customEvent = new CustomEvent('formsubmit', { detail: formData });
        this.dispatchEvent(customEvent);
    }
}