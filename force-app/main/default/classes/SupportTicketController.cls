public with sharing class SupportTicketController {
    @AuraEnabled(cacheable=true)
    public static List<Support_Ticket__c> getTickets() {
        return [SELECT Id, Name, Status__c FROM Support_Ticket__c];
    }

    @AuraEnabled
    public static void updateTicketStatus(Id ticketId, String newStatus) {
        try {
            Support_Ticket__c ticket = [SELECT Id, Status__c FROM Support_Ticket__c WHERE Id = :ticketId LIMIT 1];
            ticket.Status__c = newStatus;
            update ticket;
        } catch (Exception e) {
            throw new AuraHandledException('Failed to update ticket status: ' + e.getMessage());
        }
    }
}