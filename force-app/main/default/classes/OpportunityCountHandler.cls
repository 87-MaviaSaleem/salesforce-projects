public class OpportunityCountHandler {
    public static void handleOpportunityCount(List<Opportunity> newOpportunities, List<Opportunity> oldOpportunities, Boolean isInsert, Boolean isDelete) {
        Set<Id> accountIds = new Set<Id>();

        // Collect Account IDs based on the trigger context
        if (isInsert) {
            for (Opportunity opp : newOpportunities) {
                if (opp.AccountId != null) {
                    accountIds.add(opp.AccountId);
                }
            }
        }

        if (isDelete) {
            for (Opportunity opp : oldOpportunities) {
                if (opp.AccountId != null) {
                    accountIds.add(opp.AccountId);
                }
            }
        }

        // Update the Opportunity count for each Account
        if (!accountIds.isEmpty()) {
            List<Account> accountsToUpdate = new List<Account>();

            for (Id accountId : accountIds) {
                // Count Opportunities related to the Account
                Integer opportunityCount = [SELECT COUNT() FROM Opportunity WHERE AccountId = :accountId];
                accountsToUpdate.add(new Account(Id = accountId, Opportunity_Count__c = opportunityCount));
            }

            // Update Accounts with new Opportunity counts
            if (!accountsToUpdate.isEmpty()) {
                update accountsToUpdate;
            }
        }
    }
}