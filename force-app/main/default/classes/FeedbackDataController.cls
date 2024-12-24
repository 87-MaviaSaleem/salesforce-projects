// File: FeedbackDataController.cls

public with sharing class FeedbackDataController {
    @AuraEnabled(cacheable=true)
    public static List<UserFeedback__c> getAllFeedbackData() {
        return [SELECT Id, UserId__c, FeedbackType__c, FeedbackContent__c, Timestamp__c
                FROM UserFeedback__c
                ORDER BY Timestamp__c DESC];
    }
}