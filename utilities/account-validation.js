//const utilities = require("/utilities/")
//const ev = require("express-validator")
const accountModel = require("../models/account-model")


const utilities = require(".")
const { body, validationResult } = require("express-validator")
const validate = {}


/*  **********************************
  *  Registration Data Validation Rules
  * ********************************* */
validate.registationRules = () =>{
    return [
                //firstname is required and must be as string 
                body("account_firstname")
                    .trim()
                    .escape() // sanitizer
                    .notEmpty()
                    .isLength({ min: 1})
                    .withMessage("Please provide a first name."),

                // lastname is required and must be string
                body("account_lastname")
                .trim()
                .escape()
                .notEmpty()
                .isLength({ min: 2 })
                .withMessage("Please provide a last name."), 

                // valid email is required and cannot already exist in the DB
                body("account_email")
                .trim()
                .escape()
                .notEmpty()
                .isEmail()
                .normalizeEmail() // refer to validator.js docs
                .withMessage("A valid email is required.")
                .custom(async (account_email) => {
                    const emailExists = await accountModel.checkExistingEmail(account_email)
                    if (emailExists) {
                        throw new Error("Email Exists. Please login or use different email")
                    }
                }),

                // password is required and must be strong password
                body("account_password")
                .trim()
                .notEmpty()
                .isStrongPassword({
                    minLength: 12,
                    minLowercase: 1,
                    minUppercase: 1,
                    minNumbers: 1,
                    minSymbols: 1,
                })
                .withMessage("Password does not meet requirements."),

            ]
}



/* ******************************
 * Check data and return errors or continue to registration
 * ***************************** */
validate.checkRegData = async (req, res, next) => {
    const { account_firstname, account_lastname, account_email } = req.body
    let errors = []
    errors = validationResult(req)
    
    if (!errors.isEmpty()) {
        console.log("######################",errors)
        let nav = await utilities.getNav()
        let registerView = await utilities.buildRegisterView()
        //console.log("$$$$$$$$$$$$$$$$$$$",req.body)
        //req.flash("notice","You have violated the check reg data rules")
        res.render("account/register", {
            errors,
            title: "Registration",
            nav,
            //registerView,
            account_firstname,
            account_lastname,
            account_email,
            
        } )
        return
    }
    next()
}

/* Rules for the login page */
validate.loginRules = () =>{
    return [
            
                // valid email is required and cannot already exist in the DB
                body("account_email")
                .trim()
                .escape()
                .notEmpty()
                .isEmail()
                .normalizeEmail() // refer to validator.js docs
                .withMessage("Email rule violation."),
            
                body("account_password")
                .trim()
                .notEmpty()
                .withMessage("Password violation."),
                // .custom(async (account_password, account_email) => {
                //     const correctCreds = await accountModel.checkCorrectCred(account_email,account_password)
                //     if(correctCreds){
                //         throw new Error("Incorrect Credentials...")
                //     }
                // }),

            ]
}




/*CHecking the login data and returning errors if any or proceeding */
validate.checkLoginData = async (req, res, next) => {
    const {account_email, account_password} = req.body
    let errors = []
    errors = validationResult(req)
    
    if(!errors.isEmpty()){
        console.log(errors,"%%%%%%%%%%%%\n",errors,"dddddd\n",req.body)
        console.log("!!!!!!!!!!!!!!!!!!!!!!!!!!")
        let nav = await utilities.getNav()
        let accountView = await utilities.buildAccountView()
       
        res.render("account/login", {
            errors,
            title: "Login",
            nav,
            accountView,
            account_email,
        })
        return
    }
    next()
}


////this is for management
// validate.addClassificationRules= () =>{

//     return [
//         body("classification_name")
//         .trim()
//         .isAlpha()
//     ]

// }
      
 module.exports = validate
