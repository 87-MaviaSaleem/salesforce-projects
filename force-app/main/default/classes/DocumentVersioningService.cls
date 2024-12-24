public class DocumentVersioningService {

    // Method to handle multiple file uploads and version tracking in bulk
    public static void handleBulkFileUpload(List<Id> contentDocumentIds, List<Blob> fileContents, List<String> fileNames) {
        
        // Ensure input lists have the same size
        if (contentDocumentIds.size() != fileContents.size() || contentDocumentIds.size() != fileNames.size()) {
            throw new IllegalArgumentException('ContentDocumentIds, fileContents, and fileNames must have the same size.');
        }

        // Query existing content versions in bulk to find the latest versions
        Map<Id, Integer> documentVersionMap = new Map<Id, Integer>();
        List<ContentVersion> existingVersions = [SELECT Id, ContentDocumentId, VersionNumber 
                                                 FROM ContentVersion
                                                 WHERE ContentDocumentId IN :contentDocumentIds
                                                 ORDER BY ContentDocumentId, VersionNumber DESC];

        // Map ContentDocumentId to the latest version number
        for (ContentVersion cv : existingVersions) {
            documentVersionMap.put(cv.ContentDocumentId, Integer.valueOf(cv.VersionNumber));
        }

        // Prepare ContentVersion records for insertion
        List<ContentVersion> newVersionsToInsert = new List<ContentVersion>();

        for (Integer i = 0; i < contentDocumentIds.size(); i++) {
            Id contentDocumentId = contentDocumentIds[i];
            Blob fileContent = fileContents[i];
            String fileName = fileNames[i];

            // Get the latest version number or start at 1 if no version exists
            Integer nextVersion = documentVersionMap.containsKey(contentDocumentId) ? documentVersionMap.get(contentDocumentId) + 1 : 1;

            // Create new ContentVersion record for each file
            ContentVersion newVersion = new ContentVersion(
                ContentDocumentId = contentDocumentId,   // link to existing ContentDocument
                Title = fileName,                        // file title
                PathOnClient = fileName,                 // file name in the client
                VersionData = fileContent                // file contents (Blob)
            );
            newVersionsToInsert.add(newVersion);
        }

        // Insert the new versions in bulk
        if (!newVersionsToInsert.isEmpty()) {
            try {
                insert newVersionsToInsert;
            } catch (DmlException e) {
                System.debug('Error inserting ContentVersions: ' + e.getMessage());
                throw new AuraHandledException('Error inserting ContentVersions. Please try again.');
            }
        }
    }
}