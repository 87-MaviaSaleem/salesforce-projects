public class TransactionHistoryCache {
    // Method to store transaction history in Platform Cache
    public static void storeTransactionHistory(String accountId, String transactionHistory) {
        try {
            // Store the transaction history in cache using the Account ID as the key
            Cache.Session.put(accountId + '_transactionHistory', transactionHistory);
            System.debug('Transaction history cached for Account ID: ' + accountId);
        } catch (Exception e) {
            System.debug('Error in storing transaction history in cache: ' + e.getMessage());
        }
    }

    // Method to retrieve transaction history from Platform Cache
    public static String retrieveTransactionHistory(String accountId) {
        try {
            // Retrieve the cached transaction history for the given account
            String cachedHistory = (String)Cache.Session.get(accountId + '_transactionHistory');
            if (cachedHistory != null) {
                System.debug('Transaction history retrieved from cache for Account ID: ' + accountId);
            } else {
                System.debug('No cached transaction history found for Account ID: ' + accountId);
            }
            return cachedHistory;
        } catch (Exception e) {
            System.debug('Error in retrieving transaction history from cache: ' + e.getMessage());
            return null;
        }
    }
}