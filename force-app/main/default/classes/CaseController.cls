public with sharing class CaseController {

    // Fetch active cases with optional status filter
    @AuraEnabled(cacheable=true)
    public static List<Case> getActiveCases(String statusFilter) {
        // Build the SOQL query to get active (non-closed) cases
        String query = 'SELECT Id, CaseNumber, Subject, Status, Priority, Owner.Name FROM Case WHERE IsClosed = false';

        // Apply status filter if provided
        if (statusFilter != null && statusFilter != '') {
            query += ' AND Status = :statusFilter';
        }

        try {
            // Execute the query and return the results
            return Database.query(query);
        } catch (Exception e) {
            // Handle any errors that occur during the query
            throw new AuraHandledException('Error fetching cases: ' + e.getMessage());
        }
    }

    // Update the status of a specific case
    @AuraEnabled
    public static void updateCaseStatus(Id caseId, String newStatus) {
        try {
            // Retrieve the case by Id
            Case caseToUpdate = [SELECT Id, Status FROM Case WHERE Id = :caseId LIMIT 1];
            
            // Check if the new status is valid
            if (newStatus == null || newStatus == '') {
                throw new AuraHandledException('Invalid status.');
            }

            // Update the case's status
            caseToUpdate.Status = newStatus;

            // Update the case record in Salesforce
            update caseToUpdate;
        } catch (QueryException qe) {
            // Handle case when the caseId doesn't exist
            throw new AuraHandledException('Case not found.');
        } catch (Exception e) {
            // Handle other exceptions
            throw new AuraHandledException('Error updating case status: ' + e.getMessage());
        }
    }

    // Update the priority of a specific case
    @AuraEnabled
    public static void updateCasePriority(Id caseId, String newPriority) {
        try {
            // Retrieve the case by Id
            Case caseToUpdate = [SELECT Id, Priority FROM Case WHERE Id = :caseId LIMIT 1];

            // Check if the new priority is valid
            if (newPriority == null || newPriority == '') {
                throw new AuraHandledException('Invalid priority.');
            }

            // Update the case's priority
            caseToUpdate.Priority = newPriority;

            // Update the case record in Salesforce
            update caseToUpdate;
        } catch (QueryException qe) {
            // Handle case when the caseId doesn't exist
            throw new AuraHandledException('Case not found.');
        } catch (Exception e) {
            // Handle other exceptions
            throw new AuraHandledException('Error updating case priority: ' + e.getMessage());
        }
    }
}