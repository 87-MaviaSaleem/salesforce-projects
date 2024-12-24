import { LightningElement, track } from 'lwc';
import { fetchPerformanceReviews } from './fetchPerformanceReviews';

export default class LazyLoadDataTable extends LightningElement {
    @track data = []; // Holds the data to be displayed
    @track columns = [
        { label: 'Metric Name', fieldName: 'Metric_Name__c', type: 'text' },
        { label: 'Before Lazy Load', fieldName: 'Before_Lazy_Load__c', type: 'number' },
        { label: 'After Lazy Load', fieldName: 'After_Lazy_Load__c', type: 'number' },
        { label: 'User Feedback', fieldName: 'User_Feedback__c', type: 'text' },
    ];
    @track currentIndex = 0; // To keep track of the current position
    @track recordsPerPage = 10; // Number of records to load per page
    @track error;

    connectedCallback() {
        this.loadInitialRecords();
    }

    loadInitialRecords() {
        fetchPerformanceReviews()
            .then(result => {
                this.data = result.slice(this.currentIndex, this.currentIndex + this.recordsPerPage);
                this.currentIndex += this.recordsPerPage;
                this.error = null;
            })
            .catch(error => {
                console.error(error);
                this.error = error.message;
            });
    }

    loadMore() {
        fetchPerformanceReviews()
            .then(result => {
                const newRecords = result.slice(this.currentIndex, this.currentIndex + this.recordsPerPage);
                this.data = [...this.data, ...newRecords];
                this.currentIndex += this.recordsPerPage;
                this.error = null;
            })
            .catch(error => {
                console.error(error);
                this.error = error.message;
            });
    }
}