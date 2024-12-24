global class FundraisingInsightsScheduler implements Schedulable {
    global void execute(SchedulableContext ctx) {
        // Query active campaigns
        List<Campaign> activeCampaigns = [SELECT Id FROM Campaign WHERE IsActive = TRUE];

        for (Campaign campaign : activeCampaigns) {
            FundraisingService.fetchAndStoreInsights(campaign.Id);
        }
    }
}