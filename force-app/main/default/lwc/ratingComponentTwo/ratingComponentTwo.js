import { LightningElement, track } from 'lwc';

export default class RatingWithFeedback extends LightningElement {
    @track feedbackMessage = '';
    @track userFeedback = '';
    @track selectedRating = 0;
    @track selectedProduct = '';
    showRatingStars = false;
    @track isFeedbackVisible = false; // Controls visibility of feedback textarea
    isSendDisabled = true;
    isResetDisabled = true;

    // Handles product selection and feedback visibility
    handleProductChange(event) {
        this.selectedProduct = event.target.value;
        this.showRatingStars = !!this.selectedProduct;
        this.feedbackMessage = '';
        this.isResetDisabled = !this.selectedProduct;
    
        requestAnimationFrame(() => {
            this.isFeedbackVisible = !!this.selectedProduct;
        });
    }

    // Handles hover on rating stars
    handleHover(event) {
        const rating = event.target.dataset.value;
        this.updateStarColors(rating);
    }

    // Handles mouse leave after hover on rating stars
    handleMouseLeave() {
        this.updateStarColors(this.selectedRating);
    }
    
    // Handles rating selection
    handleRating(event) {
        const rating = event.target.dataset.value;
        if (rating) {
            this.selectedRating = rating;
            this.isSendDisabled = false;
            this.isResetDisabled = false;
            this.updateStarColors(rating);

            this.isFeedbackVisible = true;
        }
    }
    
    // Handles feedback text area changes
    handleFeedbackChange(event) {
        this.userFeedback = event.target.value;
        this.isResetDisabled = !this.userFeedback.trim();
    }

    // Resets rating and feedback fields
    resetRating() {
        const wasProductSelected = !!this.selectedProduct;
    
        this.selectedRating = 0;
        this.selectedProduct = '';
        this.userFeedback = '';
        this.showRatingStars = false;
    
        if (wasProductSelected) {
            this.feedbackMessage = 'Your rating and feedback have been cleared.';
            this.addErrorMessage(this.feedbackMessage);
        } else {
            this.feedbackMessage = 'Please select a product to provide a rating and feedback.';
            this.addErrorMessage(this.feedbackMessage);
        }
    
        this.isSendDisabled = true;
        this.isResetDisabled = true;
    
        this.updateStarColors(0);
    
        const productDropdown = this.template.querySelector('select[name="product"]');
        if (productDropdown) productDropdown.value = '';
    
        const feedbackInput = this.template.querySelector('textarea[name="user-feedback"]');
        if (feedbackInput) feedbackInput.value = '';
        
        this.isFeedbackVisible = false;
    }

    // Sends the feedback data
    sendFeedback() {
        if (!this.selectedProduct || this.selectedRating === 0 || !this.userFeedback.trim()) {
            this.feedbackMessage = 'Please complete all fields!';
            this.addErrorMessage(this.feedbackMessage);
            return;
        }
    
        this.feedbackMessage = `Thank you for your feedback! You rated "${this.selectedProduct}" with ${this.selectedRating} star${this.selectedRating > 1 ? 's' : ''}. Your comment: "${this.userFeedback}".`;
        this.addSuccessMessage(this.feedbackMessage);
        this.autoHideMessage();
        this.isSendDisabled = true;
    
        const feedbackInput = this.template.querySelector('textarea[name="user-feedback"]');
        if (feedbackInput) feedbackInput.value = ''; 
        this.userFeedback = ''; 
    
        const productDropdown = this.template.querySelector('select[name="product"]');
        if (productDropdown) productDropdown.value = ''; 
        this.selectedRating = 0; 
        this.showRatingStars = false;
    
        this.selectedProduct = ''; 
        this.isResetDisabled = true;

        this.isFeedbackVisible = false;
    }
    
    // Updates the star colors based on the selected rating
    updateStarColors(rating) {
        const stars = this.template.querySelectorAll('.star');
        stars.forEach((star) => {
            star.style.color = star.dataset.value <= rating ? 'gold' : '#ccc';
        });
    }

    // Adds error message and applies styling
    addErrorMessage(message) {
        this.feedbackMessage = message;
        this.applyFeedbackClass('error');
    }

    // Adds success message and applies styling
    addSuccessMessage(message) {
        this.feedbackMessage = message;
        this.applyFeedbackClass('success');
    }

    // Applies success or error class for feedback message
    applyFeedbackClass(type) {
        requestAnimationFrame(() => {
            const feedbackElement = this.template.querySelector('.feedback');
            if (feedbackElement) {
                feedbackElement.classList.remove('success', 'error');
                if (type) {
                    feedbackElement.classList.add(type);
                }
            }
        });
    }

    // Auto hides the feedback message after 5 seconds
    autoHideMessage() {
        setTimeout(() => {
            this.feedbackMessage = '';
        }, 5000);
    }
}