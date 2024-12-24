trigger LeadConversionTrigger on Lead (after update) {
    if (Trigger.isAfter && Trigger.isUpdate) {
        //LeadHelper.createFollowUpTasks(Trigger.new, Trigger.oldMap);
    }
}