public class FinancialDataCacheWithEviction {
    // Store financial data with cache expiration
    public static void storeFinancialDataWithExpiration(String accountId, String transactionHistory) {
        try {
            // Store data in the cache with a unique key
            Cache.Session.put(accountId, new Map<String, String>{
                'Transaction_History' => transactionHistory,
                'Last_Updated' => String.valueOf(DateTime.now())
            });

            System.debug('Financial data cached successfully for Account ID: ' + accountId);
        } catch (Exception e) {
            System.debug('Error in storing financial data with expiration: ' + e.getMessage());
        }
    }

    // Evict data from the cache based on certain conditions
    public static void evictExpiredData(String accountId) {
        try {
            // Check if the data exists in cache and evict it if needed
            if (Cache.Session.contains(accountId)) {
                Cache.Session.remove(accountId);
                System.debug('Evicted financial data from cache for Account ID: ' + accountId);
            } else {
                System.debug('No data found in cache to evict for Account ID: ' + accountId);
            }
        } catch (Exception e) {
            System.debug('Error in evicting data from cache: ' + e.getMessage());
        }
    }
}