public with sharing class FinTechDataController {
	
    
    // Fetch account details by Account ID
    @AuraEnabled(cacheable=true)
    public static Account getAccountData(String accountId) {
        if (String.isEmpty(accountId)) {
            throw new AuraHandledException('Account ID cannot be null or empty');
        }

        // Fetch account details
        Account acc;
        try {
            acc = [SELECT Name, Phone , Balance__c FROM Account WHERE Id = :accountId LIMIT 1];
            if (acc == null) {
                throw new AuraHandledException('No account found with the provided ID');
            }
        } catch (Exception e) {
            throw new AuraHandledException('Failed to load account data. Please try again later.');
        }
        
        return acc;
    }
    
    // Fetch the last 10 transactions for the given account
    @AuraEnabled(cacheable=true)
    public static List<Transaction__c> getTransactionHistory(String accountId) {
        if (String.isEmpty(accountId)) {
            throw new AuraHandledException('Account ID cannot be null or empty');
        }

        List<Transaction__c> transactions;
        try {
            transactions = [SELECT Date__c, Amount__c 
                            FROM Transaction__c 
                            WHERE Account__c = :accountId 
                            ORDER BY Date__c DESC 
                            LIMIT 10];
            if (transactions.isEmpty()) {
                throw new AuraHandledException('No transactions found for the provided account ID');
            }
        } catch (Exception e) {
            throw new AuraHandledException('Failed to load transaction history. Please try again later.');
        }

        return transactions;
    }
}