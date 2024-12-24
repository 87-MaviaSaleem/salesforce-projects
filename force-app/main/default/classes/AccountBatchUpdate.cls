global class AccountBatchUpdate implements Database.Batchable<SObject> {
    
    global Database.QueryLocator start(Database.BatchableContext BC) {
        // Query to get accounts with necessary fields
        return Database.getQueryLocator('SELECT Id, Status__c, Credit_Score__c, Credit_Limit__c, Last_Activity_Date__c, Hold_Flag__c, Hold_Start_Date__c FROM Account');
    }

    global void execute(Database.BatchableContext BC, List<Account> accounts) {
        List<Account> accountsToUpdate = new List<Account>();
        Date oneYearAgo = System.today().addYears(-1);
        Date sixMonthsAgo = System.today().addMonths(-6);

        for (Account acc : accounts) {
            Boolean needsUpdate = false;

            // Check if the account has not been active for over a year
            if (acc.Last_Activity_Date__c != null && acc.Last_Activity_Date__c <= oneYearAgo) {
                acc.Status__c = 'Inactive';
                needsUpdate = true;
            }

            // Check if the credit score is above 700 and increase the credit limit by 20%
            if (acc.Credit_Score__c > 700) {
                acc.Credit_Limit__c *= 1.2; // Increase by 20%
                needsUpdate = true;
            }

            // Check if the account is flagged as "On Hold" for more than six months
            if (acc.Hold_Flag__c == true && acc.Hold_Start_Date__c != null && acc.Hold_Start_Date__c <= sixMonthsAgo) {
                acc.Status__c = 'Inactive';
                needsUpdate = true;
            }

            // Add the account to the update list if any changes were made
            if (needsUpdate) {
                accountsToUpdate.add(acc);
            }
        }
        
        // Perform bulk update
        if (!accountsToUpdate.isEmpty()) {
            try {
                Database.update(accountsToUpdate, false);
            } catch (DmlException e) {
                // Handle error (e.g., log to a custom object or debug)
                System.debug('Error updating accounts: ' + e.getMessage());
            }
        }
    }

    global void finish(Database.BatchableContext BC) {
        // Optional: send summary email or notification
        System.debug('Batch process finished for Account updates.');
    }
}