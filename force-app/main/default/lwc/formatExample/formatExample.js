import { LightningElement, api, wire } from 'lwc';
import getSalesData from '@salesforce/apex/SalesDataController.getSalesData';

export default class FormatExample extends LightningElement {
    formattedCurrency;
    formattedPercentage;
    formattedDate;

    @wire(getSalesData)
    wiredSalesData({ error, data }) {
        if (data) {
            const { Amount__c, Discount__c, SaleDate__c } = data[0];

            // Format currency
            this.formattedCurrency = new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: 'USD',
            }).format(Amount__c);

            // Format percentage
            this.formattedPercentage = `${(Discount__c * 100).toFixed(2)}%`;

            // Format date
            this.formattedDate = new Intl.DateTimeFormat('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
            }).format(new Date(SaleDate__c));
        } else if (error) {
            console.error('Error fetching sales data:', error);
        }
    }
}