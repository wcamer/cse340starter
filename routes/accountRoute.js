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




router.post("/login",  (req,res) =>{ 
    console.log("@@@@@@@@@@@@@@@@@@",req.body)
    validation.loginRules()
    validation.checkLoginData(req)
    utilities.handleErrors(accountController.registerLogin)
    res.status(200).send('login process')
})
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