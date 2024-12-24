public class AccountTriggerHandler {
    public static void updateOpportunities(List<Account> accList) {
        Set<Id> accountIds = new Set<Id>();
        Map<Id, String> accountTierMap = new Map<Id, String>();

        // Identify Accounts with changed Customer_Tier__c
        for (Account acc : accList) {
            Account oldAcc = (Account)Trigger.oldMap.get(acc.Id);
            if (acc.Customer_Tier__c != oldAcc.Customer_Tier__c) {
                accountIds.add(acc.Id);
                accountTierMap.put(acc.Id, acc.Customer_Tier__c);
            }
        }

        if (!accountIds.isEmpty()) {
            // Query related Opportunities
            List<Opportunity> oppsToUpdate = [SELECT Id, AccountId, Discount__c FROM Opportunity WHERE AccountId IN :accountIds];

            // Update Discount__c on Opportunities
            for (Opportunity opp : oppsToUpdate) {
                String tier = accountTierMap.get(opp.AccountId);
                if (tier == 'Gold') {
                    opp.Discount__c = 30;
                } else if (tier == 'Silver') {
                    opp.Discount__c = 20;
                } else {
                    opp.Discount__c = 10;
                }
            }

            if (!oppsToUpdate.isEmpty()) {
                update oppsToUpdate;
            }
        }
    }
}