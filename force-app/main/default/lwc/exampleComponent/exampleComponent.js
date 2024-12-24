import { LightningElement, track } from 'lwc';
import fetchData from '@salesforce/apex/ExampleController.fetchData';

export default class ExampleComponent extends LightningElement {
    @track items = [];
    @track isDataAvailable = false;

    connectedCallback() {
        this.initializeData();
    }

    async initializeData() {
        try {
            const data = await fetchData();
            this.items = data;
            this.isDataAvailable = this.items.length > 0;
        } catch (error) {
            console.error('Error fetching data', error);
        }
    }
}