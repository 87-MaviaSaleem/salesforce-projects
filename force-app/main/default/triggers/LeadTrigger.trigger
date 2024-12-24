trigger LeadTrigger on Lead (before insert, before update) { 
    if (Trigger.isInsert) { 
        LeadTriggerHandler.assignLeadOwners(Trigger.new); 
    } 
    if (Trigger.isUpdate) { 
        List<Lead> leadsToProcess = new List<Lead>(); 
        for (Lead lead : Trigger.new) { 
            Lead oldLead = Trigger.oldMap.get(lead.Id); 
            if (lead.Score__c != oldLead.Score__c && lead.Score__c > 80 && lead.OwnerId == null) { 
                leadsToProcess.add(lead); 
            } 
        } 
        if (!leadsToProcess.isEmpty()) { 
            LeadTriggerHandler.assignLeadOwners(leadsToProcess); 
        } 
    } 
}