import { LightningElement, track } from 'lwc';
import fetchAnalyticsData from '@salesforce/apex/AnalyticsController.fetchAnalyticsData';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

export default class AnalyticsDashboard extends LightningElement {
  @track data = [];
  @track loading = false;
  @track currentPage = 1;
  @track isLastPage = false;

  // Pagination settings
  pageSize = 10;

  // Columns for the datatable
  columns = [
    { label: 'Name', fieldName: 'Name', type: 'text' },
    { label: 'Value', fieldName: 'Value', type: 'number' },
    { label: 'Date', fieldName: 'Date', type: 'date' }, // Example additional column
  ];

  // Computed property to disable the "Previous" button
  get isPreviousDisabled() {
    return this.currentPage === 1;
  }

  // Fetch data for the current page
  fetchData() {
    this.loading = true;

    fetchAnalyticsData({ reportId: 'someReportId', pageNumber: this.currentPage, pageSize: this.pageSize })
      .then((result) => {
        this.data = result.records;
        this.isLastPage = result.isLastPage;
        this.loading = false;
      })
      .catch((error) => {
        this.loading = false;
        this.showToast('Error', 'Failed to load data: ' + error.body.message, 'error');
      });
  }

  // Navigate to the next page
  handleNextPage() {
    if (!this.isLastPage) {
      this.currentPage += 1;
      this.fetchData();
    }
  }

  // Navigate to the previous page
  handlePreviousPage() {
    if (this.currentPage > 1) {
      this.currentPage -= 1;
      this.fetchData();
    }
  }

  // Show toast notification
  showToast(title, message, variant) {
    const event = new ShowToastEvent({
      title,
      message,
      variant,
    });
    this.dispatchEvent(event);
  }

  // Fetch initial data when the component loads
  connectedCallback() {
    this.fetchData();
  }
}