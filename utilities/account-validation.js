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
    //console.log("######################",errors.errors[1]["msg"])
    if (!errors.isEmpty()) {
        let nav = await utilities.getNav()
        let registerView = await utilities.buildRegisterView()
        console.log("$$$$$$$$$$$$$$$$$$$",req.body)
        res.render("account/register", {
            
            errors,
            title: "Registration",
            nav,
            registerView,
            account_firstname,
            account_lastname,
            account_email,
            
        } )
        return
    }
    next()
}
      
 module.exports = validate
