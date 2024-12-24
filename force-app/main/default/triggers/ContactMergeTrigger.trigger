trigger ContactMergeTrigger on Contact (before delete) {
    Map<Id, Id> losingToMasterContactMap = new Map<Id, Id>();

    for (Contact con : Trigger.old) {
        if (con.MasterRecordId != null) {
            losingToMasterContactMap.put(con.Id, con.MasterRecordId);
        }
    }

    if (!losingToMasterContactMap.isEmpty()) {
        // Update Cases
        List<Case> casesToUpdate = [SELECT Id, ContactId FROM Case WHERE ContactId IN :losingToMasterContactMap.keySet()];
        for (Case c : casesToUpdate) {
            c.ContactId = losingToMasterContactMap.get(c.ContactId);
        }
        if (!casesToUpdate.isEmpty()) {
            update casesToUpdate;
        }
    }
}