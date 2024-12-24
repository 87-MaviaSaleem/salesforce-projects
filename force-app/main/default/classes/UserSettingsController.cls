public with sharing class UserSettingsController {

    @AuraEnabled(cacheable=true)
    public static String getCurrentUserId() {
        return UserInfo.getUserId();
    }

    @AuraEnabled(cacheable=true)
    public static Map<String, Object> getUserSettings(String userId) {
        if (String.isBlank(userId)) {
            throw new AuraHandledException('User ID is required');
        }
        
        Map<String, Object> userSettings = new Map<String, Object>();
        try {
            // Query UserSettings__c for the given user
            List<UserSettings__c> settingsRecords = [
                SELECT Notification_Settings__c, Data_Visbility__c
                FROM UserSettings__c
                WHERE User__c = :userId
                LIMIT 1
            ];
            
            if (!settingsRecords.isEmpty()) {
                // If record exists, map it to the settings
                UserSettings__c settingsRecord = settingsRecords[0];
                userSettings.put('notificationSetting', settingsRecord.Notification_Settings__c);
                userSettings.put('dataVisibility', settingsRecord.Data_Visbility__c); // Use Data_Visibility__c field
            } else {
                // If no record found, return default values
                userSettings.put('notificationSetting', true);  // Default value
                userSettings.put('dataVisibility', 'private'); // Default value
            }
        } catch (QueryException e) {
            // If an exception occurs during the query, return default values
            userSettings.put('notificationSetting', true);  // Default value
            userSettings.put('dataVisibility', 'private'); // Default value
        }

        return userSettings;
    }

    @AuraEnabled
    public static Boolean updateUserSettings(String userId, Map<String, Object> settings) {
        if (String.isBlank(userId)) {
            throw new AuraHandledException('User ID is required');
        }
        if (settings == null || settings.isEmpty()) {
            throw new AuraHandledException('Settings data is required');
        }

        Boolean notificationSetting = (Boolean) settings.get('notificationSetting');
        String dataVisibility = (String) settings.get('dataVisibility');

        try {
            // Query UserSettings__c to check if record exists for the user
            List<UserSettings__c> settingsRecords = [
                SELECT Id FROM UserSettings__c WHERE User__c = :userId LIMIT 1
            ];

            UserSettings__c settingsRecord;

            if (!settingsRecords.isEmpty()) {
                // If record exists, update it
                settingsRecord = settingsRecords[0];
            } else {
                // If no record found, create a new one
                settingsRecord = new UserSettings__c(User__c = userId);
            }

            // Set the values to be updated
            settingsRecord.Notification_Settings__c = notificationSetting;
            settingsRecord.Data_Visbility__c = dataVisibility; // Use Data_Visibility__c field

            // Save the record
            upsert settingsRecord;

            return true;
        } catch (DmlException e) {
            throw new AuraHandledException('Error updating user settings: ' + e.getMessage());
        }
    }
}