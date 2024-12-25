public with sharing class OptimizedOppSearchController {

    @AuraEnabled(cacheable=true)
    public static Map<String, Object> searchOpportunities(String searchKey, Integer pageNumber, Integer pageSize) {
        try {
            // Calculate the offset for pagination
            Integer offsetValue = (pageNumber - 1) * pageSize;

            // Base query for opportunities
            String baseQuery = 'SELECT Id, Name, StageName, Amount, CloseDate FROM Opportunity';
            String countQuery = 'SELECT COUNT() FROM Opportunity';

            // Add WHERE clause if searchKey is not blank
            if (!String.isBlank(searchKey)) {
                String whereClause = ' WHERE Name LIKE :searchKey';
                baseQuery += whereClause;
                countQuery += whereClause;

                // Append wildcard '%' to the search key
                searchKey = '%' + searchKey + '%';
            }

            // Add pagination to the base query
            baseQuery += ' LIMIT :pageSize OFFSET :offsetValue';

            // Execute the queries
            List<Opportunity> opportunities = Database.query(baseQuery);
            Integer totalRecords = Database.countQuery(countQuery);

            // Return both records and total count as a map
            return new Map<String, Object>{
                'opportunities' => opportunities,
                'total' => totalRecords
            };

        } catch (Exception e) {
            System.debug('Error while fetching opportunities: ' + e.getMessage());
            throw new AuraHandledException('Unable to fetch opportunities. Please try again later.');
        }
    }
}