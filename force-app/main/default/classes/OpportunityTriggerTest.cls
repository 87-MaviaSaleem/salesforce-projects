@isTest
public class OpportunityTriggerTest {
    @isTest
    static void testOpportunityTrigger() {
        // Create a test Opportunity
        Opportunity opp = new Opportunity(Name = 'Test Opportunity', StageName = 'Prospecting', CloseDate = Date.today());
        insert opp;

        // Create Opportunity Line Items
        OpportunityLineItem lineItem1 = new OpportunityLineItem(OpportunityId = opp.Id, Quantity = 1, UnitPrice = 100, TotalPrice = 100);
        OpportunityLineItem lineItem2 = new OpportunityLineItem(OpportunityId = opp.Id, Quantity = 2, UnitPrice = 50, TotalPrice = 100);
        insert new List<OpportunityLineItem> { lineItem1, lineItem2 };

        // Refresh the Opportunity to check the Total_Sales__c
        opp = [SELECT Total_Sales__c FROM Opportunity WHERE Id = :opp.Id];
        System.assertEquals(200, opp.Total_Sales__c);

        // Update the Opportunity and check Total_Sales__c again
        opp.StageName = 'Negotiation';
        update opp;

        // Check if the Total_Sales__c field is correctly updated
        opp = [SELECT Total_Sales__c FROM Opportunity WHERE Id = :opp.Id];
        System.assertEquals(200, opp.Total_Sales__c);
    }
}