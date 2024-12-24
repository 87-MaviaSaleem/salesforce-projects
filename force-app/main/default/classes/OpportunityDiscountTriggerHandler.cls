public class OpportunityDiscountTriggerHandler {
    private static Boolean isExecuting = false;

    public static void applyDiscount(List<Opportunity> oppList) {
        if (isExecuting) return;
        isExecuting = true;

        // Collect Account IDs from Opportunities
        Set<Id> accountIds = new Set<Id>();
        for (Opportunity opp : oppList) {
            if (opp.AccountId != null) {
                accountIds.add(opp.AccountId);
            }
        }

        // Query Accounts
        Map<Id, Account> accountMap = new Map<Id, Account>(
            [SELECT Id, Customer_Tier__c FROM Account WHERE Id IN :accountIds]
        );

        // Apply Discounts
        for (Opportunity opp : oppList) {
            if (opp.AccountId != null && accountMap.containsKey(opp.AccountId)) {
                Account acc = accountMap.get(opp.AccountId);
                if (acc.Customer_Tier__c == 'Gold') {
                    opp.Discount__c = 30;
                } else if (acc.Customer_Tier__c == 'Silver') {
                    opp.Discount__c = 20;
                } else {
                    opp.Discount__c = 10;
                }
            }
        }

        isExecuting = false;
    }
}