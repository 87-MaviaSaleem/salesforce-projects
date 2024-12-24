import { LightningElement, api } from 'lwc'; 
 export default class ChildComponent extends LightningElement { 
  @api parentdata;
   childInputText="" 
   childInputTextHandler (event) { 
    this.childInputText = event.target.value 
  } 
  childClickHandler(){ 
    this.dispatchEvent(new CustomEvent('sendevent', { 
      detail: this.childInputText 
       })) 
       } 
      }