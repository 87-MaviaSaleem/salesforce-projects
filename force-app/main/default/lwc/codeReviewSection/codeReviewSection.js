// CodeReviewSection.js
import { LightningElement, track } from 'lwc';

export default class CodeReviewSection extends LightningElement {
    @track comment = '';        // Store the comment input
    @track errorMessage = '';   // Error message for empty comment

    handleCommentChange(event) {
        this.comment = event.target.value;
    }

    handleApprove() {
        if (this.comment.trim() === '') {
            this.errorMessage = 'Comment cannot be empty';
            return;
        }
        this.errorMessage = '';
        // Dispatch the 'reviewstatus' event to notify the parent
        this.dispatchReviewEvent('Approved');
    }

    handleReject() {
        // Dispatch the 'reviewstatus' event to notify the parent
        this.dispatchReviewEvent('Rejected');
    }

    dispatchReviewEvent(status) {
        const reviewEvent = new CustomEvent('reviewstatus', {
            detail: {
                status,
                comment: this.comment,  // Pass comment along with status
            }
        });
        this.dispatchEvent(reviewEvent); // Dispatch the custom event to parent
    }
}