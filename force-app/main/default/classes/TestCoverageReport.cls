public class TestCoverageReport {
    @AuraEnabled
    public static void insertTestCoverage(String componentName, Integer coveragePercentage, Integer bugsFound) {
        Test_Coverage_Report__c coverageReport = new Test_Coverage_Report__c(
            Component_Name__c = componentName,
            Coverage_Percentage__c = coveragePercentage,
            Bugs_Found__c = bugsFound
        );
        insert coverageReport;
    }
}