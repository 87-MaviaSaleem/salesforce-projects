public class AccountDataController {
    
    // Method to fetch account data based on user's access level
    public static List<Account__c> getAccountsBasedOnAccessLevel() {
        // Retrieve the current user's access level
        String userAccessLevel = [SELECT User_Access_Level__c FROM User WHERE Id = :UserInfo.getUserId()].User_Access_Level__c;
        
        // Initialize the base SOQL query
        String query = 'SELECT Id, Account_Number__c, Balance__c FROM Account__c';

        // Modify the query based on access level
        if (userAccessLevel == 'Basic') {
            // Basic users see only their account number
            query += ' WHERE Account_Number__c != NULL';
        } else if (userAccessLevel == 'Premium') {
            // Premium users see account number and balance
            query += ' WHERE Balance__c >= 0';
        } else if (userAccessLevel == 'Admin') {
            // Admin users see all records without additional filters
            // Note: We might add more conditions if needed for Admin
        } else {
            // Return empty list if access level is unknown
            return new List<Account__c>();
        }

        // Execute the dynamic SOQL query
        List<Account__c> accounts = Database.query(query);
        return accounts;
    }
}