// ProjectController.cls
public with sharing class ProjectController {
    @AuraEnabled
    public static String createProject(String projectName, String status) {
        try {
            // Check for existing projects with the same name
            List<Project__c> existingProjects = [SELECT Id FROM Project__c WHERE Project_Name__c = :projectName LIMIT 1];
            if (!existingProjects.isEmpty()) {
                throw new CustomException('A project with this name already exists.');
            }

            // Create and insert the new project record
            Project__c newProject = new Project__c(Project_Name__c = projectName, Status__c = status);
            insert newProject;

            return 'Project created successfully';
        } catch (CustomException e) {
            return 'Error: ' + e.getMessage();
        } catch (Exception e) {
            return 'Unexpected Error: ' + e.getMessage();
        }
    }

    public class CustomException extends Exception {}
}