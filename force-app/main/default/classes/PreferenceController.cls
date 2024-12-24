public with sharing class PreferenceController {
    @AuraEnabled
    public static void createUserPreference(String preferenceType, String preferenceValue) {
        User_Preference_Event__c newPreference = new User_Preference_Event__c(
            Preference_Type__c = preferenceType,
            Preference_Value__c = preferenceValue
        );
        insert newPreference;
    }
}