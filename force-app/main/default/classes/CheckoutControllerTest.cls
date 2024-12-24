@isTest
public class CheckoutControllerTest {
    @isTest
    static void testApplyDynamicPriceToCheckout() {
        // Create test data
        Product2 product = new Product2(Name = 'Test Product', ProductCode = 'TP001');
        insert product;

        // Create a dynamic pricing record for the product
        Dynamic_Pricing__c dynamicPricing = new Dynamic_Pricing__c(
            Product_ID__c = product.Id,
            Dynamic_Price__c = 100.0
        );
        insert dynamicPricing;

        // Create a cart and assign the product
        Integer cartId = 12345; // Example cart ID

        // Call the method to apply dynamic pricing
        Test.startTest();
        CheckoutController.applyDynamicPriceToCheckout(product.Id, cartId);
        Test.stopTest();

        // Verify the payment record is created with the correct amount
        List<Payment__c> payments = [SELECT Cart_Id__c, Product_ID__c, Amount__c FROM Payment__c WHERE Cart_Id__c = :cartId];
        System.assertEquals(1, payments.size(), 'Expected one payment record');
        System.assertEquals(product.Id, payments[0].Product_ID__c, 'Product ID mismatch');
        System.assertEquals(100.0, payments[0].Amount__c, 'Amount mismatch');
    }

    @isTest
    static void testApplyDynamicPriceToCheckoutWithNullProduct() {
        // Test with null product ID
        Integer cartId = 12345; // Example cart ID

        // Call the method with null product ID
        Test.startTest();
        CheckoutController.applyDynamicPriceToCheckout(null, cartId);
        Test.stopTest();

        // Verify no payment records are created
        List<Payment__c> payments = [SELECT Id FROM Payment__c WHERE Cart_Id__c = :cartId];
        System.assertEquals(0, payments.size(), 'Expected no payment records');
    }
}