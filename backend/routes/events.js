const express = require('express')
const eventsController = require('../controllers/eventsController');
const ticketsController = require('../controllers/ticketsController');

const router = express.Router()

router.post('/addVenue', eventsController.addVenue);
router.post('/addEvent', eventsController.addEvent);

router.get('/getVenues', eventsController.getAllVenues);
router.get('/getEvents', eventsController.getAllEvents);

router.get('/getEvent/:eventId', eventsController.getOneEvent);
router.get('/getVenue/:venueId', eventsController.getOneVenue);

router.delete('/deleteEvent/:eventId', eventsController.deleteOneEvent);
router.delete('/deleteVenue/:venueId', eventsController.deleteOneVenue);

// router.post('/purchaseTicket', ticketsController.purchaseTicket);
router.post('/createBooking', ticketsController.createBooking);
router.post('/createTickets', ticketsController.createTickets);
router.post('/createBookingDetails', ticketsController.createBookingDetails);
router.post('/updateAvailableTickets', ticketsController.updateAvailableTickets);
router.post('/createPayment', ticketsController.createPayment);

module.exports = router