//Needed resources 
//const regValidate = require("../utilities/account-validation")
const validation = require("../utilities/account-validation")
const express = require("express")
const router = new express.Router()
const utilities = require("../utilities")
const accountController = require("../controllers/accountController")

// router.get("/login", utilities.handleErrors(accountController.buildLogin));
router.get("/login", utilities.handleErrors(accountController.buildLogin));

router.get("/register", utilities.handleErrors(accountController.buildRegister))
router.get("/account-management", utilities.checkLogin, utilities.handleErrors(accountController.LoggedIn))
// router.post("/register",
//     regValidate.registationRules(),
//     regValidate.checkRegData, 
//     utilities.handleErrors(accountController.registerAccount)
// )
router.post("/register",
    validation.registationRules(),
    validation.checkRegData, 
    utilities.handleErrors(accountController.registerAccount)
)




router.post("/login",  
    validation.loginRules(),
    validation.checkLoginData,
    utilities.handleErrors(accountController.accountLogin)
    //utilities.handleErrors(accountController.registerLogin)//This part of the route is retired due to function name change in controller as of week 5
    //Below was removed as per directions of w5
    // res.status(200).send('login process')
)
// router.post("/login", validation.loginRules(), 
//     validation.checkLoginData,
//     utilities.handleErrors(accountController.registerLogin),
//     (req, res) => {
//       res.status(200).send('login process')
//     }
//   )

// router.post(
//     "/login", 
//     (req, res) => {
        
//       res.status(200).send('login process')
//     }
//   )





module.exports = router;