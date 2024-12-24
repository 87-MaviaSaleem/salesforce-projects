/*
*********************************************************
Apex Trigger Name    	: UpdateAccountLastContacted
Created Date       		: Oct 30, 2024
@description       		: This trigger updates the Last_Contacted__c field 
                          on related Account records whenever a Contact record 
                          is inserted or updated. The Last_Contacted__c field 
                          is set to the current date to reflect the most recent 
                          interaction with any associated contacts. This helps 
                          maintain accurate records for sales and support teams 
                          to track customer engagement.
@author           		: Nitish  
*********************************************************
*/
trigger UpdateAccountLastContacted on Contact (after insert, after update) {
    Set<Id> accountIds = new Set<Id>();
    
    // Collect Account IDs related to the Contacts being processed
    for (Contact con : Trigger.new) {
        if (con.AccountId != null) {
            accountIds.add(con.AccountId);
        }
    }

    // Prepare a map to hold the Accounts to update
    Map<Id, Account> accountsToUpdate = new Map<Id, Account>(
        [SELECT Id, Last_Contacted__c FROM Account WHERE Id IN :accountIds]
    );

    // Update Last_Contacted__c for each Account
    for (Contact con : Trigger.new) {
        if (con.AccountId != null && accountsToUpdate.containsKey(con.AccountId)) {
            accountsToUpdate.get(con.AccountId).Last_Contacted__c = Date.today();
        }
    }

    // Update Accounts in bulk
    if (!accountsToUpdate.isEmpty()) {
        update accountsToUpdate.values();
    }
}