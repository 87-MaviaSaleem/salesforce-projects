import { LightningElement, track } from 'lwc';
import submitIssue from '@salesforce/apex/issueTrackerApex.submitIssue';

export default class IssueTracker extends LightningElement {
    @track name = '';
    @track issueDescription = '';
    @track isSubmitted = false;

    handleNameIdChange(event) {
        this.name = event.target.value;
    }

    handleDescriptionChange(event) {
        this.issueDescription = event.target.value;
    }

    async handleSubmit() {
        try {
            await submitIssue({ Name: this.name, issueDescription: this.issueDescription });
            this.isSubmitted = true;

            // Reset fields after submission
            this.name = '';
            this.issueDescription = '';
        } catch (error) {
            console.error('Error submitting issue:', error);
        }
    }
}