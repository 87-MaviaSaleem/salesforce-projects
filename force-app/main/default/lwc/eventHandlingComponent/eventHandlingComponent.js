// EventHandlingComponent.js
import { LightningElement } from 'lwc';

export default class EventHandlingComponent extends LightningElement {
    handleClick(event) {
        event.preventDefault();
        event.stopPropagation();
        console.log("Default prevented and propagation stopped.");
    }
}