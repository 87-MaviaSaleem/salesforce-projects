@isTest
private class OpportunityCountHandlerTest {
    @isTest
    static void testOpportunityCountUpdates() {
        Account testAccount = new Account(Name = 'Test Account');
        insert testAccount;

        Opportunity testOpp1 = new Opportunity(Name = 'Test Opp 1', StageName = 'Prospecting', CloseDate = Date.today(), AccountId = testAccount.Id);
        Opportunity testOpp2 = new Opportunity(Name = 'Test Opp 2', StageName = 'Prospecting', CloseDate = Date.today(), AccountId = testAccount.Id);
        insert new List<Opportunity>{testOpp1, testOpp2};

        testAccount = [SELECT Opportunity_Count__c FROM Account WHERE Id = :testAccount.Id];
        System.assertEquals(2, testAccount.Opportunity_Count__c, 'Opportunity count should be 2 after insert');

        delete testOpp1;

        testAccount = [SELECT Opportunity_Count__c FROM Account WHERE Id = :testAccount.Id];
        System.assertEquals(1, testAccount.Opportunity_Count__c, 'Opportunity count should be 1 after deletion');
        
        // Update to change account
        Opportunity testOpp3 = new Opportunity(Name = 'Test Opp 3', StageName = 'Prospecting', CloseDate = Date.today(), AccountId = testAccount.Id);
        insert testOpp3;

        testAccount = [SELECT Opportunity_Count__c FROM Account WHERE Id = :testAccount.Id];
        System.assertEquals(2, testAccount.Opportunity_Count__c, 'Opportunity count should be updated correctly');
    }
}