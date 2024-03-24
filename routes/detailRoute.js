//Needed resources 
const express = require("express")
const router = new express.Router()
const invController = require("../controllers/invController")


router.get("/detail/:inv_Id", invController.buildByInv_Id);

module.exports = router;
 


// router.get("/type/:classificationId", invController.buildByClassificationId);

// module.exports = router;