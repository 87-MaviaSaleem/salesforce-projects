trigger UpdateAccountBillingState on Contact (after insert, after update) {
    List<Account> accountsToUpdate = new List<Account>();
    for (Contact con : Trigger.new) {
        if (con.AccountId != null && con.MailingState != null) {
            accountsToUpdate.add(new Account(Id = con.AccountId, BillingState = con.MailingState));
        }
    }
    if (!accountsToUpdate.isEmpty()) {
        update accountsToUpdate;
    }
}