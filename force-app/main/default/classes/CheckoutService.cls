public class CheckoutService {
    
    // Method to calculate final price (as before)
    public static Decimal getFinalPrice(Id productId) {
         Dynamic_Pricing__c dynamicPricing;
        system.debug('productId'+productId);
        // Query for the dynamic pricing, if any
        if(productId != null){
           
            dynamicPricing = [SELECT Dynamic_Price__c FROM Dynamic_Pricing__c WHERE Product_ID__c = :productId LIMIT 1];
        }
        
        
        // Return dynamic price if available, else return standard price
        Decimal finalPrice = (dynamicPricing != null) ? dynamicPricing.Dynamic_Price__c : getStandardPrice(productId);
        
        return finalPrice;
    }

    // Method to get standard price from the Product2 object
    public static Decimal getStandardPrice(Id productId) {
        Product2 product = [SELECT StandardPrice__c FROM Product2 WHERE Id = :productId LIMIT 1];
        return product.StandardPrice__C;
    }
    
    // Method to process the payment using CommercePayments
    public static void processPayment(Id productId, Id customerId, String paymentMethod) {
        //  Get the final price for the product
        Decimal finalPrice = getFinalPrice(productId);
        
     
        Payment__c payment = new Payment__c();
        
        payment.Amount__c = finalPrice;                
        payment.CustomerId__c = CustomerId;          
        payment.Payment__C = paymentMethod;      
        payment.Currency_Code__c = 'USD';                   
        insert payment;
        //Create a CommercePayments.Transaction object
        Transaction__c transactions = new Transaction__c();
        transactions.Payment__c = payment.Id;
        transactions.TransactionType__c = 'Capture';    
        transactions.Status__C = 'Pending';            
        
        // Insert the transaction into Salesforce (you may want to handle exceptions here)
        insert transactions;
        

        // Step 6: Update the transaction status once payment is processed
        transactions.Status__c = 'Completed'; // Assuming payment was successful
        update transactions;
        
        // Step 7: Optionally, you can add additional logic such as generating invoices, sending receipts, etc.
    }
    
   
    // Example method to handle the checkout process
    public static void checkout(Id productId, Id customerId, String paymentMethod) {
        try {
            // Process payment and finalize the checkout
            processPayment(productId, customerId, paymentMethod);
            System.debug('Checkout successful for customer ' + customerId + ' and product ' + productId);
        } catch (Exception e) {
            System.debug('Error during checkout: ' + e.getMessage());
            // Handle exception (e.g., show error message to user, log error, etc.)
        }
    }
}