public with sharing class AccountDetailsController {
    @AuraEnabled
    public static Map<String, Object> getAccountAndContacts(String accountId) {
        try {
            // Fetch Account details
            Account account = [
                SELECT Id, Name, Industry, Phone, Website 
                FROM Account
                WHERE Id = :accountId
                LIMIT 1
            ];
            
            // Fetch related Contacts for the Account
            List<Contact> contacts = [
                SELECT Id, FirstName, LastName, Email, Phone 
                FROM Contact
                WHERE AccountId = :account.Id
            ];

            // Prepare response as a map
            Map<String, Object> responseMap = new Map<String, Object>();
            responseMap.put('account', account);
            responseMap.put('contacts', contacts);
            System.debug('contacts'+ contacts);
            return responseMap;
        } catch (Exception e) {
            throw new AuraHandledException('Error fetching data: ' + e.getMessage());
        }
    }
}