public class ProductService {
    Integer limitSize = 20; // Number of records per page 
    Integer offsetSize = 0; // Current page number
    
    public static List<Product__c> getProductsByPage(Integer limitSize, Integer pageNumber) {
        Integer offsetSize = (pageNumber - 1) * limitSize; 
        
        // SOQL query to retrieve product information with pagination
        String queryString = 'SELECT Id, Name, Price__c, Category__c, Stock_Quantity__c ' +
                             'FROM Product__c ' +
                             'ORDER BY Name ' +
                             'LIMIT :limitSize ' +
                             'OFFSET :offsetSize';
        
         // Fetch products from database with pagination
        List<Product__c> products = Database.query(queryString);
        return products;
    }
}