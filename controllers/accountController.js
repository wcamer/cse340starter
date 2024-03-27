const bcrypt = require("bcryptjs")
const utilities = require("../utilities/")
const accountModel = require("../models/account-model")
const jwt = require("jsonwebtoken")
require("dotenv").config()



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
//// Personal note" this function is being retired due to directions in week 5
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
        req.flash("notice", "sorry, Login failed.")
        res.status(501).render("account/login", {
            title: "Login",
            nav,
            errors: null,
            loginView,
            
        })
        
    }
}


async function accountLogin(req,res) {
    let nav = await utilities.getNav()
    const {account_email, account_password} = req.body
    console.log("$$$$$$$$$",account_email,account_password)
   let accountData = await accountModel.getAccountByEmail(account_email)
    console.log("##########################123123",accountData,)
    // if(accountData == "Error: No matching email found" ) { // this needs to be a better condition
    if(!accountData ) {
    let accountView = await utilities.buildAccountView()
        console.log("^^^^^^^^^^^^^^^")
        req.flash("notice", "Please check your credentials and try again.")
        res.status(400).render("account/login", {
            title: "Login",
            nav,
            errors: null,
            accountView,
            account_email,

        })
        return
    }
    try {
        console.log("&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&")
        if (await bcrypt.compare(account_password, accountData.account_password)){
            console.log("%%%%%%%%%%%%%%%%%%%%%%%%%%%")
            delete accountData.account_password
            console.log("/*-/*-/*-/*-/*-")
            const accessToken = jwt.sign(accountData, process.env.ACCESS_TOKEN_SECRET, {expiresIn: 3600})
            console.log(accessToken)
            if(process.env.NODE_ENV === 'development'){
                console.log("********************** we are in dev mode")
                res.cookie("jwt", accessToken, {httpOnly: true, maxAge: 3600 * 1000})
            } 
            else {
                console.log("-------------------------------not in dev mode")
                res.cookie("jwt", accessToken, {httpOnly: true, secure: true, maxAge: 3600 * 1000})
            }
            return res.redirect("/account/account-management")
        }else{
            console.log("The password is wrong")
            let accountView = await utilities.buildAccountView()
            req.flash("notice","Please check your password or email*")
            res.status(400).render("account/login",{
                title: "Login",
                nav,
                accountView,
                account_email,
                errors: null,

            })
        }
    } catch (error){
            return new Error('Access Forbidden')
    }
}

async function LoggedIn(req, res) {
    let nav =  await utilities.getNav()
    let loggedInView = await utilities.buildLoggedInView()
    console.log(loggedInView)
    res.render("account/account-management",{
        title: "Account Management",
        nav,
        loggedInView,
        errors: null,
    })
    return

}



module.exports = {buildLogin, buildRegister, registerAccount, registerLogin, accountLogin, LoggedIn}