trigger CaseTrigger on Case (before delete, after delete, after undelete) {
    if (Trigger.isBefore && Trigger.isDelete) {
        // Before Delete: Capture Task details and store as JSON
        for (Case c : Trigger.old) {
            List<Task> tasks = [SELECT Subject, Description, Status FROM Task WHERE WhatId = :c.Id];
            if (!tasks.isEmpty()) {
                c.Deleted_Tasks__c = JSON.serialize(tasks);
            }
        }
    }
    if (Trigger.isAfter && Trigger.isDelete) {
        // After Delete: Hard-delete Tasks
        List<Task> tasksToDelete = [SELECT Id FROM Task WHERE WhatId IN :Trigger.oldMap.keySet() ALL ROWS];
        if (!tasksToDelete.isEmpty()) {
            Database.emptyRecycleBin(tasksToDelete);
        }
    }
    if (Trigger.isAfter && Trigger.isUndelete) {
        // After Undelete: Recreate Tasks from JSON
        List<Case> casesToUpdate = new List<Case>();
        List<Task> tasksToCreate = new List<Task>();
        for (Case c : Trigger.new) {
            String tasksJson = c.Deleted_Tasks__c;
            if (tasksJson != null) {
                List<Task> tasks = (List<Task>) JSON.deserialize(tasksJson, List<Task>.class);
                for (Task t : tasks) {
                    t.WhatId = c.Id;
                    tasksToCreate.add(t);
                }
                c.Deleted_Tasks__c = null;
                casesToUpdate.add(c);
            }
        }
        if (!tasksToCreate.isEmpty()) {
            insert tasksToCreate;
        }
        if (!casesToUpdate.isEmpty()) {
            update casesToUpdate;
        }
    }
}