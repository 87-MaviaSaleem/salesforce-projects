import { LightningElement } from 'lwc';
import logError from '@salesforce/apex/ErrorMetricsController.logError';

export default class ErrorMetrics extends LightningElement {
    logErrorWithSeverity(errorMessage, severity) {
        logError({ errorMessage: errorMessage, severity: severity })
            .then(() => {
                // Handle successful logging
            })
            .catch(error => {
                // Handle error during logging
            });
    }

    // Example usage when an error occurs
    handleError(event) {
        const errorMessage = event.detail.message;
        const severity = this.determineSeverity(errorMessage);
        this.logErrorWithSeverity(errorMessage, severity);
    }

    determineSeverity(errorMessage) {
        // Logic to determine severity based on errorMessage
        // For simplicity, return 'High' for this example
        return 'High';
    }
}