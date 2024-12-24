public class ServiceCustomerReport {

    // Method to get the service count per customer in the last 30 days, including resolved and unresolved counts
    public static List<ServiceCountByCustomer> getServiceCountForCustomers() {
        List<ServiceCountByCustomer> reports = new List<ServiceCountByCustomer>();

        // SOQL query to count services per customer for the last 30 days, including resolved services
        AggregateResult[] groupedResults = [
            SELECT 
                Customer_ID__c,
                COUNT(Id) ServiceCount,  // Total count of services
                COUNT(Resolution_Status__c) ResolvedCount  // Count of resolved services
            FROM Service_Data__c
            WHERE Service_Date__c > LAST_N_DAYS:30
            AND Resolution_Status__c = 'Resolved'  // This filters for resolved services
            GROUP BY Customer_ID__c
            ORDER BY COUNT(Id) DESC
        ];

        // Iterate over the query results and populate the list of ServiceCountByCustomer
        for (AggregateResult ar : groupedResults) {
            ServiceCountByCustomer report = new ServiceCountByCustomer();

            // Correctly accessing the aggregated fields from the AggregateResult object
            report.CustomerId = (Id) ar.get('Customer_ID__c');  // Accessing Customer ID
            report.ServiceCount = (Integer) ar.get('ServiceCount');  // Total service count
            report.ResolvedCount = (Integer) ar.get('ResolvedCount');  // Resolved service count

            // Calculate Unresolved Count
            report.UnresolvedCount = report.ServiceCount - report.ResolvedCount;  // Unresolved count = Total - Resolved

            // Add the report to the list
            reports.add(report);
        }

        return reports;
    }

    // Class to structure the results of service count per customer
    public class ServiceCountByCustomer {
        public Id CustomerId { get; set; }
        public Integer ServiceCount { get; set; }
        public Integer ResolvedCount { get; set; }  // Field for resolved service count
        public Integer UnresolvedCount { get; set; }  // Field for unresolved service count
    }
}