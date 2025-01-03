import { LightningElement, track, wire } from 'lwc';
import getOpportunities from '@salesforce/apex/OpportunitySearchController.getOpportunities';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

export default class OpportunitySearch extends LightningElement {

    @track opportunities = [];
    @track currentPage = 1;
    @track pageSize = 10;
    @track totalOpps = 0;
    @track isLoading = false;

    // Opportunity Columns to be displayed in the Data Table
    @track columns = [
        { label: 'Opportunity Name', fieldName: 'Name', type: 'text' },
        { label: 'Stage', fieldName: 'StageName', type: 'text' },
        { label: 'Amount', fieldName: 'Amount', type: 'currency' },
        { label: 'Close Date', fieldName: 'CloseDate', type: 'date' }
    ];

    // To disable the "Previous" button
    get isPreviousDisabled(){
        return this.currentPage === 1;
    }

    // To disable the "Next" button
    get isNextDisabled(){
        return this.currentPage * this.pageSize >= this.totalOpps;
    }

    // To calculate total no. of pages
    get totalPages(){
        return Math.ceil(this.totalOpps / this.pageSize);
    }

    // To calculate the offset for the current page
    get offset(){
        return (this.currentPage - 1) * this.pageSize;
    }

    get isFilterRecordAvailable(){
        return this.opportunities.length > 0;
    }

    
    @wire(getOpportunities, { pageNumber: '$currentPage', pageSize: '$pageSize' })
    wiredOpportunities(result) {
        if (result.data) {

            this.opportunities = result.data.opportunities;
            this.filteredResults = result.data.opportunities;
            this.totalOpps = result.data.total;
            this.isLoading = false;

            
        } else if (result.error) {

            console.error('Error faced while fetching the opportunities:', error);
            this.isLoading = false;
            this.showToast('Error', 'Failed to fetch the opportunities.', 'error');

        }
    }
    

    // Handle the "Next Page" button
    handleNextPage() {
        if (this.currentPage * this.pageSize < this.totalOpps) {
            this.isLoading = true;
            this.currentPage++;
        }
    }

    // Handle the "Previous Page" button
    handlePreviousPage() {
        if (this.currentPage > 1) {
            this.isLoading = true;
            this.currentPage--;
        }
    }
    
    // To show toast messages
    showToast(title, message, variant) {
        const event = new ShowToastEvent({
            title, message, variant
        });
        this.dispatchEvent(event);
    }
}