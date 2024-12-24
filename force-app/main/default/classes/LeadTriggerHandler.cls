public with sharing class LeadTriggerHandler { 
    public static void assignLeadOwners(List<Lead> leadList) { 
        Map<String, Id> industryToOwnerMap = new Map<String, Id>(); 
        for (Industry_Owner_Mapping__mdt mapping : 
            [SELECT Industry__c , Owner__c  FROM Industry_Owner_Mapping__mdt]) { 
            industryToOwnerMap.put(mapping.Industry__c , mapping.Owner__c ); 
        } 
        for (Lead lead : leadList) { 
            if (industryToOwnerMap.containsKey(lead.Industry )) { 
                lead.OwnerId  = industryToOwnerMap.get(lead.Industry); 
            } else { 
                System.debug('No owner found for industry: ' + lead.Industry); 
            } 
        } 
    } 
}