trigger UpdateAccountRevenue on Opportunity (after update) {
    // Step 1: Collect all relevant Account IDs
    Set<Id> accountIds = new Set<Id>();
    for (Opportunity opp : Trigger.new) {
        if (opp.StageName == 'Closed Won' && opp.AccountId != null) {
            accountIds.add(opp.AccountId);
        }
    }
    
    // Step 2: Query all related Accounts
    Map<Id, Account> accountMap = new Map<Id, Account>(
        [SELECT Id, AnnualRevenue FROM Account WHERE Id IN :accountIds]
    );
    
    // Step 3: Aggregate Opportunity Amounts by Account
    Map<Id, Decimal> accountRevenueMap = new Map<Id, Decimal>();
    for (Opportunity opp : Trigger.new) {
        if (opp.StageName == 'Closed Won' && opp.AccountId != null) {
            Decimal existingRevenue = accountRevenueMap.containsKey(opp.AccountId) ? accountRevenueMap.get(opp.AccountId) : 0;
            accountRevenueMap.put(opp.AccountId, existingRevenue + opp.Amount);
        }
    }
    
    // Step 4: Update Account AnnualRevenue fields
    List<Account> accountsToUpdate = new List<Account>();
    for (Id accountId : accountRevenueMap.keySet()) {
        Account acc = accountMap.get(accountId);
        acc.AnnualRevenue = (acc.AnnualRevenue != null ? acc.AnnualRevenue : 0) + accountRevenueMap.get(accountId);
        accountsToUpdate.add(acc);
    }
    
    // Step 5: Perform DML operation outside the loop
    if (!accountsToUpdate.isEmpty()) {
        update accountsToUpdate;
    }
}