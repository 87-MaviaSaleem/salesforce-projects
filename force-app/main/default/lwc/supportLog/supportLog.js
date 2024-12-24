import { LightningElement } from 'lwc';

export default class SupportLog extends LightningElement {
    queries = [];

    // Handle the querysubmit event from child component and log the query data
    handleQuerySubmit(event) {
        const queryData = event.detail;
        this.queries = [...this.queries, queryData];  // Add new query to the list
    }
}