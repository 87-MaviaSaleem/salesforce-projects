@isTest
public class ServiceCustomerReportTest {

    // Test method for generating service count for customers
    @isTest
    public static void testGetServiceCountForCustomers() {
        // Create test Accounts (customers)
        Account acc1 = new Account(Name = 'Customer A');
        Account acc2 = new Account(Name = 'Customer B');
        insert new List<Account>{ acc1, acc2 };

        // Create test Service Data records for the last 30 days
        Service_Data__c service1 = new Service_Data__c(
            Customer_ID__c = acc1.Id,
            Service_Date__c = Date.today().addDays(-5),
            Resolution_Status__c = 'Resolved'
        );
        Service_Data__c service2 = new Service_Data__c(
            Customer_ID__c = acc1.Id,
            Service_Date__c = Date.today().addDays(-3),
            Resolution_Status__c = 'Unresolved'
        );
        Service_Data__c service3 = new Service_Data__c(
            Customer_ID__c = acc2.Id,
            Service_Date__c = Date.today().addDays(-10),
            Resolution_Status__c = 'Resolved'
        );
        insert new List<Service_Data__c>{ service1, service2, service3 };

        // Call the method to get service counts
        Test.startTest();
        List<ServiceCustomerReport.ServiceCountByCustomer> reports = ServiceCustomerReport.getServiceCountForCustomers();
        Test.stopTest();

        // Validate the results with assertions
        System.assertNotEquals(reports, null, 'The report should not be null');
        System.assertEquals(reports.size(), 2, 'There should be two customers in the report');

        // Check that the service count for Customer A is 2 (1 resolved, 1 unresolved)
        ServiceCustomerReport.ServiceCountByCustomer reportA = reports[0];
        System.assertEquals(reportA.CustomerName, 'Customer A', 'The customer name should be Customer A');
        System.assertEquals(reportA.ServiceCount, 2, 'The service count for Customer A should be 2');
        System.assertEquals(reportA.ResolvedCount, 1, 'The resolved service count for Customer A should be 1');
        System.assertEquals(reportA.UnresolvedCount, 1, 'The unresolved service count for Customer A should be 1');

        // Check that the service count for Customer B is 1 (1 resolved)
        ServiceCustomerReport.ServiceCountByCustomer reportB = reports[1];
        System.assertEquals(reportB.CustomerName, 'Customer B', 'The customer name should be Customer B');
        System.assertEquals(reportB.ServiceCount, 1, 'The service count for Customer B should be 1');
        System.assertEquals(reportB.ResolvedCount, 1, 'The resolved service count for Customer B should be 1');
        System.assertEquals(reportB.UnresolvedCount, 0, 'The unresolved service count for Customer B should be 0');
    }

    // Test method for generating a summary report
    @isTest
    public static void testGenerateSummaryReport() {
        // Create test Accounts (customers)
        Account acc1 = new Account(Name = 'Customer A');
        Account acc2 = new Account(Name = 'Customer B');
        insert new List<Account>{ acc1, acc2 };

        // Create test Service Data records for the last 30 days
        Service_Data__c service1 = new Service_Data__c(
            Customer_ID__c = acc1.Id,
            Service_Date__c = Date.today().addDays(-5),
            Resolution_Status__c = 'Resolved'
        );
        Service_Data__c service2 = new Service_Data__c(
            Customer_ID__c = acc1.Id,
            Service_Date__c = Date.today().addDays(-3),
            Resolution_Status__c = 'Unresolved'
        );
        Service_Data__c service3 = new Service_Data__c(
            Customer_ID__c = acc2.Id,
            Service_Date__c = Date.today().addDays(-10),
            Resolution_Status__c = 'Resolved'
        );
        insert new List<Service_Data__c>{ service1, service2, service3 };

        // Call the method to generate a summary report
        Test.startTest();
        List<ServiceCustomerReport.ServiceCountByCustomer> summaryReport = ServiceCustomerReport.generateSummaryReport();
        Test.stopTest();

        // Validate the results with assertions
        System.assertNotEquals(summaryReport, null, 'The summary report should not be null');
        System.assertEquals(summaryReport.size(), 2, 'There should be two customers in the summary report');

        // Check the report for Customer A
        ServiceCustomerReport.ServiceCountByCustomer reportA = summaryReport[0];
        System.assertEquals(reportA.CustomerName, 'Customer A', 'The customer name should be Customer A');
        System.assertEquals(reportA.ServiceCount, 2, 'The service count for Customer A should be 2');
        System.assertEquals(reportA.ResolvedCount, 1, 'The resolved service count for Customer A should be 1');
        System.assertEquals(reportA.UnresolvedCount, 1, 'The unresolved service count for Customer A should be 1');

        // Check the report for Customer B
        ServiceCustomerReport.ServiceCountByCustomer reportB = summaryReport[1];
        System.assertEquals(reportB.CustomerName, 'Customer B', 'The customer name should be Customer B');
        System.assertEquals(reportB.ServiceCount, 1, 'The service count for Customer B should be 1');
        System.assertEquals(reportB.ResolvedCount, 1, 'The resolved service count for Customer B should be 1');
        System.assertEquals(reportB.UnresolvedCount, 0, 'The unresolved service count for Customer B should be 0');
    }

    // Test method for getting a specific customer's report
    @isTest
    public static void testGetCustomerReport() {
        // Create test Account (customer)
        Account acc1 = new Account(Name = 'Customer A');
        insert acc1;

        // Create test Service Data records for the last 30 days
        Service_Data__c service1 = new Service_Data__c(
            Customer_ID__c = acc1.Id,
            Service_Date__c = Date.today().addDays(-5),
            Resolution_Status__c = 'Resolved'
        );
        Service_Data__c service2 = new Service_Data__c(
            Customer_ID__c = acc1.Id,
            Service_Date__c = Date.today().addDays(-3),
            Resolution_Status__c = 'Unresolved'
        );
        insert new List<Service_Data__c>{ service1, service2 };

        // Call the method to get the specific customer report
        Test.startTest();
        ServiceCustomerReport.ServiceCountByCustomer customerReport = ServiceCustomerReport.getCustomerReport(acc1.Id);
        Test.stopTest();

        // Validate the results with assertions
        System.assertNotEquals(customerReport, null, 'The report for the customer should not be null');
        System.assertEquals(customerReport.CustomerName, 'Customer A', 'The customer name should be Customer A');
        System.assertEquals(customerReport.ServiceCount, 2, 'The service count for Customer A should be 2');
        System.assertEquals(customerReport.ResolvedCount, 1, 'The resolved service count for Customer A should be 1');
        System.assertEquals(customerReport.UnresolvedCount, 1, 'The unresolved service count for Customer A should be 1');
    }
}