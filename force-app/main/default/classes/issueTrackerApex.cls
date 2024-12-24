/**
* @File Name : issueTrackerApex.cls
* @Description : 
* @Author : Srinivasa j
* @Last Modified By : Srinivasa j
* @Last Modified On : November 4, 2024
* @Modification Log : Srinivasa j
*==============================================================================
* Ver | Date | Author | Modification
*==============================================================================
* 1.0 | November 4, 2024 |   | Initial Version
**/

public class issueTrackerApex {
	@AuraEnabled
    public static void submitIssue(String Name, String issueDescription) {
        issueTracker__c newIssue = new issueTracker__c();
        newIssue.Name = Name;
        newIssue.Issue_Description__c = issueDescription;
        newIssue.Status__c = 'Open'; // Default status

        try {
            insert newIssue;
        } catch (DmlException e) {
            throw new AuraHandledException('Error saving issue: ' + e.getMessage());
        }
    }
}