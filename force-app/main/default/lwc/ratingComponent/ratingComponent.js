import { LightningElement, track } from 'lwc';

export default class RatingComponent extends LightningElement {
  @track feedbackMessage = '';
  @track selectedRating = 0;
  @track userFeedback = '';
  @track isPopupVisible = false;

  // Handle star rating selection
  handleRating(event) {
    const rating = parseInt(event.target.dataset.value, 10);
    if (rating) {
      this.selectedRating = rating;
      this.feedbackMessage = `Thank you for rating us ${rating} star${rating > 1 ? 's' : ''}!`;
      this.updateStarColors(rating);
    }
  }

  // Handle star hover effect
  handleHover(event) {
    const rating = parseInt(event.target.dataset.value, 10);
    if (rating) {
      this.updateStarColors(rating);
    }
  }

  // Reset stars on mouse leave
  handleMouseLeave() {
    this.updateStarColors(this.selectedRating);
  }

  // Update star colors dynamically
  updateStarColors(rating) {
    const stars = this.template.querySelectorAll('.star');
    stars.forEach((star) => {
      const starValue = parseInt(star.dataset.value, 10);
      star.style.color = starValue <= rating ? '#FFC107' : '#E0E0E0';
    });
  }

  // Reset rating and feedback
  resetRating() {
    this.selectedRating = 0;
    this.feedbackMessage = '';
    this.userFeedback = '';
    this.updateStarColors(0);

    // Clear the textarea value explicitly
    const feedbackInput = this.template.querySelector('.feedback-input');
    if (feedbackInput) {
      feedbackInput.value = '';
    }
  }

  // Capture feedback input
  handleFeedbackInput(event) {
    this.userFeedback = event.target.value;
  }

  // Handle feedback submission
  handleSendFeedback() {
    if (this.userFeedback.trim()) {
      this.isPopupVisible = true;
    } else {
      alert('Please write some feedback before sending.');
    }
  }

  // Close popup
  closePopup() {
    this.isPopupVisible = false;
  }
}