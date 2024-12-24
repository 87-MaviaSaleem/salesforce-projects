trigger OpportunityDiscount on Opportunity (before insert, before update) {
    if (Trigger.isBefore && (Trigger.isInsert || Trigger.isUpdate)) {
        OpportunityDiscountTriggerHandler.applyDiscount(Trigger.new);
    }
}