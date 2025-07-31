const express = require('express')
const eventsController = require('../controllers/eventsController');
const ticketsController = require('../controllers/ticketsController');

const router = express.Router()

router.post('/addVenue', eventsController.addVenue);
router.post('/addEvent', eventsController.addEvent);

router.put("/updateEvent/:eventId", eventsController.updateOneEvent);
router.put("/updateVenue/:venueId", eventsController.updateVenue);

router.get('/getVenues', eventsController.getAllVenues);
router.get('/getEvents', eventsController.getAllEvents);

router.get('/getEvent/:eventId', eventsController.getOneEvent);
router.get('/getVenue/:venueId', eventsController.getOneVenue);

router.delete('/deleteEvent/:eventId', eventsController.deleteOneEvent);
router.delete('/deleteVenue/:venueId', eventsController.deleteOneVenue);

router.post('/purchaseTicket', ticketsController.purchaseTicket);
router.get('/getTickets/:userId', ticketsController.getUserTickets);

router.get('/getStatistics', ticketsController.getStatistics);

module.exports = router