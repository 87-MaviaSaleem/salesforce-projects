trigger BulkLeadTrigger on Lead (after insert, after update) {

    List<Database.LeadConvert> leadsToConvert = new List<Database.LeadConvert>();


    for (Lead lead : Trigger.New) {
       
        if (lead.Status == 'Active') {
            
            if (Trigger.isInsert || 
                (Trigger.isUpdate && Trigger.oldMap.get(lead.Id).Status != 'Active')) {
                

                Database.LeadConvert leadConvert = new Database.LeadConvert();
                leadConvert.setLeadId(lead.Id);
                leadConvert.setDoNotCreateOpportunity(false); 
                leadConvert.setConvertedStatus('Qualified');
                leadConvert.setOpportunityName(lead.Company + ' Opportunity'); 
                leadsToConvert.add(leadConvert);
            }
        }
    }
  
    if (!leadsToConvert.isEmpty()) {
        List<Database.LeadConvertResult> results = Database.convertLead(leadsToConvert);
        
        for (Database.LeadConvertResult result : results) {
            if (!result.isSuccess()) {
               
            }
        }
    }
}