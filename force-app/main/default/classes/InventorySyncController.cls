public with sharing class InventorySyncController {
    // Method to synchronize product data from Salesforce
    @AuraEnabled(cacheable=true)
    public static List<Product2> syncProductData() {
        try {
            // Query the products from Salesforce. You can modify this query to fetch specific fields or conditions.
            List<Product2> productList = [SELECT Id, Name, StandardPrice__c, Description FROM Product2 WHERE IsActive = TRUE];

            // If needed, you could implement logic to sync this data with an external system here.

            return productList; // Return the product data
        } catch (Exception e) {
            // Handle any errors that occur during the fetch process
            throw new AuraHandledException('Error while fetching product data: ' + e.getMessage());
        }
    }
}