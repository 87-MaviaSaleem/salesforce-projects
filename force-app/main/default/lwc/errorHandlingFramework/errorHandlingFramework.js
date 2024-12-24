import { LightningElement, api, track } from 'lwc';

export default class ErrorHandlingFramework extends LightningElement {
  @track hasError = false;
  @track errorMessage = '';

  @api
  handleError(error) {
    this.hasError = true;
    this.errorMessage = this.formatErrorMessage(error);
    console.error('Error logged:', error);
    this.notifyUser();
  }

  formatErrorMessage(error) {
    if (error && error.body && error.body.message) {
      return `Error: ${error.body.message}`;
    }
    return 'An unexpected error occurred. Please try again later.';
  }

  notifyUser() {
    // Placeholder for custom notification logic (e.g., toast notifications)
    this.dispatchEvent(
      new CustomEvent('showtoast', {
        detail: {
          title: 'Error',
          message: this.errorMessage,
          variant: 'error',
        },
      })
    );
  }
}