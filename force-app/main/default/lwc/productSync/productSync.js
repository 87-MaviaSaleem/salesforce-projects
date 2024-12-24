import { LightningElement, track } from 'lwc';
import syncProductData from '@salesforce/apex/InventorySyncController.syncProductData';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import ChartJs from '@salesforce/resourceUrl/chart_js';
import { loadScript } from 'lightning/platformResourceLoader';

export default class ProductSync extends LightningElement {
    @track productData = [];
    @track error = null;
    @track isLoading = false;
    chart;
    retryCount = 0;
    maxRetries = 3;

    columns = [
        { label: 'Product Name', fieldName: 'Name', type: 'text' },
        { label: 'Standard Price', fieldName: 'StandardPrice__c', type: 'currency' },
        { label: 'Description', fieldName: 'Description', type: 'text' }
    ];

    connectedCallback() {
        this.fetchProductData();
    }

    fetchProductData() {
        this.isLoading = true;
        this.error = null;
        this.retryCount = 0;
        this._syncProductDataWithRetry();
    }

    _syncProductDataWithRetry() {
        syncProductData()
            .then((result) => {
                this.productData = result;
                this.showToast('Success', 'Products synchronized successfully!', 'success');
                this.isLoading = false;
                this.initializeChart();
            })
            .catch((error) => {
                if (this.retryCount < this.maxRetries) {
                    const delay = Math.pow(2, this.retryCount) * 1000;
                    this.retryCount++;
                    setTimeout(() => {
                        this._syncProductDataWithRetry();
                    }, delay);
                } else {
                    this.error = error.body ? error.body.message : 'Unknown error occurred';
                    this.showToast('Error', 'Failed to synchronize products after multiple attempts.', 'error');
                    this.isLoading = false;
                }
            });
    }

    handleManualSync() {
        this.fetchProductData();
    }

    showToast(title, message, variant) {
        const event = new ShowToastEvent({ title, message, variant });
        this.dispatchEvent(event);
    }

    renderedCallback() {
        if (this.chart) return;

        loadScript(this, ChartJs)
            .then(() => {
                this.initializeChart();
            })
            .catch(error => {
                console.error('Error loading Chart.js:', error);
            });
    }

    initializeChart() {
        if (this.productData.length === 0) {
            console.warn('No product data available to display in chart.');
            return;
        }

        const ctx = this.template.querySelector('canvas').getContext('2d');
        const labels = this.productData.map(product => product.Name);
        const data = this.productData.map(product => product.StandardPrice__c);

        this.chart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [
                    {
                        label: 'Product Price',
                        data: data,
                        backgroundColor: 'rgba(75, 192, 192, 0.2)',
                        borderColor: 'rgba(75, 192, 192, 1)',
                        borderWidth: 1
                    }
                ]
            },
            options: {
                responsive: true,
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });
    }

    disconnectedCallback() {
        if (this.chart) {
            this.chart.destroy();
        }
    }
}