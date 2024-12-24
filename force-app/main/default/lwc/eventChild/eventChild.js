import { LightningElement } from 'lwc';

export default class EventChild extends LightningElement {
    triggerEvent() {
        const event = new CustomEvent('childclick', {
            bubbles: true,
            composed: true
        });
        this.dispatchEvent(event);
        console.log('Event dispatched without stopping propagation.');
    }

    triggerEventWithStop(event) {
        const customEvent = new CustomEvent('childclick', {
            bubbles: true,
            composed: true
        });
        this.dispatchEvent(customEvent);
        event.stopPropagation();
        console.log('Event dispatched with stopPropagation.');
    }
}