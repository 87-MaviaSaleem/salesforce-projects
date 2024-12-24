trigger CampaignStatusTrigger on Campaign (after update) {
    // List to hold Campaign Members to be updated
    List<CampaignMember> membersToUpdate = new List<CampaignMember>();
    
    // Iterate through updated campaigns
    for (Campaign campaign : Trigger.new) {
        // Check if the campaign status has changed to 'Completed'
        if (campaign.Status == 'Completed' && Trigger.oldMap.get(campaign.Id).Status != 'Completed') {
            // Query Campaign Members related to the completed campaign
            List<CampaignMember> campaignMembers = [
                SELECT Id, Status 
                FROM CampaignMember 
                WHERE CampaignId = :campaign.Id
            ];
            
            // Update the status of each Campaign Member
            for (CampaignMember member : campaignMembers) {
                member.Status = 'Completed';
                membersToUpdate.add(member);
            }
        }
    }

    // Perform bulk update of Campaign Members
    if (!membersToUpdate.isEmpty()) {
        update membersToUpdate;
    }
}