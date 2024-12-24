public with sharing class ErrorMetricsController {
    @AuraEnabled
    public static void logError(String errorMessage, String severity) {
        // Create a new Error_Log__c record with severity
        ErrorData__c errorLog = new ErrorData__c();
        errorLog.Error_Message__c = errorMessage;
        errorLog.Severity__c = severity;
        insert errorLog;
    }

    @AuraEnabled(cacheable=true)
    public static List<AggregatedErrorData> getErrorStatistics() {
        // Aggregate error data by severity and message
        List<AggregatedErrorData> aggregatedData = new List<AggregatedErrorData>();

        AggregateResult[] groupedResults = [
            SELECT Error_Message__c, Severity__c, COUNT(Id) errorCount 
            FROM ErrorData__c
            GROUP BY Error_Message__c, Severity__c
            ORDER BY Severity__c DESC, COUNT(Id) DESC
        ];
        

        for (AggregateResult ar : groupedResults) {
            AggregatedErrorData data = new AggregatedErrorData();
            data.errorMessage = (String) ar.get('Error_Message__c');
            data.severity = (String) ar.get('Severity__c');
            data.count = (Integer) ar.get('errorCount');
            aggregatedData.add(data);
        }

        return aggregatedData;
    }

    public class AggregatedErrorData {
        @AuraEnabled public String errorMessage;
        @AuraEnabled public String severity;
        @AuraEnabled public Integer count;
    }
}