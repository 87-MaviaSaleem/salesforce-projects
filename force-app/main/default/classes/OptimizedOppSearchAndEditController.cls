public with sharing class OptimizedOppSearchAndEditController {

    @AuraEnabled
    public static Map<String, Object> searchOpportunities(String searchKey, Integer pageNumber, Integer pageSize) {
        if (String.isBlank(searchKey)) {
            searchKey = '';
        }

        try {
            // Calculate the offset for pagination
            Integer offsetValue = (pageNumber - 1) * pageSize;

            // Query opportunities for the current page
            List<Opportunity> opportunities = [
                SELECT Id, Name, StageName, Amount, CloseDate
                FROM Opportunity
                WHERE Name LIKE :('%' + searchKey + '%')
                LIMIT :pageSize OFFSET :offsetValue
            ];

            // Count total matching records
            Integer totalRecords = [
                SELECT COUNT()
                FROM Opportunity
                WHERE Name LIKE :('%' + searchKey + '%')
            ];

            // Return records and total count as a map
            return new Map<String, Object>{
                'opportunities' => opportunities,
                'total' => totalRecords
            };
        } catch (Exception e) {
            System.debug('Error fetching opportunities: ' + e.getMessage());
            throw new AuraHandledException('Unable to fetch opportunities. Please try again later.');
        }
    }
}