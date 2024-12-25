public with sharing class PaginatedContactControllerWithEditSort {

    @AuraEnabled(cacheable=true)
    public static Map<String, Object> getContacts(Integer pageNumber, Integer pageSize, String sortBy, String sortDirection) {
        try {
            // Calculate the offset for pagination
            Integer offsetValue = (pageNumber - 1) * pageSize;

            // Base SOQL query
            String query = 'SELECT Id, Name, Phone, Email, Department FROM Contact WITH SECURITY_ENFORCED';

            // Add sorting if provided
            if (String.isNotBlank(sortBy)) {
                query += ' ORDER BY ' + sortBy;
            }
            if (String.isNotBlank(sortDirection)) {
                query += ' ' + sortDirection;
            }

            // Add pagination limits
            query += ' LIMIT :pageSize OFFSET :offsetValue';

            // Execute dynamic query
            List<Contact> contacts = Database.query(query);

            // Query the total number of records
            Integer totalRecords = [SELECT COUNT() FROM Contact];

            // Return both records and total count
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
