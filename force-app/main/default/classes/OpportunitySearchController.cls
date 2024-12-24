public with sharing class OpportunitySearchController {

    @AuraEnabled(cacheable=true)
    public static List<Opportunity> getOpportunities() {
        try {
            // Fetch and return 50 records from salesforce
            List<Opportunity> opportunities = [
                SELECT  Name, StageName, Amount, CloseDate 
                FROM Opportunity
                LIMIT 50
            ];
            return opportunities;

        }
        catch (Exception e) {
            System.debug('Error while fetching the opportunities: ' + e.getMessage());
            // Exception thrown in case of some error
            throw new AuraHandledException('Sorry...Not able to fetch opportunity records.');
        }
    }

}
