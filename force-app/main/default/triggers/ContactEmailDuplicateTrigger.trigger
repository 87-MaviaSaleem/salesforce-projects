trigger ContactEmailDuplicateTrigger on Contact (before insert, before update) {
    if (Trigger.isBefore) {
        ContactDuplicateHandler.checkForDuplicateEmails(Trigger.new);
    }
}