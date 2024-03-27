//Needed resources 
const validation = require("../utilities/management-validation")
const express = require("express")
const router = new express.Router()
const invController = require("../controllers/invController")

const utilities = require("../utilities/index")
const manController = require("../controllers/managementController")


router.get("/type/:classificationId", invController.buildByClassificationId);
router.get("/management", utilities.handleErrors(invController.buildManagement))
router.get("/add-classification",utilities.handleErrors(invController.buildAddClassForm))
router.get("/add-inventory",utilities.handleErrors(invController.buildAddInventory))
router.get("/getInventory/:classification_id", utilities.handleErrors(invController.getInventoryJSON))
//initial view for inventory edit
router.get("/edit-inventory/:inv_id", utilities.handleErrors(invController.buildInventoryEdit))
//route to handle when the edit-inventory page is submitted
router.post("/edit-inventory",
validation.addInventoryRules(),
validation.submitInventoryEdit, 
utilities.handleErrors(invController.registerInventoryEdit))


router.post("/add-classification",
validation.addClassificationRules(),
validation.checkNewClassificationName, 
utilities.handleErrors(invController.registerAddClassForm))

router.post("/add-inventory", 
validation.addInventoryRules(),
validation.checkAddInventory,
utilities.handleErrors(invController.registerAddNewInventory)
)

module.exports = router;