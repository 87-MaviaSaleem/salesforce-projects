public class ProductService2 {
  // Define filter and pagination parameters
String categoryFilter = 'Electronics'; 
Integer pageNumber = 2; 
Integer limitSize = 20;

     public static List<Product__c> getProductsByPageAndCategory(String categoryFilter, Integer pageNumber, Integer limitSize) {
        // Calculate offset size based on page number and limit size
        Integer offsetSize = (pageNumber - 1) * limitSize;

        // Construct SOQL query to retrieve product information with filtering and pagination
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