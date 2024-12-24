public with sharing class SalesDataController {
    @AuraEnabled(cacheable=true)
    public static List<SalesData__c> getSalesData() {
        return [SELECT Amount__c, Discount__c, SaleDate__c FROM SalesData__c ];
    }
}