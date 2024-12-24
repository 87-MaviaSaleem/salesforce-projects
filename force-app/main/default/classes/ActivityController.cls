public with sharing class ActivityController {

    // Method to save activity data
    @AuraEnabled
    public static void saveActivity(String name, Integer duration, String activityDate) {
        System.debug(activityDate);
        if (activityDate == null) {
            throw new AuraHandledException('Date cannot be null');
        }
        Activity__c activity = new Activity__c(
            Name = name,
            Duration__c = duration,
            Date__c = activityDate
        );
        try {
            insert activity;
        } catch (DmlException e) {
            throw new AuraHandledException('Error saving activity: ' + e.getMessage());
        }
    }

    // Method to retrieve all logged activities
    @AuraEnabled(cacheable=true)
    public static List<Activity__c> getActivities() {
        try {
            return [SELECT Name, Duration__c, Date__c FROM Activity__c ORDER BY Date__c DESC];
        } catch (Exception e) {
            throw new AuraHandledException('Error retrieving activities: ' + e.getMessage());
        }
    }
}