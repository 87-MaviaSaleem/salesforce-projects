trigger LeadDuplicateCheck on Lead (before insert, before update) {

    // Set to hold unique keys (Email + Phone) for leads being inserted or updated
    Set<String> leadIdentifierSet = new Set<String>();

    // Collect lead identifiers (Email + Phone) from the new leads
    for (Lead l : Trigger.new) {
        if (l.Email != null && l.Phone != null) {
            String leadIdentifier = l.Email + '|' + l.Phone;
            leadIdentifierSet.add(leadIdentifier);
        }
    }

    // Query existing leads with the same Email and Phone
    Map<String, Lead> existingLeadsMap = new Map<String, Lead>();
    for (Lead l : [SELECT Id, Email, Phone FROM Lead WHERE Email != NULL AND Phone != NULL AND Email IN :leadIdentifierSet]) {
        String leadIdentifier = l.Email + '|' + l.Phone;
        existingLeadsMap.put(leadIdentifier, l);
    }

    // Check for duplicates and add error if found
    for (Lead l : Trigger.new) {
        if (l.Email != null && l.Phone != null) {
            String leadIdentifier = l.Email + '|' + l.Phone;
            if (existingLeadsMap.containsKey(leadIdentifier) && existingLeadsMap.get(leadIdentifier).Id != l.Id) {
                l.addError('A lead with the same Email and Phone already exists.');
            }
        }
    }
}