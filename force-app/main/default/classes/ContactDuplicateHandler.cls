public class ContactDuplicateHandler { 
    public static void checkForDuplicateEmails(List<Contact> newContacts) {
        // Early exit if there are no contacts to process
        if (newContacts.isEmpty()) return;

        Set<String> emailSet = new Set<String>();
        Set<String> duplicateEmails = new Set<String>();
        
        // Collect emails from new contacts (case insensitive)
        for (Contact con : newContacts) {
            if (con.Email != null) {
                emailSet.add(con.Email.toLowerCase());
            }
        }

        // Query existing Contacts with matching emails
        List<Contact> existingContacts = [SELECT Email FROM Contact WHERE Email IN :emailSet];
        
        // Populate duplicateEmails set
        for (Contact existing : existingContacts) {
            if (existing.Email != null) {
                duplicateEmails.add(existing.Email.toLowerCase());
            }
        }

        // Check for duplicates in new contacts and add errors if found
        for (Contact con : newContacts) {
            if (con.Email != null && duplicateEmails.contains(con.Email.toLowerCase())) {
                con.addError('The email address "' + con.Email + '" is already in use. Please use a different email address.');
            }
        }
    }
}