import { LightningElement, api, track } from 'lwc';

export default class GlobalErrorManager extends LightningElement {
  @track errorMessage = 'I m Dummy Error';
  @track hasError = true;

  @api handleGlobalError() {
    //this.errorMessage = this.formatError(error);
    this.hasError = true;
    console.error('Global Error:', error);
    // Log error to backend or external monitoring service.
    this.logErrorToServer(error);
  }

  formatError(error) {
    return error.message || 'An unexpected error occurred.';
  }

  logErrorToServer(error) {
    // Example backend call (stub)
    console.log('Logging error to server:', error);
    // Actual server call logic here.
  }

  clearError() {
    this.hasError = false;
    this.errorMessage = '';
  }
}