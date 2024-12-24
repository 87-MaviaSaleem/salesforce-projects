public class TerritoryAssignmentHelper {
    
    // Function to send success email asynchronously
    @future
    public static void sendSuccessEmailAsync(Set<Id> userIds) {
        List<UserTerritory2Association> utaList = [SELECT Id, User.FirstName, User.LastName, Territory2.Name
                                                   FROM UserTerritory2Association
                                                   WHERE UserId IN :userIds];
        
        Messaging.SingleEmailMessage mail = new Messaging.SingleEmailMessage();
        mail.setToAddresses(new String[]{'maharshi.sfdc@gmail.com'});
        mail.setSubject('Users added to territories notification');

        List<String> msgBody = new List<String>();
        msgBody.add('The following users were added to territories:\n');
        for (UserTerritory2Association uta : utaList) {
            msgBody.add(uta.User.FirstName + ' ' + uta.User.LastName + ' to territory ' + uta.Territory2.Name + '\n');
        }
        mail.setPlainTextBody(String.join(msgBody, ''));

        try {
            Messaging.sendEmail(new Messaging.Email[] { mail });
        } catch (Exception e) {
            // Log error but no need to add to errorMessages as it's an async task
        }
    }

    // Function to send error email asynchronously
    @future
    public static void sendErrorEmailAsync(String subject, String body) {
        Messaging.SingleEmailMessage mail = new Messaging.SingleEmailMessage();
        mail.setToAddresses(new String[]{'maharshi.sfdc@gmail.com'});
        mail.setSubject(subject);
        mail.setPlainTextBody(body);
        Messaging.sendEmail(new Messaging.Email[] { mail });
    }
}