@isTest
public class AccountTriggerTest {
    @isTest
    static void testAccountTrigger() {
        // Create an Account with high revenue
        Account accHigh = new Account(Name = 'High Revenue Account', AnnualRevenue = 2000000);
        insert accHigh;

        // Create an Account with standard revenue
        Account accStandard = new Account(Name = 'Standard Revenue Account', AnnualRevenue = 500000);
        insert accStandard;

        // Verify the Status field is set correctly
        accHigh = [SELECT Account_Status__c FROM Account WHERE Id = :accHigh.Id];
        accStandard = [SELECT Account_Status__c FROM Account WHERE Id = :accStandard.Id];

        System.assertEquals('High Revenue', accHigh.Account_Status__c);
        System.assertEquals('Standard Revenue', accStandard.Account_Status__c);
    }
    /*
     Account with High Revenue:

        Name: "High Revenue Account"
        AnnualRevenue: 2,000,000 (This exceeds the threshold of 1,000,000)
        Account with Standard Revenue:
        
        Name: "Standard Revenue Account"
        AnnualRevenue: 500,000 (This is below the threshold of 1,000,000)
     * */
}