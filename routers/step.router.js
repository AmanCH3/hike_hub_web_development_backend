const express = require('express')
const router = express.Router() ;
const stepController = require('../controllers/step.controller')
const { protect } = require("../middlewares/auth.middleware");


router.post('/' , protect ,  stepController.saveSteps)
router.get('/total', protect, stepController.getTotalStepsForUser);

module.exports = router ;
