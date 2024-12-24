public class DataVisualizationController {

    @auraEnabled
    public static List<Visualization_Data__c> getVisualizationData(String visualizationType, Id userId) {
        String query = 'SELECT Id, Visualization_Type__c, Data_Value__c FROM Visualization_Data__c WHERE Visualization_Type__c = :visualizationType AND User_ID__c = :userId';
        return Database.query(query);
    }
}