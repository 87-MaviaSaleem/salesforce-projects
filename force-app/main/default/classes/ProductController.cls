public with sharing class ProductController {
    @AuraEnabled(cacheable=true)
    public static List<Product2> getProducts(String filter) {
        String searchFilter = '%' + String.escapeSingleQuotes(filter) + '%';
        return [SELECT Id, Name, ProductCode FROM Product2 WHERE Name LIKE :searchFilter LIMIT 10];
    }
}