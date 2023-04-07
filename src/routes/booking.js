const router = require('express').Router();
const bookingController = require('../controllers/booking');

router.get('/bookings', bookingController.index);
router.post('/car/book', bookingController.store);


module.exports = router;