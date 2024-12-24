trigger OpportunityTrigger on Opportunity (before insert, before update) {
    OpportunityTriggerHelper.updateTotalSales(Trigger.new);
}