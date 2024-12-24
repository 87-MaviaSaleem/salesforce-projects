trigger Access_Permission on ContentDocument (after insert, after update) {
    
    // Handle access permissions when a new file is uploaded
    if (Trigger.isInsert) {
        for (ContentDocument doc : Trigger.new) {
            // Assign default access based on role (for simplicity, assume Admin has access)
            FileAccessPermissionService.updateFileAccessPermission(doc.Id, 'Admin', true);
            FileAccessPermissionService.updateFileAccessPermission(doc.Id, 'Manager', false);
            FileAccessPermissionService.updateFileAccessPermission(doc.Id, 'Employee', false);
        }
    }

    // Handle updates (e.g., user role changes or updating access)
    if (Trigger.isUpdate) {
        for (ContentDocument doc : Trigger.new) {
            // Logic for handling file access changes based on business rules
            // For example, update permissions if access criteria are updated
            FileAccessPermissionService.updateFileAccessPermission(doc.Id, 'Manager', true);  // Example: Managers are granted access after some condition
        }
    }
}