import { LightningElement, track } from 'lwc';
import getData from '@salesforce/apex/ApexDataController.getData';

export default class DataComponent extends LightningElement {
    @track items = [];

    connectedCallback() {
        getData().then(result => {
            this.items = result;
            console.log('Data fetched:', result);
        }).catch(error => console.error('Error:', error));
    }

    renderedCallback() {
        console.log('Rendered: DOM manipulation is safe here');
        const highlightDiv = this.template.querySelector('.highlight');
        if (highlightDiv) {
            highlightDiv.style.color = 'blue';
        }
    }
}