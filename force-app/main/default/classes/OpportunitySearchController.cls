public with sharing class OpportunitySearchController {

    @AuraEnabled(cacheable=true)
    public static  Map<String, Object> getOpportunities(Integer pageNumber, Integer pageSize) {
        try {
            // Calculate the offset based on the current page and page size
            Integer offsetValue = (pageNumber - 1) * pageSize;

            
            List<Opportunity> opportunities = [
                SELECT  Name, StageName, Amount, CloseDate 
                FROM Opportunity
                LIMIT :pageSize OFFSET :offsetValue
            ];

            // Query the total number of records
            Integer totalRecords = [SELECT COUNT() FROM Opportunity];

            // Return a Map containing both opportunities and record count
            return new Map<String, Object>{
                'opportunities' => opportunities,
                'total' => totalRecords
            };

            

        }
        catch (Exception e) {
            System.debug('Error while fetching the opportunities: ' + e.getMessage());
            // Exception thrown in case of some error
            throw new AuraHandledException('Sorry...Not able to fetch opportunity records.');
        }
    }

}