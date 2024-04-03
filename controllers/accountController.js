const bcrypt = require("bcryptjs")
const utilities = require("../utilities/")
const accountModel = require("../models/account-model")
const cartModel = require("../models/cart-model")
const jwt = require("jsonwebtoken")
require("dotenv").config()



/* ****************************************
*  Deliver login view
* *************************************** */

async function buildLogin (req, res, next) {

    let nav = await utilities.getNav()
    const tools = await utilities.loggedIn(res.locals)
    const accountView = await utilities.buildAccountView()
    //console.log(accountView,"@@@@@@@@@@@@@@@")
    //req.flash("notice","sup ma buy me som dinner")
    res.render("account/login", {
        title: "Login",
        nav,
        tools,
        accountView,
        errors: null,
        
        
        

    })
}

/* ****************************************
*  Deliver registration view
* *************************************** */
async function buildRegister(req, res, next) {
    let nav = await utilities.getNav()
    const tools = await utilities.loggedIn(res.locals)

    //const registerView = await utilities.buildRegisterView()
    //req.flash("notice","ALL FIELDS ARE REQUIRED")
    res.render("account/register", {
        title: "Register",
        nav,
        tools,
        //registerView,
        errors: null,
        
    })
    
}

/* ****************************************
*  Process Registration
* *************************************** */
async function registerAccount(req,res) {
    let nav = await utilities.getNav()
    const tools = await utilities.loggedIn(res.locals)
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
            tools,
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
            tools,
            errors: null,
            //accountView,
            
        })
    }else{
        //const registerView = utilities.buildRegisterView()
        req.flash("notice", "sorry, the registration failed.")
        res.status(501).render("account/register", {
            title: "Registration",
            nav,
            tools,
            errors: null,

            //registerView,
            
        })
        
    }
}

/* Process the login screen */
//// Personal note" this function is being retired due to directions in week 5
async function registerLogin (req, res) {
    let nav = await utilities.getNav()
    const tools = await utilities.loggedIn(res.locals)
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
            tools,
            errors: null,
            loginView,
            
        })
    }else{
        req.flash("notice", "sorry, Login failed.")
        res.status(501).render("account/login", {
            title: "Login",
            nav,
            tools,
            errors: null,
            loginView,
            
        })
        
    }
}


