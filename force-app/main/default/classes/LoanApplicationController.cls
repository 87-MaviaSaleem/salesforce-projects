public with sharing class LoanApplicationController {
    @AuraEnabled(cacheable=true)
    public static List<Loan_Application__c> getLoanApplications(Id customerId) {
        return [SELECT Id, Loan_Amount__c, Application_Status__c, Loan_Type__c 
                FROM Loan_Application__c 
                WHERE Customer_ID__c = :customerId];
    }

    @AuraEnabled
    public static void updateLoanStatus(Id loanApplicationId, String newStatus) {
        Loan_Application__c loanApp = [SELECT Id, Application_Status__c FROM Loan_Application__c WHERE Id = :loanApplicationId LIMIT 1];
        loanApp.Application_Status__c = newStatus;
        update loanApp;
    }
}