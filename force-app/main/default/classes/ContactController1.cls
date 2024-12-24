public with sharing class ContactController1 {
    /**
     * Retrieves a list of contacts based on the provided offset, limit, and search term.
     * This method is cacheable for performance optimization when used in Lightning Web Components.
     *
     * @param offset    The starting point in the list of records for pagination.
     * @param limit1    The maximum number of records to retrieve.
     * @param searchTerm The search keyword used to filter contacts by name. 
     *                   If empty, all contacts are retrieved.
     * @return          A list of Contact records matching the criteria.
     */
    @AuraEnabled(cacheable=true)
    public static List<Contact> getAllContacts(Integer offset, Integer limit1, String searchTerm) {
        // Base query with filtering on the Name field
        String query = 'SELECT FirstName, LastName, Email FROM Contact WHERE Name LIKE :searchTerm ORDER BY LastName LIMIT :limit1 OFFSET :offset';
        
        // If the search term is empty, modify the query to remove the WHERE clause
        if (String.isEmpty(searchTerm)) {
            query = 'SELECT FirstName, LastName, Email FROM Contact ORDER BY LastName LIMIT :limit1 OFFSET :offset';
        }
        
        // Execute the dynamically constructed SOQL query
        return Database.query(query);
    }
}