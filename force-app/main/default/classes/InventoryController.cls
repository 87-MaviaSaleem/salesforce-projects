public class InventoryController {
    @AuraEnabled(cacheable=true)
    public static List<Inventory__c> getInventory() {
        return [SELECT Id, ItemName__c, StockLevel__c, LastUpdated__c FROM Inventory__c];
    }

    @AuraEnabled
    public static void updateInventoryStock(Id inventoryId, Integer stockLevel) {
        Inventory__c inventory = [SELECT Id FROM Inventory__c WHERE Id = :inventoryId LIMIT 1];
        inventory.StockLevel__c = stockLevel;
        inventory.LastUpdated__c = System.now();
        update inventory;
    }
}