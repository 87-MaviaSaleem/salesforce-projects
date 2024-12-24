import { LightningElement, track } from 'lwc';
import getAllFeedbackData from '@salesforce/apex/FeedbackDataController.getAllFeedbackData';

export default class FeedbackDashboard extends LightningElement {
    @track feedbackList = [];
    @track errorMessage;

    connectedCallback() {
        this.template.addEventListener('feedbacksubmitted', this.handleFeedbackSubmitted.bind(this));
        this.fetchAllFeedback();
    }

    fetchAllFeedback() {
        getAllFeedbackData()
            .then(result => {
                this.feedbackList = result;
                this.errorMessage = undefined;
                this.sortFeedback();
            })
            .catch(error => {
                this.errorMessage = error.body ? error.body.message : error.message;
                this.feedbackList = [];
            });
    }

    handleFeedbackSubmitted(event) {
        const newFeedback = event.detail;
        // Insert new feedback at the start for now
        this.feedbackList = [newFeedback, ...this.feedbackList];
        this.sortFeedback();
    }

    sortFeedback() {
        // Inspiring entries are those with FeedbackType__c = 'Suggestion'
        const inspiringEntries = this.feedbackList.filter(feedback => feedback.FeedbackType__c === 'Suggestion');
        const otherEntries = this.feedbackList.filter(feedback => feedback.FeedbackType__c !== 'Suggestion');

        // Sort inspiring entries by timestamp (most recent first)
        inspiringEntries.sort((a, b) =>  new Date(b.Timestamp__c) - new Date(a.Timestamp__c));

        // Take top three inspiring entries 
        const topInspiring = inspiringEntries.slice(0, 3);
        const remainingInspiring = inspiringEntries.slice(3);

        // Reconstruct the feedbackList
        this.feedbackList = [...topInspiring, ...remainingInspiring, ...otherEntries];
    }
}