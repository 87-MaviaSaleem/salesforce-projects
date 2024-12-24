import { LightningElement } from 'lwc';

export default class FeedbackForm extends LightningElement {
    name = '';
    email = '';
    feedbackType = 'Bug';  // Default feedback type
    priority = 'Low';  // Default priority
    feedbackTypeOptions = [
        { label: 'Bug', value: 'Bug' },
        { label: 'Feature Request', value: 'Feature Request' },
        { label: 'Complaint', value: 'Complaint' }
    ];
    priorityOptions = [
        { label: 'Low', value: 'Low' },
        { label: 'Medium', value: 'Medium' },
        { label: 'High', value: 'High' }
    ];

    // Handle input changes for fields
    handleInputChange(event) {
        const field = event.target.name;
        if (field === 'name') {
            this.name = event.target.value;
        } else if (field === 'email') {
            this.email = event.target.value;
        } else if (field === 'feedbackType') {
            this.feedbackType = event.target.value;
        } else if (field === 'priority') {
            this.priority = event.target.value;
        }
    }

    // Handle form submission
    handleSubmit() {
        const formData = {
            name: this.name,
            email: this.email,
            feedbackType: this.feedbackType,
            priority: this.priority
        };

        // Dispatch custom event with form data
        const event = new CustomEvent('feedbacksubmit', {
            detail: formData
        });

        this.dispatchEvent(event);
    }
}