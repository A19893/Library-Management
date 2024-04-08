const { users_controller } = require('../controllers');

const router = require('express').Router();

router.post('/', users_controller.create_user);
router.post('/login', users_controller.login_user);

module.exports = router;