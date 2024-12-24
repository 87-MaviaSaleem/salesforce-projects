public class UpdateAccountProd{
public static void updateAccountProducts(List<Opportunity> opps) {
    Map<Id, Set<String>> mp = new Map<Id, Set<String>>();
    List<Account> acctLst = new List<Account>();
     for (Opportunity o : opps) {
        
        if (o.AccountId != null && String.isNotBlank(o.Products__c)) {
              if (!mp.containsKey(o.AccountId)) {
                system.debug('OppertunityHelp4');
                mp.put(o.AccountId, new Set<String>());
            }
 
            mp.get(o.AccountId).addAll(o.Products__c.split(';'));
        }
    }
    if(mp.KeySet() != null){
         acctLst = [SELECT Id, Products_Purchased__c FROM Account WHERE ID IN :mp.KeySet()];
    }
       for (Account a : acctLst) {
        
        if (mp.ContainsKey(a.Id)) {
           
            Set<String> products = mp.get(a.Id);
            if (String.isNotBlank(a.Products_Purchased__c)) {
                
                products.addAll(a.Products_Purchased__c.split(';'));
            }
            List<String> productsList = new List<String>();
            productsList.addAll(products);
            a.Products_Purchased__c = String.join(productsList, ';');
        }
    }
    update acctLst;
}
}