// lazyLoadPerformance.js
import { LightningElement ,api} from 'lwc';

export default class LazyLoadPerformance extends LightningElement {
    isTestCompleted = false;          // Boolean to control the display of the test result
    loadTime = 0;                     // Store load time in milliseconds
    userInteractionTime = 0;          // Store user interaction time in milliseconds

    connectedCallback() {
        // Simulate the lazy load test completion on component initialization
        this.completeTest();
    }

    // Simulate the completion of the test and the timing data
    completeTest() {
        // Simulate loading time and interaction time
        this.loadTime = Math.floor(Math.random() * 1000); // Random load time between 0 and 1000ms
        this.userInteractionTime = Math.floor(Math.random() * 500); // Random user interaction time between 0 and 500ms
        
        // Set isTestCompleted to true
        this.isTestCompleted = true;
    }

    // You can also call this method to reset the test state (if needed)
    @api resetTest() {
        this.isTestCompleted = false;
        this.loadTime = 0;
        this.userInteractionTime = 0;
    }
}