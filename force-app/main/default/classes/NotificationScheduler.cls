global class NotificationScheduler implements Schedulable {
    global void execute(SchedulableContext SC) {
        NotificationServiceSecond.sendNotifications();
    }
}