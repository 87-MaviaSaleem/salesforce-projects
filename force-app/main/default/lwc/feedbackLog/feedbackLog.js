import { LightningElement } from 'lwc';

export default class FeedbackLog extends LightningElement {
    feedbackLogs = [];  // Array to store feedback logs
    logId = 0;  // A counter for generating unique log IDs

    // Handle the feedbacksubmit event and log data
    handleFeedbackSubmit(event) {
        const feedbackData = event.detail;
        const newLog = { id: ++this.logId, ...feedbackData };
        this.feedbackLogs = [...this.feedbackLogs, newLog];  // Add new log entry
    }
}