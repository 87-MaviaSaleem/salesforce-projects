public class TestResultController {
    @AuraEnabled
    public static void saveTestResult(String authStatus, String errorMessage, Date testDate) {
        TestResult__c result = new TestResult__c();
        result.Auth_Status__c = authStatus;
        result.Error_Message__c = errorMessage;
        result.Test_Date__c = testDate;
        insert result;
    }
}