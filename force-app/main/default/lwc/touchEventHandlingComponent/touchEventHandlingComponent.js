import { LightningElement } from 'lwc';

export default class TouchEventHandlingComponent extends LightningElement {
    // Handle touchstart event
    handleTouchStart(event) {
        console.log('Touch started at:', event.touches[0].clientX, event.touches[0].clientY);
    }

    // Handle touchend event
    handleTouchEnd(event) {
        console.log('Touch ended at:', event.changedTouches[0].clientX, event.changedTouches[0].clientY);
    }
}