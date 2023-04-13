const router = require('express').Router();
const parentController = require('../controller/parentController');
const {body} = require('express-validator');
const role = require('../middleware/RequireUser')

router.post('/find_nanny',
body('distance').isInt(),role.parent,parentController.findNanny);

module.exports = router;