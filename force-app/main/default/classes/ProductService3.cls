public class ProductService3 {

    public static List<Product__c> getProductsByPageAndCategory(String categoryFilter, Integer pageNumber, Integer limitSize) {
        // Count total products matching the category filter
        Integer totalCount = [SELECT COUNT() FROM Product__c WHERE Category__c = :categoryFilter];

        // Calculate total pages based on total count and limit size
        Integer totalPages = (totalCount + limitSize - 1) / limitSize;

        // Log total pages for debugging purposes
        System.debug('Total Pages: ' + totalPages);

        // Calculate offset size based on page number and limit size
        Integer offsetSize = (pageNumber - 1) * limitSize;

        // Construct SOQL query to retrieve product information with filtering, sorting, and pagination
        String queryString = 'SELECT Id, Name, Price__c, Category__c, Stock_Quantity__c ' +
                             'FROM Product__c ' +
                             'WHERE Category__c = :categoryFilter ' +
                             'ORDER BY Name ' +
                             'LIMIT :limitSize ' +
                             'OFFSET :offsetSize';

        // Execute the SOQL query and store results in the products list
        List<Product__c> products = Database.query(queryString);

        // Return the list of products
        return products;
    }
}