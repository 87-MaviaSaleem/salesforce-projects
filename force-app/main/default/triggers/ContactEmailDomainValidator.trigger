trigger ContactEmailDomainValidator on Contact (before update) {
    // Collect Account IDs from Contacts
    Set<Id> accountIds = new Set<Id>();
    for (Contact con : Trigger.new) {
        if (con.Email != null && con.AccountId != null) {
            accountIds.add(con.AccountId);
        }
    }

    // Query Accounts once using collected IDs
    Map<Id, Account> accountMap = new Map<Id, Account>(
        [SELECT Id, Domain__c FROM Account WHERE Id IN :accountIds]
    );

    // Validate Email Domains
    for (Contact con : Trigger.new) {
        if (con.Email != null && con.AccountId != null) {
            Account acc = accountMap.get(con.AccountId);
            if (acc != null && acc.Domain__c != null) {
                String emailDomain = con.Email.substringAfter('@');
                if (emailDomain != acc.Domain__c) {
                    con.addError('Email domain must match the Account domain.');
                }
            }
        }
    }
}