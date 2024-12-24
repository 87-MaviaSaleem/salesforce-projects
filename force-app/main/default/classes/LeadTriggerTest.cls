@isTest
public class LeadTriggerTest { 
    @isTest 
    static void testAssignLeadOwnerOnInsert() { 
        Test.startTest();
        
        createIndustryOwnerMapping('Technology', [SELECT Id FROM User WHERE IsActive = TRUE LIMIT 1].Id);
        
        Lead lead = new Lead(
            FirstName = 'John', 
            LastName = 'Doe', 
            Score__c = 90, 
            Industry = 'Technology', 
            Company = 'Tech Corp'
        ); 
        insert lead; 
        
        lead = [SELECT Owner__c FROM Lead WHERE Id = :lead.Id]; 
        System.assertNotEquals(null, lead.Owner__c); 
        
        Test.stopTest();
    } 

    @isTest 
    static void testAssignLeadOwnerOnUpdate() { 
        Test.startTest();
        
        createIndustryOwnerMapping('Finance', [SELECT Id FROM User WHERE IsActive = TRUE LIMIT 1].Id);
        
        Lead lead = new Lead(
            FirstName = 'Jane', 
            LastName = 'Smith', 
            Score__c = 70, 
            Industry = 'Finance', 
            Company = 'Finance Inc'
        ); 
        insert lead; 
        
        lead.Score__c = 85; 
        update lead; 
        
        lead = [SELECT Owner__c FROM Lead WHERE Id = :lead.Id]; 
        System.assertEquals(null, lead.Owner__c); 
        
        Test.stopTest();
    } 
    
    // Method to create custom metadata records
    static void createIndustryOwnerMapping(String industry, Id ownerId) {
        Industry_Owner_Mapping__mdt industryMapping = new Industry_Owner_Mapping__mdt(
            Industry__c = industry, 
            Owner__c = ownerId
        );
        // Custom metadata records need to be created using the Metadata API.
    }
}