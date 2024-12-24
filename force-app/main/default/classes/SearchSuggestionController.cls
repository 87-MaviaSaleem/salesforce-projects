public with sharing class SearchSuggestionController {
    @AuraEnabled(cacheable=true)
    public static List<SearchSuggestion__c> getSuggestions(String query) {
        return [
            SELECT Id, Name 
            FROM SearchSuggestion__c 
            WHERE Name LIKE :('%' + query + '%') 
            ORDER BY Relevance__c DESC 
            LIMIT 10
        ];
    }
}