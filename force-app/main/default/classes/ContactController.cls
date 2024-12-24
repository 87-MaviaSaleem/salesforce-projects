public with sharing class ContactController {
    @AuraEnabled(cacheable=true)
    public static List<Contact> getContacts(Id accountId) {
        return [SELECT Id, Name, Email FROM Contact WHERE AccountId = :accountId];
    }

    @AuraEnabled
    public static void updateContacts(List<Contact> contacts) {
        update contacts;
    }
}