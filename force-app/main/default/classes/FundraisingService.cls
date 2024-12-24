public class FundraisingService {
    public static void fetchAndStoreInsights(String campaignId) {
        Http http = new Http();
        HttpRequest request = new HttpRequest();

        // Define the endpoint URL for the external service
        request.setEndpoint('https://api.externalservice.com/donors/insights');
        request.setMethod('GET');
        request.setHeader('Authorization', 'Bearer YOUR_ACCESS_TOKEN');

        // Make the request and handle the response
        HttpResponse response = http.send(request);
        if (response.getStatusCode() == 200) {
            // Parse JSON and extract data
            Map<String, Object> jsonResponse = (Map<String, Object>) JSON.deserializeUntyped(response.getBody());
            String externalData = (String) jsonResponse.get('external_data');
            String insights = (String) jsonResponse.get('insights');

            // Store data in Fundraising_Data__c
            Fundraising_Data__c fundraisingData = new Fundraising_Data__c(
                Campaign_ID__c = campaignId,
                External_Data__c = externalData,
                Insights_Provided__c = insights
            );
            insert fundraisingData;
        } else {
            System.debug('Error: ' + response.getStatus());
        }
    }
}