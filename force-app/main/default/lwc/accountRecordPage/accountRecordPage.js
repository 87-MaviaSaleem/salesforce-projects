import { LightningElement, wire } from 'lwc';
import { CurrentPageReference } from 'lightning/navigation';

export default class AccountRecordPage extends LightningElement {
    recordId;

    @wire(CurrentPageReference)
    getPageReferenceParameters(currentPageReference) {
       if (currentPageReference) { 
          
          this.recordId = currentPageReference.attributes.recordId || null; 
          console.log('current pagereference',this.recordId);

       }
    }
}