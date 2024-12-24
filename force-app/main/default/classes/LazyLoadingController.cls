public with sharing class LazyLoadingController {
    @AuraEnabled
    public static void savePerformanceReview(String metricName, Decimal beforeLoad, Decimal afterLoad, String userFeedback) {
        Performance_Review__c review = new Performance_Review__c(
            Metric_Name__c = metricName,
            Before_Lazy_Load__c = beforeLoad,
            After_Lazy_Load__c = afterLoad,
            User_Feedback__c = userFeedback
        );
        insert review;
    }
}