async function accountLogin(req,res) {
    let nav = await utilities.getNav()
    const tools = await utilities.loggedIn(res.locals)
    const {account_email, account_password} = req.body
    console.log("$$$$$$$$$",account_email,account_password)
   let accountData = await accountModel.getAccountByEmail(account_email)
    //console.log("##########################123123",accountData,"\n now looking at the checkjwttoken\n",await utilities.checkJWTToken)
    // if(accountData == "Error: No matching email found" ) { // this needs to be a better condition
    if(!accountData ) {
    let accountView = await utilities.buildAccountView()
        console.log("^^^^^^^^^^^^^^^")
        req.flash("notice", "Please check your credentials and try again.")
        res.status(400).render("account/login", {
            title: "Login",
            nav,
            tools,
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
            //JWT is being created with "accountData" and .env.ACCESS_TOKEN... and has a set time for  1hour or 3600 seconds
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
                tools,
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
    const tools = await utilities.loggedIn(res.locals)
    let loggedInView = await utilities.buildLoggedInView(res.locals)
    console.log(loggedInView)
    res.render("account/account-management",{
        title: "Account Management",
        nav,
        tools,
        loggedInView,
        errors: null,
    })
    return

}

//initial view for account update 
async function buildAccountUpdate(req, res){
    let nav = await utilities.getNav()
    const tools = await utilities.loggedIn(res.locals)
    console.log("------------------------build account update ----------------------\n",res.locals)
    res.render("account/update", {
        title: "Update Account Information",
        nav,
        tools,
        errors: null,
        account_firstname: res.locals.accountData.account_firstname,
        account_lastname: res.locals.accountData.account_lastname,
        account_email: res.locals.accountData.account_email,
        account_id: res.locals.accountData.account_id,
    })
}


/*Processing the account update*/
async function registerAccountUpdate(req, res) {
    let nav = await utilities.getNav()
    const {account_firstname, account_lastname, account_email, account_id} = req.body
    // res.locals.accountData.account_id = account_id
    // res.locals.accountData.account_firstname = account_firstname
    // res.locals.accountData.account_lastname = account_lastname
    // res.locals.accountData.account_email = account_email
    // let loggedInView = await utilities.buildLoggedInView(res.locals)
    console.log("------------------------registeraccountupdate----------------\n",req.body,res.locals)
    let result = await accountModel.accountInfoUpdateModel(account_firstname, account_lastname, account_email, account_id)
    //console.log("##########################123123",accountData,"\n now looking at the checkjwttoken\n",await utilities.checkJWTToken)
    // if(accountData == "Error: No matching email found" ) { // this needs to be a better condition
    console.log(result)
    if(result == 1) {
        res.locals.accountData.account_id = account_id
        res.locals.accountData.account_firstname = account_firstname
        res.locals.accountData.account_lastname = account_lastname
        res.locals.accountData.account_email = account_email
        let loggedInView = await utilities.buildLoggedInView(res.locals)
        let tools = await utilities.loggedIn(res.locals)
        console.log("$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$\n",account_firstname,account_lastname, account_id)
        req.flash("notice", `Account update successful for ${account_firstname}  ${account_lastname}`)
        //res.redirect("/account/account-management")
        res.render("account/account-management", {
            title: "Account Management",
            nav,
            tools,
            errors: null,
            loggedInView,
           

        })
        
    }else{
       
        let loggedInView = await utilities.buildLoggedInView(res.locals)
        let tools = await utilities.loggedIn(res.locals)
        console.log("^^^^^^^^^^^^^^^^^^^^^^^^")
        req.flash("notice","Something went wrong with updated the account info.  Process aborted")
        res.render("account/account-management",{
            title: "Account Management",
            nav,
            tools,
            errors: null,
            loggedInView,

            
        })

    }
}


async function registerPasswordUpdate(req,res){
    let nav = await utilities.getNav()
    let tools = await utilities.loggedIn(res.locals)
    const {account_password, account_id} = req.body
     //hash the password before storing
     try{
        //regular pass and cost (salt is generated automatically) 
        hashedPassword = await bcrypt.hashSync(account_password, 10)
    }catch (error) {
        req.flash("notice", "Sorry, there was an error processing the password update.  Process aborted")
        res.status(500).render("account/account-management", {
            title: "Account Management",
            nav,
            tools,
            errors: null,
        })
    }


    let result = await accountModel.accountPasswordUpdateModel(hashedPassword, account_id)
    //console.log("##########################123123",accountData,"\n now looking at the checkjwttoken\n",await utilities.checkJWTToken)
    // if(accountData == "Error: No matching email found" ) { // this needs to be a better condition
    
    if(result) {
        req.flash("notice", `Account update successful for ${account_firstname}  ${account_lastname}`)
        res.status(400).render("/account/account-management", {
            title: "Account Management",
            nav,
            tools,
            errors: null,
           

        })
        return
    }else{
        req.flash("notice","Something went wrong with updated the account info.  Process aborted")
        res.render("/account/account-managment",{
            title,
            nav,
            tools,
            errors: null,

            
        })

    }
}




/* erase this copy below */
async function registerAccount(req,res) {
    let nav = await utilities.getNav()
    const tools = await utilities.loggedIn(res.locals)
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
            tools,
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
            tools,
            errors: null,
            //accountView,
            
        })
    }else{
        //const registerView = utilities.buildRegisterView()
        req.flash("notice", "sorry, the registration failed.")
        res.status(501).render("account/register", {
            title: "Registration",
            nav,
            tools,
            errors: null,

            //registerView,
            
        })
        
    }
}

async function logout(req, res){
    console.log("//////////////////// logout //////////////////")
    console.log('here is req ', req.cookies)
    //console.log('Cookies: ', req.cookies)
    res.clearCookie("jwt")
    res.locals.loggedin = 0
    req.flash("notice","You are logged out")
    return res.redirect("/")

}

//build the cart page
async function buildCart(req, res){
    console.log("------------buildcart in accont controller--------------")
    console.log("res.locals...\n",res.locals.accountData)
    const nav = await utilities.getNav()
    const tools = await utilities.loggedIn(res.locals)
    console.log("before data data...")
    let data = await cartModel.getCartItems(res.locals.accountData.account_id)
    console.log("here is data...",data)
    const cart = await utilities.buildCartView(data)
    console.log("here is cart",cart)
    res.render("account/cart",{
        title: "Cart",
        nav,
        tools,
        errors: null,
        cart
    })

}
async function addToCart(req, res){
    console.log("------------add to cart in accont controller--------------")
    console.log("res.locals.cartInfo...\n",res.locals.cartInfo)
    const nav = await utilities.getNav()
    const tools = await utilities.loggedIn(res.locals)
    const ad = res.locals.accountData
    const ci = res.locals.cartInfo[0] 
    console.log("here is ci....\n",ci)
    console.log("before data is added to model...",ci.inv_id,
    ci.inv_year, 
    ci.inv_make, 
    ci.inv_model, 
    ci.inv_price, 
    ci.inv_thumbnail, 
    ad.account_id)
    let data = await cartModel.addItemToCart(ci.inv_id,
         ci.inv_year, 
         ci.inv_make, 
         ci.inv_model, 
         ci.inv_price, 
         ci.inv_thumbnail, 
         ad.account_id)
     console.log("here is data...",data)
    const cart = await utilities.buildCartView(data)
    console.log("here is cart",cart)
    res.render("account/cart",{
        title: "Cart",
        nav,
        tools,
        errors: null,
        cart
    })
}

module.exports = {buildLogin, buildRegister, registerAccount, registerLogin, accountLogin, LoggedIn, buildAccountUpdate, registerAccountUpdate, registerPasswordUpdate, logout, buildCart, addToCart}