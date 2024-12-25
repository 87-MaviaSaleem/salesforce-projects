public with sharing class PaginatedContactControllerWithInlineEdit {

    @AuraEnabled(cacheable=true)
    public static Map<String, Object> getContacts(Integer pageNumber, Integer pageSize) {
        try {
            // Calculate the offset based on the current page and page size
            Integer offsetValue = (pageNumber - 1) * pageSize;

            // Fetch contacts with pagination
            List<Contact> contacts = [
                SELECT Id, Name, Phone, Email, Department 
                FROM Contact
                WITH SECURITY_ENFORCED
                LIMIT :pageSize OFFSET :offsetValue
            ];

            // Query the total number of records
            Integer totalRecords = [SELECT COUNT() FROM Contact];

            // Return a Map containing both contacts and record count
            return new Map<String, Object>{
                'contacts' => contacts,
                'total' => totalRecords
            };
        } catch (Exception e) {
            System.debug('Error while fetching contacts: ' + e.getMessage());
            throw new AuraHandledException('Sorry, unable to fetch contact records.');
        }
    }
}
