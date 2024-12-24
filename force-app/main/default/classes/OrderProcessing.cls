public class OrderProcessing {
    public static void processOrder(Id orderId) {
        Order__c order = [SELECT Id, Order_Number__c, Customer_ID__c, Status__c 
                          FROM Order__c WHERE Id = :orderId];

        if (!validateOrder(order)) {
            throw new OrderProcessingException('Order validation failed.');
        }
        
        if (!checkInventory(order)) {
            order.Status__c = 'Cancelled';
            updateOrder(order);
            throw new OrderProcessingException('Inventory check failed. Order cancelled.');
        }
        order.Status__c = 'Processing';
        updateOrder(order);
        NotificationService.notifyCustomer(order.Customer_ID__c, order.Order_Number__c);
    }

    private static Boolean validateOrder(Order__c order) { 
        return String.isNotBlank(order.Order_Number__c) && order.Customer_ID__c != null;
    }

    private static Boolean checkInventory(Order__c order) { 
        return true;  
    }

    private static void updateOrder(Order__c order) {
        update order;
    } 
    public class OrderProcessingException extends Exception {}
}