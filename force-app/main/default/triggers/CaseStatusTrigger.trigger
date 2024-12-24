trigger CaseStatusTrigger on Case (before insert, before update) {
    CaseHelper.updateCaseStatus(Trigger.new);
}