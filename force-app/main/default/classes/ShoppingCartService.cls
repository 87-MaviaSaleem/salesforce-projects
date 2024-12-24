public class ShoppingCartService {
    
        // Add items to the shopping cart and cache the data
        public static void addToCart(Id userId, List<String> itemIds) {
            // Retrieve existing cart data from cache
            Cache.SessionPartition sessionCache = Cache.Session.getPartition('ecommerce');
            String cacheKey = 'Cart_' + userId;
            
            List<String> cartItems = (List<String>)sessionCache.get(cacheKey);
            if (cartItems == null) {
                cartItems = new List<String>();
            }
            
            // Add new items to cart
            cartItems.addAll(itemIds);
            sessionCache.put(cacheKey, cartItems);
            
            // Update Shopping_Cart_Cache__c record
            Shopping_Cart_Cache__c cartCacheRecord = [SELECT Id FROM Shopping_Cart_Cache__c WHERE User_ID__c = :userId LIMIT 1];
            cartCacheRecord.Cart_Items__c = JSON.serialize(cartItems);
            cartCacheRecord.Last_Updated__c = System.now();
            update cartCacheRecord;
        }
    
        // Retrieve cart data for a user
        public static List<String> getCartItems(Id userId) {
            Cache.SessionPartition sessionCache = Cache.Session.getPartition('ecommerce');
            String cacheKey = 'Cart_' + userId;
            
            List<String> cartItems = (List<String>)sessionCache.get(cacheKey);
            if (cartItems == null) {
                // Retrieve from database if not in cache
                Shopping_Cart_Cache__c cartCacheRecord = [SELECT Cart_Items__c FROM Shopping_Cart_Cache__c WHERE User_ID__c = :userId LIMIT 1];
                cartItems = (List<String>)JSON.deserialize(cartCacheRecord.Cart_Items__c, List<String>.class);
                sessionCache.put(cacheKey, cartItems);
            }
            return cartItems;
        }
    
        // Clear the cart cache on inventory update
        public static void clearCartCache(Id userId) {
            Cache.SessionPartition sessionCache = Cache.Session.getPartition('ecommerce');
            String cacheKey = 'Cart_' + userId;
            sessionCache.remove(cacheKey);
        }
    }