import { LightningElement, track, wire } from 'lwc';
import getOpportunities from '@salesforce/apex/OpportunitySearchController.getOpportunities';

export default class OpportunitySearch extends LightningElement {

    @track searchQuery = '';
    @track opportunities = [];
    @track filteredResults = [];

    // Opportunity Columns to be displayed in the Data Table
    @track columns = [
        { label: 'Opportunity Name', fieldName: 'Name', type: 'text' },
        { label: 'Stage', fieldName: 'StageName', type: 'text' },
        { label: 'Amount', fieldName: 'Amount', type: 'currency' },
        { label: 'Close Date', fieldName: 'CloseDate', type: 'date' }
    ];

    
    @wire(getOpportunities)
    wiredOpportunities({ data, error }) {
        if (data) {
            this.opportunities = data;
            this.filteredResults = data;
        } else if (error) {
            console.error('Error faced while fetching the opportunities:', error);
        }
    }

    // Method to handle the search logic
    handleSearch(event) {
        const query = event.target.value.toLowerCase();

        // Search logic
        this.filteredResults = this.opportunities.filter(opportunity =>
            opportunity.Name.toLowerCase().includes(query)
        );
    }
}
