public with sharing class OptimizedOppSearchAndEditController {

    @AuraEnabled(cacheable=true)
    public static List<Opportunity> searchOpportunities(String searchKey) {
        if (String.isBlank(searchKey)) {
            return new List<Opportunity>();
        }
        return [SELECT Id, Name, StageName, Amount, CloseDate 
                FROM Opportunity 
                WHERE Name LIKE :('%' + searchKey + '%') 
                LIMIT 50];
    }


}