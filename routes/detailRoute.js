//Needed resources 
const express = require("express")
const router = new express.Router()
const invController = require("../controllers/invController")
const utilities = require("../utilities/")
const validation = require("../utilities/cart-validation")
// only for the add button
const accountController = require("../controllers/accountController")
// router.post("/detail/:inv_Id", (req,res)=> {
//     console.log("the button has been decimated.")
//     console.log()
//     console.log("****/-/*-/*-/*-//**-/*-/-*/\n",res)
    
// })


router.get("/detail/:inv_Id", utilities.handleErrors(invController.buildByInv_Id));
router.post("/detail/:inv_Id",
(req, res, next) =>{
    console.log("--------- detailroute --------------------\n")
    res.locals.cartInfo.push(req.body)
    console.log(res.locals.cartInfo)
    next()
},
validation.checkCartItem,
accountController.addToCart)
// router.post("/detail/:inv_Id", (req,res)=> {
//     console.log("the button has been decimated.")
//     console.log()
//     console.log("****/-/*-/*-/*-//**-/*-/-*/\n",res)
    
// })

module.exports = router;
 


// router.get("/type/:classificationId", invController.buildByClassificationId);

// module.exports = router;