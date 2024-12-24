import { LightningElement } from 'lwc';

export default class LoginWithFeedback extends LightningElement {
  currentStep = 1;
  step1Name = '';
  step2Income = '';

  get isFirstStep() {
    return this.currentStep === 1;
  }

  get isLastStep() {
    return this.currentStep === 3;
  }

  // Getters to check the step
  get isStep1() {
    return this.currentStep === 1;
  }

  get isStep2() {
    return this.currentStep === 2;
  }

  get isStep3() {
    return this.currentStep === 3;
  }

  handleInputChange(event) {
    const fieldName = event.target.label;
    if (fieldName === 'Name') {
      this.step1Name = event.target.value;
    } else if (fieldName === 'Income') {
      this.step2Income = event.target.value;
    }
  }

  goToPreviousStep() {
    if (this.currentStep > 1) {
      this.currentStep -= 1;
    }
  }

  goToNextStep() {
    if (this.currentStep < 3) {
      this.currentStep += 1;
    }
  }
}