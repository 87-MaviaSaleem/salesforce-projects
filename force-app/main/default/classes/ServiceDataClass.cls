public class ServiceDataClass {
    
    // Method to execute the query and return results
    public static void ServiceDataQuery() {
        
        // SOQL query to get the grouped results
        AggregateResult[] results = [SELECT Service_Type__c, Resolution_Status__c, COUNT(Id)
                                     FROM Service_Data__c
                                     GROUP BY Service_Type__c, Resolution_Status__c];
        
        // Loop through the results and print the data
        for (AggregateResult ar : results) {
            String serviceType = (String)ar.get('Service_Type__c');
            String resolutionStatus = (String)ar.get('Resolution_Status__c');
            Integer count = (Integer)ar.get('expr0'); // 'expr0' is the default name for the COUNT(Id) aggregate result

            // Log the results to the debug log
            System.debug('Service Type: ' + serviceType + ', Resolution Status: ' + resolutionStatus + ', Count: ' + count);
        }
    }
}