import { LightningElement, track, wire } from 'lwc';
import getAvailableMovies from '@salesforce/apex/MovieTicketController.getAvailableMovies';
import bookMovieTicket from '@salesforce/apex/MovieTicketController.bookMovieTicket';
import getBookingDetails from '@salesforce/apex/MovieTicketController.getBookingDetails';
import updateBookingStatus from '@salesforce/apex/MovieTicketController.updateBookingStatus';
import cancelBooking from '@salesforce/apex/MovieTicketController.cancelBooking';

export default class MovieTicketBooking extends LightningElement {
    @track movieOptions = [];
    @track selectedMovieId = '';
    @track numberOfTickets = 1;
    @track showTime = '';
    @track bookingStatus = '';
    @track bookingDetails = null;
    @track ticketId = null;

    // Wire to fetch available movies
    @wire(getAvailableMovies)
    wiredMovies({ error, data }) {
        if (data) {
            this.movieOptions = data.map(movie => ({
                label: movie.Name,
                value: movie.Id
            }));
        } else if (error) {
            this.bookingStatus = 'Error fetching movies: ' + error.body.message;
        }
    }

    handleMovieSelection(event) {
        this.selectedMovieId = event.target.value;
    }

    handleInputChange(event) {
        const field = event.target.name;
        if (field === 'numberOfTickets') {
            this.numberOfTickets = event.target.value;
        } else if (field === 'showTime') {
            this.showTime = event.target.value;
        }
    }

    // Book the movie ticket
    handleBookTicket() {
        bookMovieTicket({
            movieId: this.selectedMovieId,
            numberOfTickets: this.numberOfTickets,
            showTime: this.showTime
        })
        .then(result => {
            this.bookingStatus = result;
            return getBookingDetails({ ticketId: this.ticketId });
        })
        .then(details => {
            this.bookingDetails = details;
        })
        .catch(error => {
            this.bookingStatus = 'Error booking ticket: ' + error.body.message;
        });
    }

    // Update booking status
    handleUpdateStatus() {
        updateBookingStatus({
            ticketId: this.ticketId,
            newStatus: 'Confirmed'
        })
        .then(result => {
            this.bookingStatus = result;
            return getBookingDetails({ ticketId: this.ticketId });
        })
        .catch(error => {
            this.bookingStatus = 'Error updating booking status: ' + error.body.message;
        });
    }

    // Cancel booking
    handleCancelBooking() {
        cancelBooking({ ticketId: this.ticketId })
        .then(result => {
            this.bookingStatus = result;
            this.bookingDetails = null; // Clear booking details after cancellation
        })
        .catch(error => {
            this.bookingStatus = 'Error canceling booking: ' + error.body.message;
        });
    }
}