const router = require('express').Router();
const authVerify = require('../middleware/auth')
const authController = require('../controllers/auth');


router.get('/',authController.index);
router.post('/register',authController.register);
router.post('/login',authController.login);
router.get('/logout',authController.logOut);

router.get('/profile',authVerify,authController.viewProfile);
router.patch('/update-profile',authVerify,authController.updateProfile);


module.exports = router;