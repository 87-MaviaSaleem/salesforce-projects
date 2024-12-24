import { LightningElement } from 'lwc';

export default class ParentComponent extends LightningElement {
    parentdata = 'Hello from Parent !!!'
    dataRecievedFromChild='' 
    receivedEvent(event) {
         console.log('Event received from child component'); 
         this.dataRecievedFromChild = event.detail
    }
}