public class OrderValidation {
    // Method to validate the order details
    public static void validateOrder(Order__c order) {
        // Check if order number is not empty and valid
        if (String.isEmpty(order.Order_Number__c)) {
            throw new OrderValidationException('Order Number is required.');
        }

        // Ensure that Customer ID is not null
        if (order.Customer_ID__c == null) {
            throw new OrderValidationException('Customer ID is required.');
        }

        // Add any other validation logic (e.g., order status, inventory check)
        if (order.Status__c == 'Cancelled') {
            throw new OrderValidationException('Order is already cancelled.');
        }

        System.debug('Order validated successfully: ' + order.Order_Number__c);
    }

    // Custom exception for order validation
    public class OrderValidationException extends Exception {}
}