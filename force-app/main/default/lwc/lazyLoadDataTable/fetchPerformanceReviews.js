// External JS to call Apex method
import getPerformanceReviews from '@salesforce/apex/PerformanceReviewController.getPerformanceReviews';

// force-app/main/default/lwc/fetchPerformanceReviews/fetchPerformanceReviews.js

export const fetchPerformanceReviews = async () => {
    // Fetching logic here (e.g., Apex calls)
    return [
        // Sample data
        { Id: '1', Metric_Name__c: 'Metric 1', Before_Lazy_Load__c: 100, After_Lazy_Load__c: 80, User_Feedback__c: 'Great performance.' },
        { Id: '2', Metric_Name__c: 'Metric 2', Before_Lazy_Load__c: 150, After_Lazy_Load__c: 120, User_Feedback__c: 'Improvement needed.' }
    ];
};