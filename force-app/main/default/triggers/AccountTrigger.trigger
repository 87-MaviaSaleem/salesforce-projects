trigger AccountTrigger on Account (before update) {
    for (Account acc : Trigger.new) {
        // Check if the Account's annual revenue is above a certain threshold
        if (acc.AnnualRevenue != null && acc.AnnualRevenue > 1000000) {
            acc.Account_Status__c = 'High Revenue';
        } else {
            acc.Account_Status__c = 'Standard Revenue';
        }
    }
}