public with sharing class PerformanceLogController {

    @AuraEnabled
    public static void savePerformanceLog(Double loadTime, Double userInteractionTime) {
        // Create a list of PerformanceTestLog__c records
        List<PerformanceTestLog__c> logs = new List<PerformanceTestLog__c>();

        // Create a new performance log record
        PerformanceTestLog__c log = new PerformanceTestLog__c(
            Tool_Used__c = 'LWC Lazy Load Test',
            Load_Time__c = loadTime,
            User_Interaction__c = userInteractionTime
        );

        logs.add(log);

        // Insert the log records in bulk (although we're only inserting one here)
        if (!logs.isEmpty()) {
            insert logs;
        }
    }
}