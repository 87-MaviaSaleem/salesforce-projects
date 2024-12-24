@isTest
private class CaseStatusTriggerTest {
    @isTest
    static void testCaseStatusUpdate() {
        // Create a new case with high priority
        Case highPriorityCase = new Case(Subject='Test High Priority', Priority='High');
        insert highPriorityCase;
        
        // Verify the status is updated
        Case insertedCase = [SELECT Status FROM Case WHERE Id = :highPriorityCase.Id];
        System.assertEquals('In Progress', insertedCase.Status);
        
        // Create a new case with low priority
        Case lowPriorityCase = new Case(Subject='Test Low Priority', Priority='Low');
        insert lowPriorityCase;
        
        // Verify the status is updated
        Case insertedLowCase = [SELECT Status FROM Case WHERE Id = :lowPriorityCase.Id];
        System.assertEquals('Pending', insertedLowCase.Status);
    }
}