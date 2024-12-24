public with sharing class ProductSearchController {

    // Method to search products with pagination and category filter
    @AuraEnabled(cacheable=true)
    public static Map<String, Object> searchProducts(String searchTerm, String categoryId, Integer pageNumber, Integer pageSize) {
        Integer offset = (pageNumber - 1) * pageSize;

        // Build the base query for searching products by name
        String query = 'SELECT Id, Name, Description, ProductCode FROM Product2 WHERE Name LIKE :searchTerm';
        
        // Add category filter if provided
        if (!String.isEmpty(categoryId)) {
            query += ' AND ProductCategory__c = :categoryId';
        }

        // Add pagination to the query
        query += ' LIMIT :pageSize OFFSET :offset';

        // Fetch the products based on the query
        List<Product2> products = Database.query(query);

        // Query to get the total number of matching products using Database.countQuery
        String countQuery = 'SELECT COUNT() FROM Product2 WHERE Name LIKE :searchTerm';
        if (!String.isEmpty(categoryId)) {
            countQuery += ' AND ProductCategory__c = :categoryId';
        }

        // Execute the count query and get the result
        Integer totalRecords = (Integer)Database.countQuery(countQuery);

        // Prepare and return the results in a map
        Map<String, Object> result = new Map<String, Object>();
        result.put('products', products);
        result.put('totalRecords', totalRecords);

        return result;
    }

    // Method to get available product categories
    @AuraEnabled(cacheable=true)
    public static List<ProductCategory__c> getCategories() {
        return [SELECT Id, Name FROM ProductCategory__c];
    }
}