import { LightningElement, api } from 'lwc';

export default class AnimatedError extends LightningElement {
  @api errorMessage = ''; // Stores the error message
  showError = false;      // Tracks the visibility of the error

  // Public method to display the error message
  @api
  displayError(message) {
    this.errorMessage = message;
    this.showError = true;

    // Automatically hide the error after 4 seconds
    setTimeout(() => {
      this.showError = false;
    }, 4000);
  }
}