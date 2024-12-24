import { LightningElement } from 'lwc';

export default class MultiStepWizard extends LightningElement {
    formData = {
        step1: { name: '', dob: '' },
        step2: { income: '', loanAmount: '' },
        step3: { creditScore: '', loanTerm: '' }
    };
    currentStep = 1;

    // Getter methods for steps
    get isStepOne() {
        return this.currentStep === 1;
    }

    get isStepTwo() {
        return this.currentStep === 2;
    }

    get isStepThree() {
        return this.currentStep === 3;
    }

    // Progress bar style
    get progressStyle() {
        const stepCount = 3;
        const progressPercentage = (this.currentStep / stepCount) * 100;
        return `width: ${progressPercentage}%`;
    }

    // Handle input change for form data
    handleInputChange(event) {
        const step = event.target.dataset.step;
        const value = event.target.value;
        this.formData[step] = { ...this.formData[step], [event.target.name]: value };
    }

    // Handle step navigation
    handleNavigation(event) {
        const action = event.target.dataset.action;
        if (action === 'next') {
            this.currentStep++;
        } else if (action === 'previous') {
            this.currentStep--;
        }
    }

    // Getter methods to return default values for the inputs (if empty)
    get step1Name() {
        return this.formData.step1.name || '';
    }

    get step1Dob() {
        return this.formData.step1.dob || '';
    }

    get step2Income() {
        return this.formData.step2.income || '';
    }

    get step2LoanAmount() {
        return this.formData.step2.loanAmount || '';
    }

    get step3CreditScore() {
        return this.formData.step3.creditScore || '';
    }

    get step3LoanTerm() {
        return this.formData.step3.loanTerm || '';
    }
}