//Needed resources 
const validation = require("../utilities/management-validation")
const express = require("express")
const router = new express.Router()
const invController = require("../controllers/invController")

const utilities = require("../utilities/index")
const manController = require("../controllers/managementController")


router.get("/type/:classificationId", invController.buildByClassificationId);
//this is to get into inventory management initial view
router.get("/", utilities.checkJWTToken, utilities.authAccount, utilities.handleErrors(invController.buildManagement))
//add classification initial view
router.get("/add-classification",utilities.checkJWTToken, utilities.authAccount, utilities.handleErrors(invController.buildAddClassForm))
//add new vehicle initial view
router.get("/add-inventory",utilities.checkJWTToken, utilities.authAccount, utilities.handleErrors(invController.buildAddInventory))
//
router.get("/getInventory/:classification_id", utilities.handleErrors(invController.getInventoryJSON))
//initial view for inventory edit
router.get("/edit-inventory/:inv_id", utilities.checkJWTToken, utilities.authAccount, utilities.handleErrors(invController.buildInventoryEdit))
//intital view for delete-inventory
router.get("/delete-confirm/:inv_id",utilities.checkJWTToken, utilities.authAccount, utilities.handleErrors(invController.buildDeleteInv))


//route to handle when the edit-inventory page is submitted
router.post("/edit-inventory",
validation.addInventoryRules(),
validation.submitInventoryEdit, 
utilities.handleErrors(invController.registerInventoryEdit))

// new classification submission
router.post("/add-classification",
validation.addClassificationRules(),
validation.checkNewClassificationName, 
utilities.handleErrors(invController.registerAddClassForm))

// new vehicle submission
router.post("/add-inventory", 
validation.addInventoryRules(),
validation.checkAddInventory,
utilities.handleErrors(invController.registerAddNewInventory)
)


//processes the deletion of inventory after confirming 
router.post("/delete-confirm",
utilities.handleErrors(invController.registerDeleteInv))


// router.post("/type/:classificationId", (req,res)=> {
//     console.log("the button has been hit.")

// })

module.exports = router;