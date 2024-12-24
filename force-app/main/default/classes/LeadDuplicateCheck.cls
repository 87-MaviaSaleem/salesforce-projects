public class LeadDuplicateCheck {
    
    // Method to check if a lead with the given email already exists
    @AuraEnabled(cacheable=true)
    public static Boolean isDuplicateLead(String email) {
        // Query for leads with the same email
        List<Lead> existingLeads = [SELECT Id FROM Lead WHERE Email = :email LIMIT 1];
		system.debug('existingLeads'+existingLeads);
        // If the query returns any leads, we have a duplicate
        if (existingLeads.size() > 0) {
            return true; // Duplicate found
        }
        return false; // No duplicate
    }
    
    // Optionally, you can include other methods if needed, like creating the lead
    @AuraEnabled
    public static Lead createLead(String firstName, String lastName, String email, String phone, String Company) {
        Lead newLead = new Lead();
        newLead.FirstName = firstName;
        newLead.LastName = lastName;
        newLead.Email = email;
        newLead.Phone = phone;
		newLead.Company = Company;
        try {
            insert newLead;
            return newLead; // Return the created lead
        } catch (DmlException e) {
            throw new AuraHandledException('Error creating lead: ' + e.getMessage());
        }
    }
}