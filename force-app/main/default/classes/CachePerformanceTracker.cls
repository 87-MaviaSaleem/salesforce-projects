public class CachePerformanceTracker {
    
    // Method 1: Store data in Platform Cache
    public static void storeDataInCache(String cacheKey, Object data, Integer expirationTimeInSeconds) {
        try {
            // Store data in org cache partition (could be session cache too if needed)
            Cache.Org.put(cacheKey, data, expirationTimeInSeconds);
            System.debug('Stored data in cache with key: ' + cacheKey);
        } catch (Exception e) {
            System.debug('Error storing data in cache: ' + e.getMessage());
        }
    }

    // Method 2: Retrieve data from cache
    public static Object retrieveDataFromCache(String cacheKey) {
        try {
            // Retrieve data from org cache
            Object cachedData = Cache.Org.get(cacheKey);
            return cachedData;
        } catch (Exception e) {
            System.debug('Error retrieving data from cache: ' + e.getMessage());
            return null;
        }
    }

    // Method 3: Handle cache miss - Fetch fresh data if cache is expired or missed
    public static Object handleCacheMiss(String cacheKey, String dataType) {
        // Log cache miss
        logCacheAccess('Miss', cacheKey);
        
        // Fetch fresh data from the source (this should be defined for your application)
        Object freshData = fetchFreshData(dataType);
        
        // Store the fresh data in the cache
        storeDataInCache(cacheKey, freshData, 600); // 600 seconds = 10 minutes
        
        return freshData;
    }

    // Method 4: Log cache access (hit or miss)
    public static void logCacheAccess(String logType, String cacheKey) {
        try {
            Cache_Access_Log__c log = new Cache_Access_Log__c(
                Log_Type__c = logType,
                Cache_Key__c = cacheKey,
                Timestamp__c = System.now()
            );
            insert log;
            System.debug(logType + ' - Logged cache access for key: ' + cacheKey);
        } catch (Exception e) {
            System.debug('Error logging cache access: ' + e.getMessage());
        }
    }

    // Method 5: Setup Cache Partitions (e.g., for response time and error rate)
    public static Cache.OrgPartition setupCachePartitions(String partitionName) {
        try {
            Cache.OrgPartition partition = Cache.Org.getPartition(partitionName);
            return partition;
        } catch (Exception e) {
            System.debug('Error setting up cache partition: ' + e.getMessage());
            return null;
        }
    }

    // Method 6: Fetch fresh performance data (this should be replaced with your actual data fetching logic)
    public static Object fetchFreshData(String dataType) {
        Object freshData;
        try {
            // Simulate fresh data fetching logic
            if (dataType == 'responseTime') {
                freshData = 100; // Example: return response time of 100ms
            } else if (dataType == 'errorRate') {
                freshData = 0.02; // Example: return error rate of 2%
            } else {
                freshData = null;
            }
            return freshData;
        } catch (Exception e) {
            System.debug('Error fetching fresh data: ' + e.getMessage());
            return null;
        }
    }

    // Optional: Method to reset cache (for testing purposes)
    public static void resetCache(String cacheKey) {
        try {
            Cache.Org.remove(cacheKey);
            System.debug('Cache reset for key: ' + cacheKey);
        } catch (Exception e) {
            System.debug('Error resetting cache: ' + e.getMessage());
        }
    }
}