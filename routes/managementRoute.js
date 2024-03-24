//Needed resources 
const express = require("express")
const utilities = require("../utilities/index")
const router = new express.Router()
const manController = require("../controllers/managementController")


// router.get("/type/:classificationId", invController.buildByClassificationId);

//route to managment
router.get("/management", utilities.handleErrors(manController.buildManagement))
module.exports = router;