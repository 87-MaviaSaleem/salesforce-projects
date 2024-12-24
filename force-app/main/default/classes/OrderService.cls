public with sharing class OrderService {

    @AuraEnabled(cacheable=true)
    public static List<Order__c> getOrders(Integer limitSize, Integer offsetSize, String sortField, String sortOrder) {
        String query = 'SELECT Order_Number__c, Customer_Name__c, Order_Amount__c, Order_Date__c, Status__c FROM Order__c ORDER BY '
                        + sortField + ' ' + sortOrder
                        + ' LIMIT :limitSize OFFSET :offsetSize';
        return Database.query(query);
    }

    @AuraEnabled(cacheable=true)
    public static List<Order__c> filterOrders(String status) {
        return [SELECT Order_Number__c, Customer_Name__c, Order_Amount__c, Order_Date__c, Status__c FROM Order__c WHERE Status__c = :status];
    }
}