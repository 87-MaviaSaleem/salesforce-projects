public with sharing class ClaimsController {

    // Constants for claim actions
    public static final String ACTION_APPROVE = 'approve';
    public static final String ACTION_REJECT = 'reject';

    /**
     * Retrieves a list of claims with basic details such as customer name and status.
     * This method is marked as cacheable for improved performance in the Lightning framework.
     * 
     * @return List of Claim__c records
     */
    @AuraEnabled(cacheable=true)
    public static List<Claim__c> getClaimsData() {
        try {
            // Query to fetch relevant fields from Claim__c object
            return [SELECT Id, Name, Status__c 
                    FROM Claim__c 
                    ORDER BY CreatedDate DESC];
        } catch (Exception e) {
            // Log the exception for debugging and throw a user-friendly message
            System.debug('Error retrieving claims: ' + e.getMessage());
            throw new AuraHandledException('Unable to retrieve claims at this time. Please try again later.');
        }
    }

    /**
     * Updates the status of a specific claim based on the action type provided.
     * Supported actions are "approve" and "reject".
     * 
     * @param claimId Id of the claim to update
     * @param actionType Type of action ("approve" or "reject")
     * @throws AuraHandledException if the action type is invalid or any error occurs
     */
    @AuraEnabled
    public static void updateClaimStatus(Id claimId, String actionType) {
        try {
            // Fetch the claim record to ensure it exists and is updatable
            Claim__c claim = [SELECT Id, Status__c FROM Claim__c WHERE Id = :claimId LIMIT 1];

            // Validate action type
            if (actionType == ACTION_APPROVE) {
                claim.Status__c = 'Approved';
            } else if (actionType == ACTION_REJECT) {
                claim.Status__c = 'Rejected';
            } else {
                // Invalid action type
                throw new AuraHandledException('Invalid action type provided. Use "approve" or "reject".');
            }

            // Update the record in the database
            update claim;

        } catch (QueryException qe) {
            // Handle case where the query doesn't return any records
            System.debug('Claim not found for Id: ' + claimId);
            throw new AuraHandledException('Claim not found. Please verify the claim ID and try again.');
        } catch (Exception e) {
            // Log the exception and rethrow a user-friendly message
            System.debug('Error updating claim status: ' + e.getMessage());
            throw new AuraHandledException('An error occurred while updating the claim status. Please try again later.');
        }
    }

    /**
     * Associates an uploaded file with a claim record.
     * 
     * @param claimId Id of the claim to associate the file with
     * @param contentDocumentId Id of the uploaded ContentDocument
     */
    @AuraEnabled
    public static void associateFileToClaim(Id claimId, Id contentDocumentId) {
        try {
            // Create a ContentDocumentLink to associate the file with the claim record
            ContentDocumentLink link = new ContentDocumentLink();
            link.ContentDocumentId = contentDocumentId;
            link.LinkedEntityId = claimId;
            link.ShareType = 'V'; // Viewer access
            link.Visibility = 'AllUsers'; // Visible to all users with access to the record
            insert link;

        } catch (Exception e) {
            // Log and rethrow error with a user-friendly message
            System.debug('Error associating file to claim: ' + e.getMessage());
            throw new AuraHandledException('An error occurred while associating the file with the claim.');
        }
    }
}