public with sharing class LeadService {

    @AuraEnabled(cacheable=true)
    public static List<Lead> getPaginatedLeads(String statusFilter, Integer offset, Integer limit1) {
         System.debug('getPaginatedLeads: ');
        // Validate parameters
        if (offset == null || limit1 == null || limit1 <= 0) {
            throw new AuraHandledException('Invalid offset or limit value.');
        }

        // Build the SOQL query
        String query = 'SELECT Id, Name, Company, Email, Status FROM Lead';
        
        if (!String.isBlank(statusFilter)) {
            query += ' WHERE Status = :statusFilter'; // Use bind variable to prevent SOQL injection
        }

        query += ' ORDER BY Name LIMIT :limit1 OFFSET :offset';
        
        // Debug log to check query construction
        System.debug('SOQL Query: ' + query);
        
        // Return results
        return Database.query(query);
    }

    @AuraEnabled(cacheable=true)
    public static Integer getTotalLeadCount(String statusFilter) {
        if (String.isBlank(statusFilter)) {
            return [SELECT COUNT() FROM Lead];
        }
        return [SELECT COUNT() FROM Lead WHERE Status = :statusFilter];
    }
}