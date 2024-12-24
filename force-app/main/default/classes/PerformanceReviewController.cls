public with sharing class PerformanceReviewController {

    @AuraEnabled(cacheable=true)
    public static List<Performance_Review__c> getPerformanceReviews() {

        // Query for Performance Review records
        List<Performance_Review__c> performanceReviews = [
            SELECT Metric_Name__c, Before_Lazy_Load__c, After_Lazy_Load__c, User_Feedback__c
            FROM Performance_Review__c WITH SECURITY_ENFORCED
        ];

        return performanceReviews;
    }
}