import { LightningElement } from 'lwc';

export default class EventMethodsComponent extends LightningElement {
    // Method to emit a custom event
    emitCustomEvent() {
        // 🌟 Step 1: Create a custom event with a detail object
        const customEvent = new CustomEvent('mycustomevent', {
            detail: { message: 'Custom event triggered!' }
        });

        // 🌟 Step 2: Dispatch the custom event
        this.dispatchEvent(customEvent);
        console.log('Custom event emitted with message:', customEvent.detail.message);
    }
}