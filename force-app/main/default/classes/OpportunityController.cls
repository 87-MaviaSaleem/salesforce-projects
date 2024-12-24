public with sharing class OpportunityController {
    
    /**
     * This method retrieves a list of open opportunities from Salesforce.
     * It filters the opportunities based on the provided stage and owner filters.
     *
     * @param stageFilter The opportunity stage to filter by (optional).
     * @param ownerFilter The opportunity owner to filter by (optional).
     * @return A list of open opportunities matching the filters.
     */
    @AuraEnabled(cacheable=true)
    public static List<Opportunity> getOpportunities(String stageFilter, String ownerFilter) {
        // Start the query to fetch opportunity records with basic fields
        String query = 'SELECT Id, Name, StageName, CloseDate, Owner.Name FROM Opportunity WHERE IsClosed = false';
        
        // If a stage filter is provided, add it to the query
        if (String.isNotEmpty(stageFilter)) {
            query += ' AND StageName = :stageFilter';
        }
        
        // If an owner filter is provided, add it to the query
        if (String.isNotEmpty(ownerFilter)) {
            query += ' AND OwnerId = :ownerFilter';
        }
        
        try {
            // Execute the dynamic query and return the results
            return Database.query(query);
        } catch (Exception e) {
            // In case of an error, throw a handled exception with a descriptive message
            throw new AuraHandledException('Error fetching opportunities: ' + e.getMessage());
        }
    }

    /**
     * This method retrieves a list of active users (owners) in Salesforce.
     * It is used to populate the owner filter options in the front-end component.
     *
     * @return A list of active users with their Id and Name.
     */
    @AuraEnabled(cacheable=true)
    public static List<User> getOwners() {
        // Query to fetch the Id and Name of active users
        return [SELECT Id, Name FROM User WHERE IsActive = true];
    }

    /**
     * This method updates the stage of a given opportunity.
     * It is used to update the Opportunity's StageName when the user makes a change in the front-end UI.
     *
     * @param opportunityId The Id of the opportunity whose stage needs to be updated.
     * @param newStage The new stage name to update the opportunity to.
     */
    @AuraEnabled
    public static void updateOpportunityStage(Id opportunityId, String newStage) {
        try {
            // Fetch the opportunity by its Id
            Opportunity opp = [SELECT Id, StageName FROM Opportunity WHERE Id = :opportunityId LIMIT 1];
            
            // Update the opportunity's StageName with the new value
            opp.StageName = newStage;
            
            // Perform the DML update operation to save the changes
            update opp;
        } catch (Exception e) {
            // If an error occurs during the update operation, throw a handled exception
            throw new AuraHandledException('Error updating opportunity stage: ' + e.getMessage());
        }
    }
}