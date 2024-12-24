public with sharing class TaskController {
    @AuraEnabled(cacheable=true)
    public static List<Task> getAllTasks() {
        return [SELECT Id, Subject, OwnerId, Status FROM Task];
    }

    @AuraEnabled
    public static void updateTaskStatus(Id taskId) {
        Task task = [SELECT Id, Status FROM Task WHERE Id = :taskId LIMIT 1];
        task.Status = 'Completed';
        update task;
    }
}