import { LightningElement } from 'lwc';

export default class FormParent extends LightningElement {
    submittedLogs = [];
    logId = 0;

    // Handle the custom event and log data
    handleFormSubmit(event) {
        const logEntry = {
            id: ++this.logId,
            ...event.detail
        };
        this.submittedLogs = [...this.submittedLogs, logEntry];
    }
}