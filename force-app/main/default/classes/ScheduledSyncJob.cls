global class ScheduledSyncJob implements Schedulable {
    global void execute(SchedulableContext SC) {
        IntegrationService.syncInventory();
    }
}