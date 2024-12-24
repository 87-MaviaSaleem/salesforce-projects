import { LightningElement, wire } from 'lwc';
import savePerformanceReview from '@salesforce/apex/LazyLoadingController.savePerformanceReview';

export default class LazyLoadingComponent extends LightningElement {
    isContentLoaded = false;

    loadLazyContent() {
        this.isContentLoaded = true;

        const metricName = 'Page Load Time';
        const beforeLoad = Math.random() * 100;
        const afterLoad = beforeLoad - (Math.random() * 20); // Assume some performance improvement
        const userFeedback = 'Lazy loading improved the page performance.';

        // Call Apex method to save performance review
        savePerformanceReview({ metricName, beforeLoad, afterLoad, userFeedback })
            .then(() => {
                console.log('Performance review saved successfully.');
            })
            .catch(error => {
                console.error('Error saving performance review:', error);
            });

        // Example of logging the performance metrics
        console.log(`Metric Name: ${metricName}`);
        console.log(`Before Lazy Load: ${beforeLoad.toFixed(2)}ms`);
        console.log(`After Lazy Load: ${afterLoad.toFixed(2)}ms`);
        console.log(`User Feedback: ${userFeedback}`);
    }
}