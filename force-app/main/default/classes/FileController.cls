public class FileController {
    public static void getLinkedFiles(Id recordId) {
        // Query to get ContentDocumentLink records
        List<ContentDocumentLink> links = [
            SELECT ContentDocumentId, ContentDocument.Title, LinkedEntityId 
            FROM ContentDocumentLink 
            WHERE LinkedEntityId = :recordId
        ];

        // Loop through the retrieved links and display file titles
        for (ContentDocumentLink link : links) {
            System.debug('File Title: ' + link.ContentDocument.Title);
        }
    }
}