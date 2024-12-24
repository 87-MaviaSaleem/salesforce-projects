public class OpportunityTriggerHandler {
    private static Boolean isTriggerRunning = false;
    
    public static void handleAfterUpdate(List<Opportunity> newOpps, Map<Id, Opportunity> oldOppMap) {
        if (isTriggerRunning) return;
        isTriggerRunning = true;
        
        List<Task> tasksToInsert = new List<Task>();
        Set<Id> accountIds = new Set<Id>();
        
        // Step 1: Collect Opportunities where StageName changed to 'Negotiation/Review'
        for (Opportunity opp : newOpps) {
            Opportunity oldOpp = oldOppMap.get(opp.Id);
            if (opp.StageName == 'Negotiation/Review' && oldOpp.StageName != 'Negotiation/Review') {
                // Prepare Task
                Task t = new Task(
                    WhatId = opp.Id,
                    Subject = 'Follow up with client',
                    Priority = 'High',
                    Status = 'Not Started'
                );
                tasksToInsert.add(t);
                
                // Collect Account IDs
                if (opp.AccountId != null) {
                    accountIds.add(opp.AccountId);
                }
            }
        }
        
        // Step 2: Insert Tasks
        if (!tasksToInsert.isEmpty()) {
            insert tasksToInsert;
        }
        
        // Step 3: Query Accounts and Prepare Updates
        if (!accountIds.isEmpty()) {
            Map<Id, Account> accountsToUpdate = new Map<Id, Account>();
            Map<Id, Account> accountMap = new Map<Id, Account>(
                [SELECT Id, Rating FROM Account WHERE Id IN :accountIds]
            );
            for (Opportunity opp : newOpps) {
                if (opp.AccountId != null && accountMap.containsKey(opp.AccountId)) {
                    Opportunity oldOpp = oldOppMap.get(opp.Id);
                    if (opp.Amount != oldOpp.Amount) {
                        Account acc = accountMap.get(opp.AccountId);
                        if (opp.Amount > 100000) {
                            acc.Rating = 'Hot';
                        } else {
                            acc.Rating = 'Warm';
                        }
                        accountsToUpdate.put(acc.Id, acc);
                    }
                }
            }
            // Step 4: Update Accounts
            if (!accountsToUpdate.isEmpty()) {
                update accountsToUpdate.values();
            }
        }
        
        isTriggerRunning = false;
    }
}