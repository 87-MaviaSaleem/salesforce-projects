trigger AccountDiscount on Account (after update) {
    if (Trigger.isAfter && Trigger.isUpdate) {
        AccountTriggerHandler.updateOpportunities(Trigger.new);
    }
}