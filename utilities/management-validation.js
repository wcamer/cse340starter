//const utilities = require("/utilities/")
//const ev = require("express-validator")
const inventoryModel = require("../models/inventory-model")


const utilities = require(".")
const { body, validationResult } = require("express-validator")
const validate = {}

validate.addClassificationRules= () =>{

    return [
        body("classification_name")
        .trim()
        .isAlpha()
    ]

}

validate.checkNewClassificationName = async (req, res, next) =>{
    const {classification_name} = req.body
    let errors =[]
    errors = validationResult(req)
    //console.log("$$$$$$$$$req.body\n",req.body,"\nerrors\n",errors)
    if(!errors.isEmpty()) {
        let nav = await utilities.getNav()
        const tools = await utilities.loggedIn(res.locals)
        addClassFormView = await utilities.buildAddClassFormView()
        //req.flash("notice","Classification Name failed")
        res.render("inventory/add-classification", {
            title: "Add Classification",
            nav,
            tools,
            errors,
            classification_name,
            //addClassFormView
        })
        return
    }
    next()

}

validate.addInventoryRules = () => {
    return [
        
        body("inv_year")
            .trim()
            .escape()
            .isAfter("1885")
            .toInt()
            .notEmpty()
            .isLength({min: 4, max: 4})
            .withMessage("Please enter a 4 digit year after 1885"),

            body("inv_make")
            .trim()
            .escape()
            .isAlpha()
            .notEmpty()
            .withMessage("Please enter in a valid vehicle make"),

            body("inv_model")
            .trim()
            .escape()
            .notEmpty()
            .withMessage("Please enter in a valid vehicle model"),

            body("inv_description")
            .trim()
            .escape()
            .notEmpty()
            .withMessage("Please enter a vehicle description"),

            body("inv_image")
            .trim()
            .unescape()
            .notEmpty(),

            body("inv_thumbnail")
            .trim()
            .unescape()
            .notEmpty(),

            body("inv_price")
            .trim()
            .escape()
            .notEmpty()
            .isNumeric()
            .isLength({min: 1, max : 999999999})
            .withMessage("Please enter a value with no symbols between 1 and 999999999"),

            body("inv_miles")
            .trim()
            .escape()
            .notEmpty()
            .isInt()
            .withMessage("Please enter valid miles with no commas with 1 to 9999999"),

            body("inv_color")
            .trim()
            .escape()
            .isAlpha()
            .notEmpty()
            .withMessage("Please enter in a valid color"),

            body("classification_id")
            .trim()
            .notEmpty()
            .isInt()
            .withMessage("Classification Id is casuing an error")


    ]
}

/* Checking the submitted added inventory*/
validate.checkAddInventory = async (req, res, next) => {
    const {inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color,classification_id} = req.body
    let errors = []
    errors = validationResult(req)
    if(!errors.isEmpty()){
        console.log("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!",errors)
        let nav = await utilities.getNav()
        let dlist = await utilities.buildClassificationList()
        const tools = await utilities.loggedIn(res.locals)
        //let  addInventoryView = await utilities.buildAddInventoryView(dlist)
        res.render("inventory/add-inventory", {
            title: "Add Inventory",
            nav,
            errors:null,
            droplist: dlist,
            //addInventoryView,
            inv_year,
            inv_make, 
            inv_model, 
            inv_description, 
            inv_image, 
            inv_thumbnail, 
            inv_price, 
            inv_miles, 
            inv_color,
            classification_id,
            tools,
            
        })
        return
    }
    next()
}
   
   

//Below are the validation rules for the account section but are here only for reference






/*  **********************************
  *  Registration Data Validation Rules
  * ********************************* */
validate.registrationRules = () =>{
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
                    const emailExists = await inventoryModel.checkExistingEmail(account_email)
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
    console.log("######################",errors)
    if (!errors.isEmpty()) {
        let nav = await utilities.getNav()
        const tools = await utilities.loggedIn(res.locals)
        //let registerView = await utilities.buildRegisterView()
        //console.log("$$$$$$$$$$$$$$$$$$$",req.body)
        res.render("account/register", {
            
            errors,
            title: "Registration",
            nav,
            tools,
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
                .withMessage("Wrong email bro."),
            
                body("account_password")
                .trim()
                .notEmpty()
                .withMessage("Password isn't right but i will change this message.")
                .custom(async (account_password, account_email) => {
                    const correctCreds = await inventoryModel.checkCorrectCred(account_email,account_password)
                    if(correctCreds){
                        throw new Error("Incorrect Credentials...")
                    }
                }),

            ]
}




/*CHecking the login data and returning errors if any or proceeding */
validate.checkLoginData = async (req, res, next) => {
    //const {account_email, account_password} = req.body
    let errors = []
    errors = validationResult(req)
    console.log(errors,"%%%%%%%%%%%%\n",errors.error,"dddddd\n",req.body)
    if(!errors.isEmpty()){
        console.log("!!!!!!!!!!!!!!!!!!!!!!!!!!")
        let nav = await utilities.getNav()
        let accountView = await utilities.buildAccountView()
        const tools = await utilities.loggedIn(res.locals)
        res.render("account/login", {
            errors,
            title: "Login",
            nav,
            tools,
            accountView,
            account_email,
        })
        return
    }
    next()
}

/* */
validate.submitInventoryEdit = async (req, res,next) => {
    const {inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color,classification_id, inv_id} = req.body
    let errors = []
    errors = validationResult(req)
    if(!errors.isEmpty()){
        console.log("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!",errors)
        let nav = await utilities.getNav()
        let droplist = await utilities.buildClassificationList()
        const tools = await utilities.loggedIn(res.locals)
        req.flash("notice","Please correct entries and resubmit")
        res.render("inventory/edit-inventory", {
            title: "Edit " + inv_make + " " + inv_model,
            nav,
            tools,
            errors: null,
            droplist,
            inv_year,
            inv_make, 
            inv_model, 
            inv_description, 
            inv_image, 
            inv_thumbnail, 
            inv_price, 
            inv_miles, 
            inv_color,
            classification_id,
            inv_id,
            
        })
        return
    }else{
        console.log("*************************** it passed the rules")
    }

    next()
}


 module.exports = validate
