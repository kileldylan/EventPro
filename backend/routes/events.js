const express = require('express')
const eventsController = require('../controllers/eventsController');

const router = express.Router()

router.post('/addVenue', eventsController.addVenue);
router.get('/getVenues', eventsController.getAllVenues);
router.post('/addEvent', eventsController.addEvent);
router.get('/getEvents', eventsController.getAllEvents);
router.delete('/deleteEvent/:eventId', eventsController.deleteOneEvent);
router.delete('/deleteVenue/:venueId', eventsController.deleteOneVenue);

module.exports = router