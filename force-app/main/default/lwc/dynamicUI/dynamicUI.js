import { LightningElement } from 'lwc';

export default class dynamicUI extends LightningElement {
    name = '';
    email = '';
    message = '';
    selectedOption = '';
    selectedDate = '';
    nameError = false;
    emailError = false;
    messageError = false;

    // Dropdown options for combobox
    options = [
        { label: 'Option 1', value: 'option1' },
        { label: 'Option 2', value: 'option2' },
        { label: 'Option 3', value: 'option3' }
    ];

    // Disable Submit if there are errors or empty fields
    get isSubmitDisabled() {
        return this.nameError || this.emailError || this.messageError || !this.name || !this.email || !this.message;
    }

    get hasErrors() {
        return this.nameError || this.emailError || this.messageError;
    }

    handleInputChange(event) {
        const fieldName = event.target.dataset.id;
        const value = event.target.value;

        if (fieldName === 'name') {
            this.nameError = !value;
            this.name = value;
        } else if (fieldName === 'email') {
            this.emailError = !this.validateEmail(value);
            this.email = value;
        } else if (fieldName === 'message') {
            this.messageError = !value;
            this.message = value;
        } else if (fieldName === 'dropdown') {
            this.selectedOption = value;
        }
    }

    validateEmail(email) {
        const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        return emailPattern.test(email);
    }

    handleSubmit(event) {
        event.preventDefault();
        event.stopPropagation();

        if (this.validateForm()) {
            console.log('Form submitted successfully');
        }
    }

    validateForm() {
        let isValid = true;

        if (!this.name) {
            this.nameError = true;
            isValid = false;
        } else {
            this.nameError = false;
        }

        if (!this.email || !this.validateEmail(this.email)) {
            this.emailError = true;
            isValid = false;
        } else {
            this.emailError = false;
        }

        if (!this.message) {
            this.messageError = true;
            isValid = false;
        } else {
            this.messageError = false;
        }

        return isValid;
    }

    handleDateChange(event) {
        this.selectedDate = event.target.value;
    }

    handleActionClick() {
        console.log('Action button clicked');
    }
}