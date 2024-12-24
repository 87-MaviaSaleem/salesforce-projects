/*
*********************************************************
Apex Class Name    : AccountBatchController
Created Date       : Nov 1, 2024
@description       : This class is responsible for managing the execution of the AccountPriorityBatch process. 
                     It exposes the runBatchJob method as an @AuraEnabled method, allowing Lightning 
                     components to trigger the batch job to update account priorities based on their 
                     annual revenue and associated contacts.
@author            : Nitish Panwar
*********************************************************
*/
public with sharing class AccountBatchController {
    @AuraEnabled
    public static void runBatchJob() {
        AccountPriorityBatch batch = new AccountPriorityBatch();
        Database.executeBatch(batch);
    }
}