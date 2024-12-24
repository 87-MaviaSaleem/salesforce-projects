public class FinancialDataCache {
    // Method to store financial data in Platform Cache
    public static void storeFinancialData(String accountId, String transactionHistory) {
        try {
            // Store data in cache with a unique key based on the Account ID
            Cache.Session.put(accountId, new Map<String, String>{
                'Transaction_History' => transactionHistory,
                'Last_Updated' => String.valueOf(DateTime.now())
            });
            System.debug('Financial data cached successfully for Account ID: ' + accountId);
        } catch (Exception e) {
            System.debug('Error in storing financial data in cache: ' + e.getMessage());
        }
    }

    // Method to retrieve financial data from Platform Cache
    public static Map<String, String> retrieveFinancialData(String accountId) {
        try {
            // Retrieve data from the cache
            Map<String, String> cachedData = (Map<String, String>)Cache.Session.get(accountId);
            if (cachedData != null) {
                System.debug('Financial data retrieved from cache for Account ID: ' + accountId);
            } else {
                System.debug('No cached data found for Account ID: ' + accountId);
            }
            return cachedData;
        } catch (Exception e) {
            System.debug('Error in retrieving financial data from cache: ' + e.getMessage());
            return null;
        }
    }
}