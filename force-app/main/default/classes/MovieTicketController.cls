public with sharing class MovieTicketController {

    // Fetch available movies
    @AuraEnabled(cacheable=true)
    public static List<Movie__c> getAvailableMovies() {
        try {
            return [SELECT Id, Name, Release_Date__c, Duration__c FROM Movie__c];
        } catch (Exception e) {
            throw new AuraHandledException('Error fetching available movies: ' + e.getMessage());
        }
    }

    // Book movie tickets with validation and confirmation
    @AuraEnabled
    public static String bookMovieTicket(Id movieId, Integer numberOfTickets, Datetime showTime) {
        try {
            // Check if the showtime is available
            Movie__c selectedMovie = [SELECT Id, Name, Show_Times__c FROM Movie__c WHERE Id = :movieId LIMIT 1];
            
            if (selectedMovie.Show_Times__c != showTime) {
                throw new AuraHandledException('The selected showtime is unavailable.');
            }

            Movie_Ticket__c newTicket = new Movie_Ticket__c(
                Movie__c = movieId,
                Number_of_Tickets__c = numberOfTickets,
                Show_Time__c = showTime,
                Status__c = 'Pending' // Default status is Pending
            );

            insert newTicket;
            return 'Booking successful! Your tickets are pending confirmation.';
        } catch (Exception e) {
            throw new AuraHandledException('Error booking ticket: ' + e.getMessage());
        }
    }

    // Fetch booking details for a ticket
    @AuraEnabled(cacheable=true)
    public static Movie_Ticket__c getBookingDetails(Id ticketId) {
        try {
            return [SELECT Id, Movie__r.Name, Number_of_Tickets__c, Show_Time__c, Status__c
                    FROM Movie_Ticket__c WHERE Id = :ticketId LIMIT 1];
        } catch (Exception e) {
            throw new AuraHandledException('Error fetching booking details: ' + e.getMessage());
        }
    }

    // Update booking status
    @AuraEnabled
    public static String updateBookingStatus(Id ticketId, String newStatus) {
        try {
            Movie_Ticket__c ticket = [SELECT Id, Status__c FROM Movie_Ticket__c WHERE Id = :ticketId LIMIT 1];
            
            // Ensure only "Pending" bookings can be updated
            if (ticket.Status__c != 'Pending') {
                throw new AuraHandledException('Cannot update a confirmed booking.');
            }

            ticket.Status__c = newStatus; // Set new status
            update ticket; // Update ticket record

            return 'Booking status updated to ' + newStatus + ' successfully.';
        } catch (Exception e) {
            throw new AuraHandledException('Error updating booking status: ' + e.getMessage());
        }
    }

    // Cancel booking
    @AuraEnabled
    public static String cancelBooking(Id ticketId) {
        try {
            Movie_Ticket__c ticket = [SELECT Id, Status__c FROM Movie_Ticket__c WHERE Id = :ticketId LIMIT 1];

            // Ensure only "Pending" bookings can be canceled
            if (ticket.Status__c != 'Pending') {
                throw new AuraHandledException('Cannot cancel a confirmed booking.');
            }

            delete ticket; // Delete the ticket record
            return 'Booking canceled successfully.';
        } catch (Exception e) {
            throw new AuraHandledException('Error canceling booking: ' + e.getMessage());
        }
    }
}