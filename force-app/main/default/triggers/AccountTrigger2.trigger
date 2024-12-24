trigger AccountTrigger2 on Account (before insert, before update) {
    for (Account acc : Trigger.new) {
        // Default priority
        acc.Priority__c = 'Low';

        // Check revenue
        if (acc.AnnualRevenue != null) {
            if (acc.AnnualRevenue > 1000000) {
                acc.Priority__c = 'High';
            } else if (acc.AnnualRevenue > 500000) {
                acc.Priority__c = 'Medium';
            }
        }

        // Additionally, consider the number of associated contacts
        Integer contactCount = [SELECT COUNT() FROM Contact WHERE AccountId = :acc.Id];
        if (contactCount > 10) {
            acc.Priority__c = 'High';  
        }
    }
}