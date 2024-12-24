trigger maintainTerritoryCount on Territory2 (after insert, after delete) {
    // Track the delta for each model
    Map<Id, Integer> modelMap = new Map<Id, Integer>();

    // Handle insertions and deletions of territories
    for (Territory2 terr : (Trigger.isInsert ? Trigger.new : Trigger.old)) {
        Integer offset = 0;
        if (modelMap.containsKey(terr.Territory2ModelId)) {
            offset = modelMap.get(terr.Territory2ModelId);
        }
        offset += (Trigger.isInsert ? 1 : -1);
        modelMap.put(terr.Territory2ModelId, offset);
    }

    // Update the Territory_Count__c field on Territory2Model
    List<Territory2Model> models = [SELECT Id, Territory_Count__c FROM Territory2Model WHERE Id IN :modelMap.keySet()];
    for (Territory2Model tm : models) {
        if (tm.Territory_Count__c == null) {
            tm.Territory_Count__c = 0;
        }
        tm.Territory_Count__c += modelMap.get(tm.Id);
    }

    // Bulk update the affected models
    update models;
}