trigger OrderTrigger on Order__c (after insert, after update) {
    for (Order__c order : Trigger.new) {
        if (order.Status__c == 'New') {
            try {
                OrderProcessing.processOrder(order.Id);
            } catch (OrderProcessing.OrderProcessingException e) {
                System.debug('Error processing order: ' + e.getMessage());
            }
        }
    }
}