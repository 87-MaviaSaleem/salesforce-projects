import { LightningElement, track, api, wire } from 'lwc';
import searchOpportunities from '@salesforce/apex/OptimizedOppSearchAndEditController.searchOpportunities';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import { refreshApex } from "@salesforce/apex";
import { updateRecord } from "lightning/uiRecordApi";


export default class OptimizedOppSearchWithInlineEdit extends LightningElement {
    @track filteredResults = [];

    draftValues = []; // Track edits
    @track columns = [
        { label: 'Opportunity Name', fieldName: 'Name', type: 'text', editable: true },
        { label: 'Stage', fieldName: 'StageName', type: 'text', editable: true },
        { label: 'Amount', fieldName: 'Amount', type: 'currency', editable: true },
        { label: 'Close Date', fieldName: 'CloseDate', type: 'date' }
    ]; 

    debounceTimer;
    searchCache = {};


    handleSearch(event) {
        const searchKey = event.target.value.trim().toLowerCase();
        clearTimeout(this.debounceTimer);
        this.debounceTimer = setTimeout(() => {
            if (this.searchCache[searchKey]) {
                this.filteredResults = this.searchCache[searchKey];
            } else {
                this.fetchOpportunities(searchKey);
            }
        }, 300);
    }

    fetchOpportunities(query) {
        searchOpportunities({ searchKey: query })
            .then(results => {
                this.searchCache[query] = results;
                this.filteredResults = results;
            })
            .catch(error => {
                console.error('Error fetching opportunities:', error);
            });
    }

    

    handleSave(event) {
        // Convert datatable draft values into record objects
        this.draftValues = event.detail.draftValues;
        const inputsItems = this.draftValues.slice().map(draft => {
            const fields = Object.assign({}, draft);
            return { fields };
        });
    
    
        try {
          // Update all records in parallel thanks to the UI API
          const promises = inputsItems.map(recordInput => updateRecord(recordInput));
        Promise.all(promises).then(res => {
            this.dispatchEvent(
                new ShowToastEvent({
                    title: 'Success',
                    message: 'Records Updated Successfully!!',
                    variant: 'success'
                })
            );
            this.draftValues = [];
            return refreshApex(this.filteredResults);
        }).catch(error => {
            this.dispatchEvent(
                new ShowToastEvent({
                    title: 'Error',
                    message: 'An Error Occured!!'+error,
                    variant: 'error'
                })
            );
        }).finally(() => {
            this.draftValues = [];
        });
    
        }catch(error){

            console.log('Error--',error);        }
        }

    
}

