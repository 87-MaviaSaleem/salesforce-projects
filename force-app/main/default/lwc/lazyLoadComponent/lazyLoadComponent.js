import { LightningElement } from 'lwc';

export default class LazyLoadComponent extends LightningElement {
    // State variables to control content visibility and loading state
    showContent = false;
    isLoading = false;

    // Handles button click to start the lazy loading process
    handleLoadMore() {
        this.isLoading = true;  // Show loading spinner

        // Simulate a delay to represent loading content
        setTimeout(() => {
            this.showContent = true;  // Show content after "loading"
            this.isLoading = false;   // Hide loading spinner
        }, 1000);  // Simulate 1 second load time
    }
}