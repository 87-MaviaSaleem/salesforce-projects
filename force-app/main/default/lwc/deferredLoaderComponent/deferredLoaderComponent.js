import { LightningElement } from 'lwc';

export default class DeferredLoaderComponent extends LightningElement {
    isComponentLoaded = false;
    isLoading = false;
    handleLoad() {
        // Set the flag to true to load the heavy component
        this.isComponentLoaded = true;

        this.isLoading = true;  // Show loading state
        // Simulate an asynchronous operation (e.g., fetching data or a long-running process)
        setTimeout(() => {
            this.isComponentLoaded = true;
            this.isLoading = false;  // Hide loading state
        }, 2000); // Simulate a delay (e.g., 2 seconds)

    }
}