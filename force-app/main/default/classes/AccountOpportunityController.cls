public with sharing class AccountOpportunityController {
    @AuraEnabled(cacheable=true)
    public static List<Account> getAllParentAccounts() {
        // Fetch Accounts records
        return [
            SELECT Id, Name, Type, Industry
            FROM Account
        ];
    }

    @AuraEnabled(cacheable=true)
    public static List<Opportunity> getChildOpportunities(Id accountId) {
        // Fetch Opportunities for a given Account 
        return [
            SELECT Id, Name, Type, StageName
            FROM Opportunity
            WHERE AccountId = :accountId
        ];
    }

    
    
}