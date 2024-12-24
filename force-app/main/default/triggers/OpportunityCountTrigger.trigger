trigger OpportunityCountTrigger on Opportunity (after insert, after delete) {
    OpportunityCountHandler.handleOpportunityCount(Trigger.new, Trigger.old, Trigger.isInsert, Trigger.isDelete);
}