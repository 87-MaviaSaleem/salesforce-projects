import { LightningElement } from 'lwc';

export default class QueryForm extends LightningElement {
    name = '';
    email = '';
    query = '';
    priority = 'Low';  // Default value
    priorityOptions = [
        { label: 'Low', value: 'Low' },
        { label: 'Medium', value: 'Medium' },
        { label: 'High', value: 'High' }
    ];

    // Update properties dynamically when user types in input fields
    handleInputChange(event) {
        const field = event.target.name;
        if (field === 'name') {
            this.name = event.target.value;
        } else if (field === 'email') {
            this.email = event.target.value;
        } else if (field === 'query') {
            this.query = event.target.value;
        } else if (field === 'priority') {
            this.priority = event.target.value;
        }
    }

    // Dispatch custom event with form data on form submission
    handleSubmit() {
        const formData = {
            id: Date.now(),  // Unique ID based on timestamp
            name: this.name,
            email: this.email,
            query: this.query,
            priority: this.priority
        };

        // Dispatch custom event to parent component with form data
        const event = new CustomEvent('querysubmit', {
            detail: formData
        });

        this.dispatchEvent(event);
    }
}