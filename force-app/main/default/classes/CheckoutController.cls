public class CheckoutController {

    public static void applyDynamicPriceToCheckout(String productId, Integer cartId) {

        Dynamic_Pricing__c dynamicPriceRecord;
        system.debug('ProductID'+productId);
        if(productId != null){
         dynamicPriceRecord = [SELECT Dynamic_Price__c FROM Dynamic_Pricing__c WHERE Product_ID__c = :productId LIMIT 1];
        }
        List<Payment__c> ListPayment = new List<Payment__c>();
 
        Payment__c payment = new Payment__c();
        payment.Cart_Id__c = cartId;
        payment.Product_ID__c = productId;
        payment.Amount__c = dynamicPriceRecord.Dynamic_Price__c;  
        ListPayment.add(payment);
    
		Database.SaveResult[] saveResults = Database.insert(ListPayment, false);
       for(Database.SaveResult sr : saveResults)
		{
			if (sr.isSuccess())
			{
				System.debug('Record with Id '+ sr.getId() + 'was inserted successfully.');
			}		
			else {
				for(Database.Error err : sr.getErrors()) {
				System.debug('Error message: '+ err.getMessage());
				}
			}
		}
    }
}