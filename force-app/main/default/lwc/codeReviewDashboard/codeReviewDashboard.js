// CodeReviewDashboard.js
import { LightningElement, track } from 'lwc';

export default class CodeReviewDashboard extends LightningElement {
    @track reviewData = { status: 'Pending', comment: 'Initial Review' };

    // Listen for the 'reviewstatuschange' event from the child component
    handleReviewStatusChange(event) {
        const { status, comment } = event.detail;
        this.reviewData = { status, comment };
    }
}