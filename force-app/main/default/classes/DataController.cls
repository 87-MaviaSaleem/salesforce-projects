public with sharing class DataController {
    @AuraEnabled(cacheable=true)
    public static List<OfflineData__c> fetchServerData(Integer pageNumber, Integer pageSize) {
        // Calculate the offset for pagination
        Integer offset = (pageNumber - 1) * pageSize;

        // Query data with LIMIT and OFFSET for pagination
        List<OfflineData__c> dataList = [
            SELECT Id, Name, Data_Field__c, LastModifiedDate
            FROM OfflineData__c
            ORDER BY LastModifiedDate DESC
            LIMIT :pageSize
            OFFSET :offset
        ];

        return dataList;
    }

    @AuraEnabled
    public static void saveServerData(List<OfflineData__c> data) {
        try {
            // Upsert data to handle both insert and update
            upsert data;

            // Optionally, you can return a success message or updated records
        } catch (DmlException e) {
            // Handle DML exceptions
            throw new AuraHandledException('Error saving data: ' + e.getMessage());
        } catch (Exception e) {
            // Handle other exceptions
            throw new AuraHandledException('An unexpected error occurred: ' + e.getMessage());
        }
    }
}