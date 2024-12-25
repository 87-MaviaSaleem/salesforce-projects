public with sharing class PaginatedContactController {

    @AuraEnabled(cacheable=true)
    public static  Map<String, Object> getContacts(Integer pageNumber, Integer pageSize) {
        try {
            // Calculate the offset based on the current page and page size
            Integer offsetValue = (pageNumber - 1) * pageSize;

            
            List<Contact> contacts = [
                SELECT  Name, Phone, Email, Department 
                FROM Contact
                WITH SECURITY_ENFORCED
                LIMIT :pageSize OFFSET :offsetValue
                
            ];

            // Query the total number of records
            Integer totalRecords = [SELECT COUNT() FROM Contact];

            // Return a Map containing both opportunities and record count
            return new Map<String, Object>{
                'contacts' => contacts,
                'total' => totalRecords
            };

            

        }
        catch (Exception e) {
            System.debug('Error while fetching the opportunities: ' + e.getMessage());
            // Exception thrown in case of some error
            throw new AuraHandledException('Sorry...Not able to fetch opportunity records.');
        }
    }

}