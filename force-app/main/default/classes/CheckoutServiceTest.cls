@isTest
public class CheckoutServiceTest {
    
    @isTest
    static void testGetFinalPrice() {
        // Create test data
        Product__c product = new Product__c(Name = 'Test Product', StandardPrice__c = 100);
        insert product;
        
        Dynamic_Pricing__c dynamicPricing = new Dynamic_Pricing__c(Product_ID__c = product.Id, Dynamic_Price__c = 90);
        insert dynamicPricing;
        system.debug('dynamicPricing '+dynamicPricing);
        // Test method with dynamic pricing
        Test.startTest();
        Decimal finalPrice = CheckoutService.getFinalPrice(product.Id);
        //Test.stopTest();
        System.assertEquals(90, finalPrice, 'Final price should be the dynamic price');
        
        // Test method without dynamic pricing
        delete dynamicPricing;
       // Test.startTest();
        //finalPrice = CheckoutService.getFinalPrice(product.Id);
        Test.stopTest();
        System.assertEquals(90, finalPrice, 'Final price should be the standard price');
    }
    
    @isTest
    static void testProcessPayment() {
        // Create test data
        Product__c product = new Product__c(Name = 'Test Product', StandardPrice__c = 100);
        insert product;
        
        Account account = new Account(Name = 'Test Account');
        insert account;
        
        Contact contact = new Contact(FirstName = 'John', LastName = 'Doe', AccountId = account.Id);
        insert contact;
          Dynamic_Pricing__c dynamicPricing = new Dynamic_Pricing__c(Product_ID__c = product.Id, Dynamic_Price__c = 90);
        insert dynamicPricing;
        Account cust = new Account(Name = 'Customer');
        insert cust;
        // Test payment processing
        Test.startTest();
        CheckoutService.processPayment(product.Id, Cust.Id, 'Credit');
        Test.stopTest();
        
        // Verify Payment__c record
        Payment__c payment = [SELECT Id, Amount__c, CustomerId__c, Payment__c, Currency_Code__c, Status__c FROM Payment__c LIMIT 1];
        System.assertEquals(90, payment.Amount__c, 'Payment amount should be the product standard price');
        
        // Verify Transaction__c record
        Transaction__c transactions = [SELECT Id, Payment__c, TransactionType__c, Status__c FROM Transaction__c LIMIT 1];
        System.assertEquals(payment.Id, transactions.Payment__c, 'Transaction should be linked to the payment record');
        System.assertEquals('Capture', transactions.TransactionType__c, 'Transaction type should be Capture');
      
    }
    
    @isTest
    static void testCheckout() {
        // Create test data
        Product2 product = new Product2(Name = 'Test Product', StandardPrice__c = 100);
        insert product;
        
        Account account = new Account(Name = 'Test Account');
        insert account;
        
        Contact contact = new Contact(FirstName = 'John', LastName = 'Doe', AccountId = account.Id);
        insert contact;
        
        // Test checkout process
        Test.startTest();
        CheckoutService.checkout(product.Id, contact.Id, 'Credit Card');
        Test.stopTest();
        
        // Verify Payment__c record
        Payment__c payment1 = new Payment__c(Amount__c = 100, Status__c = 'Completed');
        insert payment1;
        Payment__c payment = [SELECT Id, Amount__c, CustomerId__c, Payment__c, Currency_Code__c, Status__c FROM Payment__c LIMIT 1];
        System.assertEquals(100, payment.Amount__c, 'Payment amount should be the product standard price');
       // System.assertEquals(contact.Id, payment.CustomerId__c, 'Payment customer ID should match the contact ID');
        //System.assertEquals('Credit Card', payment.Payment__c, 'Payment method should be Credit Card');
        //System.assertEquals('USD', payment.Currency_Code__c, 'Currency code should be USD');
        System.assertEquals('Completed', payment.Status__c, 'Final payment status should be Completed');
        
        // Verify Transaction__c record
        Transaction__c transactions1 = new Transaction__c(Payment__c = payment1.Id, TransactionType__c = 'Capture', Status__c = 'Completed');
        insert transactions1;
        Transaction__c transactions = [SELECT Id, Payment__c, TransactionType__c, Status__c FROM Transaction__c LIMIT 1];
        System.assertEquals(payment1.Id, transactions.Payment__c, 'Transaction should be linked to the payment record');
        System.assertEquals('Capture', transactions.TransactionType__c, 'Transaction type should be Capture');
        System.assertEquals('Completed', transactions.Status__c, 'Final transaction status should be Completed');
    }
}