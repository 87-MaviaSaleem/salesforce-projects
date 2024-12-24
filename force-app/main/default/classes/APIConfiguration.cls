public class APIConfiguration {
    public static String getInventoryAPIUrl() {
        return API_Configuration__c.getInstance().Inventory_API_URL__c;
    }
    public static String getPaymentAPIUrl() {
        return API_Configuration__c.getInstance().Payment_API_URL__c;
    }
    public static String getAPIKey() {
        return API_Configuration__c.getInstance().API_Key__c;
    }
}