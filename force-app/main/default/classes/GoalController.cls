public with sharing class GoalController {
    @AuraEnabled(cacheable=true)
    public static Goal__c getGoal() {
        try {
            // Fetch the first goal record from Salesforce
            Goal__c goal = [SELECT Target_Duration__c, Target_Calories__c, Target_Distance__c FROM Goal__c LIMIT 1];
            return goal;
        } catch (Exception e) {
            throw new AuraHandledException('Error fetching goal: ' + e.getMessage());
        }
    }

    @AuraEnabled
    public static void saveGoal(Decimal targetDuration, Decimal targetCalories, Decimal targetDistance) {
        try {
            Goal__c goal = new Goal__c(
                Target_Duration__c = targetDuration,
                Target_Calories__c = targetCalories,
                Target_Distance__c = targetDistance
            );
            insert goal;
        } catch (Exception e) {
            throw new AuraHandledException('Error saving goal: ' + e.getMessage());
        }
    }
}