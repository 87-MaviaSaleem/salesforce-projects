public class AccountSearchFilterSortController {
	// Apex method to fetch filtered, sorted, and searched Account records
    @AuraEnabled(cacheable=true)
    public static List<Account> getSearchFilterSort(String accountName, String industry, String sortBy, String sortOrder) {
        String query = 'SELECT Id, Name, Industry, CreatedDate FROM Account';
        List<String> conditions = new List<String>();

        // First functionality: Search by Account Name
        if (!String.isBlank(accountName)) {
            // Escape special characters
            String searchPattern = '%' + accountName + '%';
            conditions.add('Name LIKE :searchPattern');
        }

        // Second functionality: Filter by Industry
        if (!String.isBlank(industry)) {
            conditions.add('Industry = :industry');
        }

        // Combine conditions with 'AND' if necessary
        if (!conditions.isEmpty()) {
            query += ' WHERE ' + String.join(conditions, ' AND ');
        }

        // Third functionality: Sorting
        // Default sorting by 'Name' if no 'sortBy' is provided
        if (!String.isBlank(sortBy)) {
            // Ensure the sort order is safe (either 'asc' or 'desc')
            if (sortOrder != 'asc' && sortOrder != 'desc') {
                sortOrder = 'asc';  // Default to ascending if invalid order is provided
            }
            query += ' ORDER BY ' + sortBy + ' ' + sortOrder;
        }

        // Add a LIMIT to restrict the number of records returned (to prevent performance issues)
        query += ' LIMIT 10';

        try {
            // Execute the query
            return Database.query(query);
        } catch (Exception e) {
            // Handle any errors and provide a clear message to the component
            throw new AuraHandledException('Error in querying Account records: ' + e.getMessage());
        }
    }
}