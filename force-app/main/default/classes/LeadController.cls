public with sharing class LeadController {
    // Fetch all Leads
    @AuraEnabled(cacheable=true)
    public static List<Lead> getLeads() {
        try {
            return [SELECT Id, FirstName, LastName, Email, Company, Status FROM Lead];
        } catch (Exception e) {
            throw new AuraHandledException('Error fetching leads: ' + e.getMessage());
        }
    }

    // Create a new Lead
    @AuraEnabled
    public static Lead createLead(String firstName, String lastName, String email, String company, String status) {
        try {
            Lead newLead = new Lead(FirstName = firstName, LastName = lastName, Email = email, Company = company, Status = status);
            insert newLead;
            return newLead;
        } catch (Exception e) {
            throw new AuraHandledException('Error creating lead: ' + e.getMessage());
        }
    }

    // Update existing Leads
    @AuraEnabled
    public static void updateLead(List<Lead> updatedLeads) {
        try {
            update updatedLeads;
        } catch (Exception e) {
            throw new AuraHandledException('Error updating leads: ' + e.getMessage());
        }
    }

    // Delete a Lead
    @AuraEnabled
    public static void deleteLead(Id leadId) {
        try {
            delete [SELECT Id FROM Lead WHERE Id = :leadId];
        } catch (Exception e) {
            throw new AuraHandledException('Error deleting lead: ' + e.getMessage());
        }
    }
}