trigger AccountReplicateTrigger on Account (after delete, after insert, after update) {
    if ( trigger.isInsert ) {
        for ( Account acc : trigger.new ) {
            AccountOne__c ac = new AccountOne__c();
            ac.Fax__c = acc.Fax;
            ac.Phone__c = acc.Phone;
            ac.Name =acc.Name;
            insert ac;
        }
    }

   if(trigger.isUpdate)
{ 
    Map<String,Account> accNameMap = new Map<String,Account>();
    for(Account acc : trigger.old){
        accNameMap.put(acc.name,acc);
    }
    List<AccountOne__c> accOneList =  [Select name,fax__c,phone__c from AccountOne__c where name in: accNameMap.keyset()];
    for(AccountOne__c accOne : accOneList){
        Account relatedAccount = trigger.newmap.get(accNameMap.get(accOne.name).Id);
        accOne.name = relatedAccount.Name;
        accOne.fax__c = relatedAccount.fax;
        accOne.phone__c = relatedAccount.phone;
    }   
    update accOneList;
}
}