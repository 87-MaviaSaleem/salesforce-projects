import { LightningElement, api, track } from 'lwc';

export default class ErrorNotification extends LightningElement {
  @api message; // Error message passed from parent
  @track visible = true; // Controls visibility of the error notification

  handleClose() {
    this.visible = false;
    // Notify parent component that the notification was closed
    this.dispatchEvent(new CustomEvent('close'));
  }
}