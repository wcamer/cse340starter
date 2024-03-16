//Needed resources 
// const express = require("express")
// const router = new express.Router()
// const invController = require("../controllers/invController")
//const broke = require("../controllers/intentErrorController")

// console.log("$$$$$$$$$$$$$$$$$$$$$$$$")
// router.get("/detail/:inv_Id", broke.imGonnaBreak);

// module.exports = router;


// const express = require("express")
// const router = new express.Router()
// const invController = require("../controllers/invController")
// console.log("||||||||||||||||||||||||||||||||| it happenen")
//router.get("/detail/:inv_Id", invController.imGonnaBreak)

// router.get("/partials/footer", broke.imGonnaBreak)
//router.get("/detail/:inv_Id", invController.buildByInv_Id);
//router.get("/detail/:inv_Id, broke.imGonnaBreak")

const utilities = require("../utilities/")
const baseController = {}

baseController.buildHome = async function(req, res){
    //const nav = await utilities.getNav()
    res.render("index", {title: "Home", nav}) //homeee shows in meta data 
}

module.exports = baseController

//module.exports = router;

