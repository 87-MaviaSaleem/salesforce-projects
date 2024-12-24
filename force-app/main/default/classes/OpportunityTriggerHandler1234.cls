public class OpportunityTriggerHandler1234 {
    
    public static void handleTrigger(List<Opportunity> newList, List<Opportunity> oldList, Boolean isBefore, Boolean isInsert, Boolean isUpdate, Boolean isDelete) {
        if (isBefore) {
            if (isInsert) {
                handleBeforeInsert(newList);
            } else if (isUpdate) {
                handleBeforeUpdate(newList, oldList);
            }
    //  } else if (isAfter) {
            if (isInsert) {
                handleAfterInsert(newList);
            } else if (isUpdate) {
                handleAfterUpdate(newList, oldList);
            } else if (isDelete) {
                handleAfterDelete(oldList);
            }
        }
    }

    private static void handleBeforeInsert(List<Opportunity> newList) {
        // Logic for before insert
        for (Opportunity opp : newList) {
            // e.g., set default values
        }
    }

    private static void handleBeforeUpdate(List<Opportunity> newList, List<Opportunity> oldList) {
        // Logic for before update
        for (Integer i = 0; i < newList.size(); i++) {
            Opportunity newOpp = newList[i];
            Opportunity oldOpp = oldList[i];
            // e.g., validate changes
        }
    }

    private static void handleAfterInsert(List<Opportunity> newList) {
        // Logic for after insert
        // e.g., send notifications or perform actions based on inserted records
    }

    private static void handleAfterUpdate(List<Opportunity> newList, List<Opportunity> oldList) {
        // Logic for after update
    }

    private static void handleAfterDelete(List<Opportunity> oldList) {
        // Logic for after delete
    }
}