//Needed resources 
//const regValidate = require("../utilities/account-validation")
const validation = require("../utilities/account-validation")
const express = require("express")
const router = new express.Router()
const utilities = require("../utilities")
const accountController = require("../controllers/accountController")

// router.get("/login", utilities.handleErrors(accountController.buildLogin));
router.get("/login",utilities.handleErrors(accountController.buildLogin));

router.get("/register", utilities.handleErrors(accountController.buildRegister))
router.get("/account-management", utilities.checkLogin, utilities.handleErrors(accountController.LoggedIn))
//route for the initial view of update account information
router.get("/update",utilities.handleErrors(accountController.buildAccountUpdate))
router.get("/logout",utilities.handleErrors(accountController.logout))
router.get("/cart",utilities.handleErrors(accountController.buildCart))
// router.post("/update/accountUpdate", (req, res) =>  {//utilities.handleErrors(accountController.buildRegister))

//     console.log("***************************account routes********************\n",res.locals)

//     // validation.accountInfoUpdateRules(),
//     // validation.processAccountInfoUpdate,
// })


router.post("/update/accountUpdate",  //utilities.handleErrors(accountController.buildRegister))
    validation.accountInfoUpdateRules(),
    validation.processAccountInfoUpdate,
    utilities.handleErrors(accountController.registerAccountUpdate)
)

router.post("/update/passwordUpdate",  //utilities.handleErrors(accountController.buildRegister))
    validation.accountInfoUpdateRules(),
    validation.processAccountInfoUpdate,
    utilities.handleErrors(accountController.registerAccountUpdate)
)

//utilities.handleErrors(accountController.registerAccountUpdate))
//router.post("/update",utilities.handleErrors(accountController.buildLogin))


// router.post("/register",
//     regValidate.registrationRules(),
//     regValidate.checkRegData, 
//     utilities.handleErrors(accountController.registerAccount)
// )
router.post("/register",
    validation.registrationRules(),
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