const bcrypt = require("bcryptjs")
const utilities = require("../utilities/")
const accountModel = require("../models/account-model")



/* ****************************************
*  Deliver login view
* *************************************** */

async function buildLogin (req, res, next) {

    let nav = await utilities.getNav()
    const accountView = await utilities.buildAccountView()
    //console.log(accountView,"@@@@@@@@@@@@@@@")
    //req.flash("notice","sup ma buy me som dinner")
    res.render("account/login", {
        title: "Login",
        nav,
        accountView,
        errors: null,
        
        
        

    })
}

/* ****************************************
*  Deliver registration view
* *************************************** */
async function buildRegister(req, res, next) {
    let nav = await utilities.getNav()
    //const registerView = await utilities.buildRegisterView()
    //req.flash("notice","ALL FIELDS ARE REQUIRED")
    res.render("account/register", {
        title: "Register",
        nav,
        //registerView,
        errors: null,
        
    })
    
}

/* ****************************************
*  Process Registration
* *************************************** */
async function registerAccount(req,res) {
    let nav = await utilities.getNav()
    const {account_firstname, account_lastname, account_email, account_password} = req.body
    //const accountView = await utilities.buildAccountView()
    //hash the password before storing
    try{
        //regular pass and cost (salt is generated automatically) 
        hashedPassword = await bcrypt.hashSync(account_password, 10)
    }catch (error) {
        req.flash("notice", "Sorry, there was an error processing the registration.")
        res.status(500).render("account/register", {
            title: "Registration",
            nav,
            errors: null,
        })
    }

    const regResult = await accountModel.registerAccount(
        account_firstname,
        account_lastname,
        account_email,
        hashedPassword
    )
    

    
    if (regResult) {
        req.flash(
            "notice",
            `Congratulations, you\'re registered ${account_firstname}. Please log in.`
        )

        res.status(201).render("account/login", {
            title: "Login",
            nav,
            errors: null,
            //accountView,
            
        })
    }else{
        //const registerView = utilities.buildRegisterView()
        req.flash("notice", "sorry, the registration failed.")
        res.status(501).render("account/register", {
            title: "Registration",
            nav,
            errors: null,

            //registerView,
            
        })
        
    }
}

/* Process the login screen */

async function registerLogin (req, res) {
    let nav = await utilities.getNav()
    const {account_email, account_password} = req.body
    const loginView = await utilities.buildAccountView()//////////may need to be fixed
    const loginResult = await accountModel.checkCorrectCred(
        account_email,
        account_password
    )
    console.log("*******************",loginResult)
    
    if (loginResult == 1) {
        req.flash(
            "notice",
            `Congratulations, you\'re logged in.`
        )

        res.status(201).render("account/login", {
            title: "Login",
            nav,
            errors: null,
            loginView,
            
        })
    }else{
        req.flash("notice", "sorry, login failed.")
        res.status(501).render("account/login", {
            title: "Login",
            nav,
            errors: null,
            loginView,
            
        })
        
    }
}



module.exports = {buildLogin, buildRegister, registerAccount, registerLogin, }