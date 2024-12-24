trigger ProjectStatusTrigger on Project__c (before insert, before update) {
    for (Project__c proj : Trigger.new) {
        if (proj.Hours_Worked__c != null && proj.Estimated_Hours__c != null) {
            if (proj.Hours_Worked__c >= proj.Estimated_Hours__c) {
                proj.Status__c = 'Completed';
            } else if (proj.Hours_Worked__c > 0) {
                proj.Status__c = 'In Progress';
            } else {
                proj.Status__c = 'Not Started';
            }
        }
    }
}