import { LightningElement, wire, track } from 'lwc';
import getVisualizationData from '@salesforce/apex/DataVisualizationController.getVisualizationData';

export default class DataVisualizationComponent extends LightningElement {
    @track selectedType;
    @track visualizationData;

    dataTypeOptions = [
        { label: 'Revenue', value: 'Revenue' },
        { label: 'Expenses', value: 'Expenses' },
    ];

    handleTypeChange(event) {
        this.selectedType = event.detail.value;
        this.fetchVisualizationData();
    }

    fetchVisualizationData() {
        getVisualizationData({ visualizationType: this.selectedType, userId: 'currentUserId' })
            .then((data) => {
                this.visualizationData = data;
            })
            .catch((error) => {
                console.error('Error fetching data:', error);
            });
    }
}