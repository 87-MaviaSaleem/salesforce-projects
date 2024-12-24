import { LightningElement } from 'lwc';

export default class EventParent extends LightningElement {
    handleParentClick(event) {
        console.log('Parent received event!');
        console.log(`Event type: ${event.type}`);
    }
}