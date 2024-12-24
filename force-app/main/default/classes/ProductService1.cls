public class ProductService1 {
    
  Integer pageNumber = 2;// Current page number 
  Integer limitSize = 20; // Number of records per page

    public static List<Product__c> getProductsByPage(Integer pageNumber, Integer limitSize) {
        // Calculate offset size based on page number and limit size
        Integer offsetSize = (pageNumber - 1) * limitSize;
        
        // Construct SOQL query to retrieve product information with pagination
        String queryString = 'SELECT Id, Name, Price__c, Category__c, Stock_Quantity__c ' +
                             'FROM Product__c ' +
                             'ORDER BY Name ' +
                             'LIMIT :limitSize ' +
                             'OFFSET :offsetSize';
        
        // Execute the SOQL query and store results in the products list
        List<Product__c> products = Database.query(queryString);
        
        // Return the list of products
        return products;
    }
}