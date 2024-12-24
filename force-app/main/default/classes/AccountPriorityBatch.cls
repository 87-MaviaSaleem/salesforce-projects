/*
*********************************************************
Apex Batch Class Name   	: AccountPriorityBatch
Created Date       			: Nov 1, 2024
@description       			: This class is responsible for managing the execution of the AccountPriorityBatch process. 
                              It exposes the runBatchJob method as an @AuraEnabled method, allowing Lightning 
                              components to trigger the batch job to update account priorities based on their 
                              annual revenue and associated contacts.
@author            			: Nitish Panwar 
*********************************************************
*/
global class AccountPriorityBatch implements Database.Batchable<SObject> {
    global Database.QueryLocator start(Database.BatchableContext BC) {
        return Database.getQueryLocator([SELECT Id, AnnualRevenue FROM Account]);
    }

    global void execute(Database.BatchableContext BC, List<Account> scope) {
        for (Account acc : scope) {
            Integer contactCount = [SELECT COUNT() FROM Contact WHERE AccountId = :acc.Id];
            String newPriority = 'Low';

            if (acc.AnnualRevenue != null) {
                if (acc.AnnualRevenue > 1000000) {
                    newPriority = 'High';
                } else if (acc.AnnualRevenue > 500000) {
                    newPriority = 'Medium';
                }
            }

            if (contactCount > 10) {
                newPriority = 'High'; // Override priority if more than 10 contacts
            }

            acc.Priority__c = newPriority;
        }
        update scope;  
    }

    global void finish(Database.BatchableContext BC) {
        System.debug('Batch is completed'); 
    }
}