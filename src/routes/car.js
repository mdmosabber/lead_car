const router = require('express').Router();
const carController = require('../controllers/car');

router.get('/cars', carController.index);
router.post('/car', carController.store);
router.put('/car/:id', carController.update);
router.delete('/car/:id', carController.destroy)


module.exports = router;