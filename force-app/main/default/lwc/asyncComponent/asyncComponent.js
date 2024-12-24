import { LightningElement } from 'lwc';
import getData from '@salesforce/apex/ApexDataController.getData1';

export default class AsyncComponent extends LightningElement {
    async fetchDataFromApex() {
        try {
            // Call the Apex method using await
            const data = await getData();
            console.log('Data from Apex:', data);
        } catch (error) {
            // Handle any errors that occur
            console.error('Apex error:', error);
        }
    }
}