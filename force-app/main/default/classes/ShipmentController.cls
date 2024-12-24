public with sharing class ShipmentController {

    private static final String CACHE_NAMESPACE = 'ShipFastCache'; // Cache Partition Name
    private static final String SHIPMENT_PREFIX = 'ShipmentData_';

    /**
     * Retrieves shipment data with caching.
     * @param trackingNumber The shipment's tracking number.
     * @return JSON serialized shipment data.
     * @throws IllegalArgumentException if the tracking number is invalid.
     */
    @AuraEnabled(cacheable=true)
    public static String getShipmentData(String trackingNumber) {
        if (String.isBlank(trackingNumber)) {
            throw new IllegalArgumentException('Tracking number cannot be null or empty.');
        }

        // Generate cache key based on tracking number
        String cacheKey = SHIPMENT_PREFIX + trackingNumber;

        // Try to retrieve data from cache
        String cachedData = getFromCache(cacheKey);
        if (cachedData != null) {
            return cachedData; // Return cached data if it exists
        }

        // If not in cache, retrieve data from DB
        Shipment__c shipment = [
            SELECT Id, Shipment_Tracking_Number__c, Status__c, Expected_Delivery_Date__c
            FROM Shipment__c
            WHERE Shipment_Tracking_Number__c = :trackingNumber
            LIMIT 1
        ];

        // Serialize and store in cache
        String shipmentData = JSON.serialize(shipment);
        storeInCache(cacheKey, shipmentData, 3600); // Store data for 1 hour

        return shipmentData;
    }

    /**
     * Retrieve data from cache.
     * @param cacheKey The cache key.
     * @return Cached data or null if not found.
     */
    private static String getFromCache(String cacheKey) {
        // Use Cache.Session.get() to retrieve the data for the given key
        Object cachedData = Cache.Session.get(cacheKey); // Only one parameter (cache key)
        return cachedData != null ? (String) cachedData : null;
    }

    /**
     * Store data in cache.
     * @param cacheKey The cache key.
     * @param data The data to be stored.
     * @param ttl The time-to-live (TTL) in seconds for the cache.
     */
    private static void storeInCache(String cacheKey, String data, Integer ttl) {
        // Use Cache.Session.put() to store the data with a TTL (time-to-live)
        Cache.Session.put(cacheKey, data, ttl); // Only one parameter (cache key)
    }

    /**
     * Cache busting mechanism (removes outdated data).
     * @param trackingNumber The tracking number whose cache needs to be invalidated.
     */
    @AuraEnabled
    public static void bustCache(String trackingNumber) {
        String cacheKey = SHIPMENT_PREFIX + trackingNumber;
        // Use Cache.Session.remove() to remove the data from cache
        Cache.Session.remove(cacheKey); // Only one parameter (cache key)
    }
}