//const utilities = require("/utilities/")
//const ev = require("express-validator")
const accountModel = require("../models/account-model")


const utilities = require(".")
const { body, validationResult } = require("express-validator")
const validate = {}


validate.cartRules = () => {
    return [
        body("inv_id")
        .notEmpty()
        .isNumeric(),
        
        body("inv_year")
        .notEmpty()
        .isNumeric(),

        body("inv_make")
        .trim()
        .escape() // sanitizer
        .notEmpty()
        .isLength({ min: 1})
        .withMessage("Please provide a valid vehicle 'make' name."),

        body("inv_model")
        .trim()
        .escape() // sanitizer
        .notEmpty()
        .isLength({ min: 1})
        .withMessage("Please provide a valid vehicle 'model' name."),
        
        body("inv_price")
        .notEmpty()
        .toInt()
        .isNumeric(),

        body("inv_thumbnail")
        .trim()
        .unescape()
        .notEmpty(),

        body("account_id")
        .notEmpty()
        .toInt()
        .isNumeric()
        

    ]
}

validate.checkCartItem = async (req, res, next) => {
    const {inv_id, inv_year, inv_make, inv_model, inv_price, inv_thumbnail, account_id} = req.body
    let errors = []
    errors = validationResult(req)
    if(!errors.isEmpty()) {
        console.log("-----------checkCartItem--------\nWe have a validation error")
        let nav = await utilities.getNav()
        let accountView = await utilities.buildAccountView()
        const tools = await utilities.loggedIn(res.locals)
        res.render("account/login", {
            errors,
            title: "Login",
            nav,
            tools,
            accountView,
          
        })
        return
    }else{
        next()
    }


}

      
 module.exports = validate
