public with sharing class AnalyticsController {
    @AuraEnabled(cacheable=true)
    public static Map<String, Object> fetchAnalyticsData(String reportId, Integer pageNumber, Integer pageSize) {
        try {
            // Simulate fetching analytics data
            List<Map<String, Object>> analyticsData = new List<Map<String, Object>>();
            Integer totalRecords = 50; // Example total records count
            
            // Calculate offset
            Integer offset = (pageNumber - 1) * pageSize;

            // Example data; replace with actual SOQL or logic
            for (Integer i = offset; i < Math.min(offset + pageSize, totalRecords); i++) {
                analyticsData.add(new Map<String, Object>{
                    'Id' => String.valueOf(i),
                    'Name' => 'Metric ' + i,
                    'Value' => i * 10,
                    'Date' => Date.today().addDays(-i) // Example date field
                });
            }
            
            // Prepare the response
            Map<String, Object> response = new Map<String, Object>();
            response.put('records', analyticsData);
            response.put('isLastPage', (offset + pageSize) >= totalRecords);
            
            return response;
        } catch (Exception e) {
            throw new AuraHandledException('Error fetching analytics data: ' + e.getMessage());
        }
    }
}