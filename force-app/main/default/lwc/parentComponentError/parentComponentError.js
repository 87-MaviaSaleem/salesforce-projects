import { LightningElement } from 'lwc';

export default class ParentComponent extends LightningElement {
  triggerError() {
    const errorComponent = this.template.querySelector('c-animated-error');
    if (errorComponent) {
      errorComponent.displayError('Booking failed due to server error!');
    }
  }
}