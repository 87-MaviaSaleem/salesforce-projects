public with sharing class ShipmentController1 {

    /**
     * Fetches all shipments from the Shipment__c object, ordered by creation date.
     * Uses caching for improved performance with frequently accessed data.
     *
     * @return List<Shipment__c> - A list of shipments sorted by CreatedDate.
     */
    @AuraEnabled(cacheable=true)
    public static List<Shipment__c> getShipments() {
        return [SELECT Id, Shipment_Tracking_Number__c, Delivery_Address__c, 
                       Expected_Delivery_Date__c, Status__c, LastModifiedDate
                FROM Shipment__c 
                ORDER BY CreatedDate DESC];
    }

    /**
     * Fetches detailed information for a single shipment based on its Id.
     * Uses caching to optimize repeated requests for the same data.
     *
     * @param shipmentId Id - The Id of the shipment to retrieve.
     * @return Shipment__c - The shipment record with all requested fields.
     * @throws AuraHandledException - If the shipment cannot be retrieved.
     */
    @AuraEnabled(cacheable=true)
    public static Shipment__c getShipmentDetails(Id shipmentId) {
        try {
            return [SELECT Id, Shipment_Tracking_Number__c, Delivery_Address__c, 
                           Expected_Delivery_Date__c, Status__c, 
                           CreatedDate, LastModifiedDate
                    FROM Shipment__c 
                    WHERE Id = :shipmentId];
        } catch (Exception e) {
            throw new AuraHandledException('Failed to fetch shipment details: ' + e.getMessage());
        }
    }

    /**
     * Fetches shipments filtered by their status. If the status is 'All', returns all shipments.
     * 
     * @param status String - The shipment status to filter by (e.g., "Pending", "Delivered").
     * @return List<Shipment__c> - A list of filtered shipments.
     * @throws AuraHandledException - If an error occurs while retrieving the data.
     */
    @AuraEnabled(cacheable=true)
    public static List<Shipment__c> getShipmentsByStatus(String status) {
        try {
            if (status == 'All') {
                return getShipments(); // Return all shipments
            }
            return [SELECT Id, Shipment_Tracking_Number__c, Delivery_Address__c, 
                           Expected_Delivery_Date__c, Status__c, LastModifiedDate
                    FROM Shipment__c 
                    WHERE Status__c = :status
                    ORDER BY CreatedDate DESC];
        } catch (Exception e) {
            throw new AuraHandledException('Failed to fetch filtered shipments: ' + e.getMessage());
        }
    }

    /**
     * Adds a new shipment record to the database.
     * 
     * @param trackingNumber String - The tracking number for the new shipment.
     * @param deliveryAddress String - The delivery address for the new shipment.
     * @param expectedDeliveryDate Date - The expected delivery date for the shipment.
     * @return String - A success message confirming the shipment was added.
     */
    @AuraEnabled
    public static String addShipment(String trackingNumber, String deliveryAddress, Date expectedDeliveryDate) {
        Shipment__c newShipment = new Shipment__c(
            Shipment_Tracking_Number__c = trackingNumber,
            Delivery_Address__c = deliveryAddress,
            Expected_Delivery_Date__c = expectedDeliveryDate,
            Status__c = 'Pending' // Default status for new shipments
        );
        insert newShipment; // Insert into Salesforce
        return 'Shipment added successfully.';
    }

    /**
     * Updates the status of a shipment record using optimistic locking.
     * Ensures that the record has not been modified by another user since it was last accessed.
     * 
     * @param shipmentId Id - The Id of the shipment to update.
     * @param status String - The new status to set for the shipment.
     * @param lastModifiedDate Datetime - The LastModifiedDate of the shipment (for locking).
     * @return String - A success or error message.
     */
    @AuraEnabled
    public static String updateShipmentStatusWithLocking(Id shipmentId, String status, Datetime lastModifiedDate) {
        try {
            // Query the shipment record with LastModifiedDate for optimistic locking
            Shipment__c shipment = [SELECT Id, Status__c, LastModifiedDate 
                                    FROM Shipment__c 
                                    WHERE Id = :shipmentId 
                                    AND LastModifiedDate = :lastModifiedDate
                                    LIMIT 1];

            shipment.Status__c = status; // Update the status field
            update shipment; // Save the changes
            return 'Shipment status updated successfully.';
        } catch (QueryException e) {
            // Handle the case where the record was modified by another user
            return 'Shipment update failed: The record was modified by another user.';
        }
    }
}