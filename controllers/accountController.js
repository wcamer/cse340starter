const utilities = require("../utilities/")
const accountModel = require("../models/account-model")



/* ****************************************
*  Deliver login view
* *************************************** */

async function buildLogin (req, res, next) {

    let nav = await utilities.getNav()
    const accountView = await utilities.buildAccountView()
    //console.log(accountView,"@@@@@@@@@@@@@@@")
    res.render("account/login", {
        title: "Login",
        nav,
        accountView,
        

    })
}

async function buildRegister(req, res, next) {
    let nav = await utilities.getNav()
    const registerView = await utilities.buildRegisterView()
    

    req.flash("notice","ALL FIELDS ARE REQUIRED")
    res.render("account/register", {
        title: "Register",
        nav,
        registerView,
        errors: null,
        
    })
    
}

/* ****************************************
*  Process Registration
* *************************************** */
async function registerAccount(req,res) {
    let nav = await utilities.getNav()
    const {account_firstname, account_lastname, account_email, account_password} = req.body
    const accountView = await utilities.buildAccountView()
    const regResult = await accountModel.registerAccount(
        account_firstname,
        account_lastname,
        account_email,
        account_password
    )
    
    if (regResult) {
        req.flash(
            "notice",
            `Congratulations, you\'re registered ${account_firstname}. Please log in.`
        )

        res.status(201).render("account/login", {
            title: "Login",
            nav,
            accountView,
            
        })
    }else{
        req.flash("notice", "sorry, the registration failed.")
        res.status(501).render("account/register", {
            title: "Registration",
            nav,
            accountView,
            
        })
        
    }
}

module.exports = {buildLogin, buildRegister, registerAccount}