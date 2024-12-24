public class CustomerServiceReport {
    
    // Method to get the service count per customer in the last 30 days
    public static List<ServiceCountByCustomer> getServiceCountForCustomers() {
        List<ServiceCountByCustomer> reports = new List<ServiceCountByCustomer>();
        
        // SOQL query to count services per customer for the last 30 days
        AggregateResult[] groupedResults = [
            SELECT Customer_ID__c, COUNT(Id) ServiceCount
            FROM Service_Data__c
            WHERE Service_Date__c > LAST_N_DAYS:30
            GROUP BY Customer_ID__c
            ORDER BY COUNT(Id) DESC  // Use COUNT(Id) in the ORDER BY clause
        ];
        
        // Iterate over the query results and populate the list of ServiceCountByCustomer
        for (AggregateResult ar : groupedResults) {
            ServiceCountByCustomer report = new ServiceCountByCustomer();
            
            // Correctly accessing the aggregated fields from the AggregateResult object
            report.CustomerId = (Id) ar.get('Customer_ID__c');  // Accessing Customer ID
            report.ServiceCount = (Integer) ar.get('expr0');  // Accessing the alias 'expr0' from COUNT(Id)
            
            reports.add(report);
        }
        
        return reports;
    }

    // Inner class to structure the results of service count per customer
    public class ServiceCountByCustomer {
        public Id CustomerId { get; set; }
        public Integer ServiceCount { get; set; }
    }
}