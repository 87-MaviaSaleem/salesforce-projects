@isTest
public class LeadConversionTriggerTest {
    @isTest
    static void testLeadConversionTrigger() {
        // Create test data
        Lead testLead = new Lead(LastName = 'Doe', Company = 'Test Co', High_Priority__c = true);
        insert testLead;

        // Update the Lead to convert it
        Test.startTest();
        Lead convertedLead = [SELECT Id FROM Lead WHERE Id = :testLead.Id];
        convertedLead.IsConverted = true;
        //convertedLead.ConvertedAccountId = '001XXXXXXXXXXXX'; // Mock Account Id
        update convertedLead;
        Test.stopTest();

        // Verify that a Task has been created
        List<Task> tasks = [SELECT Id, Subject, OwnerId, WhatId, Priority FROM Task WHERE WhatId = :convertedLead.ConvertedAccountId];
        System.assertEquals(1, tasks.size());
        System.assertEquals('Follow up with new Account', tasks[0].Subject);
        System.assertEquals('High', tasks[0].Priority);
    }
}