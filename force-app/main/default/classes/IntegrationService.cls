public class IntegrationService {
    public static void syncInventory() {
        Http http = new Http();
        HttpRequest request = new HttpRequest();
        Integration_Log__c log = new Integration_Log__c();
        request.setEndpoint(APIConfiguration.getInventoryAPIUrl());
        request.setHeader('Authorization', 'Bearer ' + APIConfiguration.getAPIKey());
        request.setMethod('GET');
        
        try {
            HttpResponse response = http.send(request);
            if (response.getStatusCode() == 200) {
               log.Name = 'Success Log';
               log.External_System__c = 'External System';
               log.Last_Sync_Time__c = system.now();
               log.Sync_Status__c = 'Success';
            } else {
               log.Name = 'Failure Log';
               log.External_System__c = 'External System';
               log.Last_Sync_Time__c = DateTime.parse(System.Now().format());
               log.Sync_Status__c = 'Failure';
            }
        } catch (Exception e) {
           	   log.Name = e.getmessage();
               log.External_System__c = 'External System';
               log.Last_Sync_Time__c = DateTime.parse(System.Now().format());
               log.Sync_Status__c = 'Failure';
        }
    }
}