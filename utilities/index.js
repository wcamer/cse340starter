const invModel = require("../models/inventory-model")
const Util = {}
const jwt = require("jsonwebtoken")
require("dotenv").config()

/* ************************
 * Constructs the nav HTML unordered list
 ************************** */
Util.getNav = async function (req, res, next) {
    let data = await invModel.getClassifications()
    let list = "<ul>"
    // console.log(data) //this writes in the console the  results 
    list += '<li><a href="/" title="Home Page">Home</a></li>'
    data.rows.forEach((row) =>{
        list += "<li>"
        list += 
            '<a href="/inv/type/' +
            row.classification_id + //part of the link that shows what class id ex. sedans type = 5
            '" title="See our inventory of ' +
            row.classification_name +
            ' vehicles">' +
            row.classification_name +
            "</a>"
        list += "</li>"
    })
    list += "</ul>"
    return list
}


/* **************************************
* Build the classification view HTML
* ************************************ */
Util.buildClassificationGrid = async function(data){
    let grid
    console.log("--------------------------------",data)
    let classNameData = data[0].classification_name
    let className = classNameData.trim()
    console.log("--------------------------------",className)
    if(data.length > 0){
        grid= '<ul id="inv-display" class="' + className + '" >'
        data.forEach(vehicle => {
            grid += '<li>'
            grid += '<a href="../../inv/detail/'+ vehicle.inv_id
            + '" title="View ' + vehicle.inv_make + ' '+ vehicle.inv_model
            + 'details"><img src="' + vehicle.inv_thumbnail
            +'" alt="Image of '+ vehicle.inv_make + ' ' + vehicle.inv_model
            +' on CSE motors" /></a>'
            grid += '<div class="namePrice">'
            grid += '<hr />'
            grid += '<h2>'
            grid += '<a href="../../inv/detail/' + vehicle.inv_id +'" title="View '
            + vehicle.inv_make + ' ' + vehicle.inv_model + ' details">'
            + vehicle.inv_make + ' ' + vehicle.inv_model + '</a>'
            grid += '</h2>'
            grid += '<span>$'
            + new Intl.NumberFormat('en-US').format(vehicle.inv_price) + '</span>'
            grid += '</div>'  
            grid += '</li>'
        })
        grid += '</ul>'
        

    }else{
        grid += '<p class="notice">Sorry, no matching vehicles could be found.</p>'
    }
    return grid
}

//w3 step 2 part 4
Util.detailViewBuilder = async function(data){   
    let detailView
    let numberFormat = new Intl.NumberFormat("en-US")
    let year = data[0].inv_year
    let make = data[0].inv_make 
    let model = data[0].inv_model
    let description = data[0].inv_description
    let image = data[0].inv_image 
    let price = numberFormat.format(data[0].inv_price) 
    let miles = numberFormat.format(data[0].inv_miles)
    let color = data[0].inv_color
    console.log(">>>>>>>>>>>>>>>>>>>",data.length)
    
    console.log(year, make, model,"***************************************")
 
    detailView = //`<h2>${year} ${ make } ${ model } </h2> // I don't need this 
                    `<div id="detailPageBody">
                        <div id="detailImageHolder">
                            <img src="${ image }" alt="${ year } ${ make } ${model}">
                        </div>
                        <div id="detailDetails">
                            <h2>${make} ${model} Details</h2>
                            <ul>
                                <li>Price: $${price}</li>
                                <li>Description: ${description}</li>
                                <li>Color: ${color}</li>
                                <li>Miles: ${miles}</li>
                            </ul>
                        </div>
                    </div>
                    `


    return detailView

}

Util.errorViewBuilder = function(errorStatus, message){
    let errorView = `
                        <div id="errorBody">
                            <h1>${errorStatus}</h1>
                            <p>${message}</p>
                        </div>
                    `
    return errorView
}

//this might be deprecated as of w4
Util.buildAccountView = function(){
    // console.log("11111111111111111111111111111111111111111111111111111111111111111!!!!!!")
    /*create the template here*/
    let accountView = `
                        <form id=loginForm action="/account/login" method="post">
                            <fieldset>
                                <legend>Login Form</legend><br>
                                <label for="account_email">Email Address</label><br>
                                <input type="email" id="account_email" name="account_email" value="<%= local.account_email %> required><br><br>
                                <label for="account_password">Password</label><br>
                                <input type="password" id="account_password" name="account_password" required><br><br>
                            </fieldset>
                                <!-- <input type="button" value="Show Password"><br><br> -->
                            <div>
                                <p>Password must contain:</p>
                                <ul class="passReqList">
                                    <li>At least 12 characters</li>
                                    <li>At least 1 captial letter</li>
                                    <li>At least 1 number</li>
                                    <li>At least 1 special character</li>
                                </ul>
                            </div>
                            <input type="submit" value="Login" id="loginButton">
                            
                        </form>
                        <h2 id="noAccount">No Account? <a href="./register">Sign-Up</a></h2>
                            

                        
    `
    return accountView

}
//this function might be deprecated as of week 4
Util.buildRegisterView = function(){
    
    let registerView = `
                        <form id="registerForm" action="/account/register" method="post">
                            <fieldset >
                                <legend>Registration Form</legend>
                                <label for="account_firstname">First Name:</label><br>
                                <input type="text" id="account_firstname" name="account_firstname" required value="<%= local.account_firstname %>"><br><br>
                                <label for="account_lastname">Last Name:</label><br>
                                <input type="text" id="account_lastname" name="account_lastname" value="<%= local.account_lastname %>" required><br><br>
                                <label for="account_email">Email Address</label><br>
                                <input type="email" id="account_email" name="account_email" value="<%= local.account_email %> required><br><br>
                                <label for="account_password">Password</label><br>
                                <input type="password" id="account_password" name="account_password" pattern="^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\s).{12,}$" required><br><br>
                                
                            </fieldset>
                            
                            <div>
                                <p>Password must contain:</p>
                                <ul class="passReqList">
                                    <li>At least 12 characters</li>
                                    <li>At least 1 captial letter</li>
                                    <li>At least 1 number</li>
                                    <li>At least 1 special character</li>
                                </ul>
                            </div>
                            
                            <!--<input type="button" id="passShowHide" value="Show Password"><br><br>-->
                        
                            <button type="submit" value="Register" id="registerButton">Register</button>
                        
                        
                        

                        </form>
    
    `
    //// this code below toggles the show/hide password button I just dont' know where to put it
    // const passShowHideButton = document.querySelector("#passShowHide")
    // passShowHideButton.addEventListener("click", function() {
    //     const account_password = document.querySelector("#account_password")
    //     const type = account_password.getAttribute("type")
    //     if (type == "password"){
    //         account_password.setAttribute("type","text")
    //         passShowHideButton.innerHTML = "Hide Password"
    //     }
    //     else{
    //         account_password.setAttribute("type", "password")
    //         passShowHideButton.innerHTML = "Show Password"
    //     }
    // })
    return registerView
    
}
//This is for employees or admins
Util.buildManagmentView= function() {
    let manView = `
                <ul id="manViewLinks">
                    <li>
                        <a href="/inv/add-classification">Add New Classification</a>
                    </li>
                    <li>
                        <a href="/inv/add-inventory">Add New Vehicle</a>  
                    </li> 
                </ul> 
    `
    return manView
}

//Most likely will be deprecated and will erase
Util.buildAddClassFormView = function() {
    // console.log("%%%%%%%%%%%%%%%%%%%",data)
    let cFView = `
            <form id="addClassForm" action="/inv/add-classification" method="post">
            <fieldset >
                <legend>Add Clasification Form</legend>
                <label for="classification_name">Classification Name:</label><br>
                <input type="text" name="classification_name" id="classification_name" pattern="^[a-zA-Z]+$" value="<% = local.classification_name %>" required>
                <p>Classification name must not contain any special characters or spaces<p>
                <input type="submit" value="Submit Classification Name">

            </fieldset>
            </form>
    
    `
    return cFView
}

Util.buildAddInventoryView =  function(dlist) {

    //let droplist =  Util.buildClassificationList()
    //console.log("^^^^^^^^^^^^^",dlist)
    let aIV = `
                <form id="AddInventoryViewForm" action="/inv/add-inventory" method="post">

                    <fieldset>
                        <legend>New Vehicle Form</legend>
                        <p>Classification Name</p>
                    `

                    aIV+= dlist + `<br><br>
                        <label for="inv_year">Year</label><br>
                        <input type="text" name="inv_year" id="inv_year"  pattern="^[0-9]{4}$" required value="<%= local.inv_year %>"><br><br>
                        <label for="inv_make">Make</label><br>
                        <input type="text" name="inv_make" id="inv_make" required value="<%= local.inv_make %>" ><br><br>
                        
                        <label for="inv_model">Model</label><br>
                        <input type="text" name="inv_model" id="inv_model" required value="<%= local.inv_model %>" ><br><br>
                        
                        <label for="inv_description">Description</label><br>
                        <textarea name="inv_description" id="inv_description"  rows=10 cols="30" ><%= local.inv_description %>></textarea><br><br>
                        
                        <label for="inv_image">Image Path</label><br>
                        <input type="text" name="inv_image" id="inv_image" required value="/images/vehicles/no-image.png"><br><br>
                        
                        <label for="inv_thumbnail">Thumbnail Path</label><br>
                        <input type="text" name="inv_thumbnail" id="inv_thumbnail" required value="/images/vehicles/no-image-tn.png"><br><br>
                        
                        <label for="inv_price">Price</label><br>
                        <input type="text" name="inv_price" id="inv_price" pattern="^[0-9]{1,9}$" required value="<%= local.inv_price %>" ><br><br>
                       
                        <label for="inv_miles">Miles</label><br>
                        <input type="text" name="inv_miles" id="inv_miles" required pattern="^[0-9]{1,7}$" value="<%= local.inv_miles %>" ><br>
                       
                        <label for="inv_color">Color</label><br>
                        <input type="text" name="inv_color" id="inv_color" required value="<%= local.inv_color %>" ><br><br>
                       
                        <button type="submit">Submit New Vehicle</button>


                    </fieldset>




                </form>
    
    `
    return aIV
}

Util.buildClassificationList = async function (classification_id = null) {
    let data = await invModel.getClassifications()
    let classificationList =
      '<select name="classification_id" id="classificationList" required>'
    classificationList += "<option value=''>Choose a Classification</option>"
    data.rows.forEach((row) => {
      classificationList += '<option value="' + row.classification_id + '"'
      if (
        classification_id != null &&
        row.classification_id == classification_id
      ) {
        classificationList += " selected "
      }
      classificationList += ">" + row.classification_name + "</option>"
    })
    classificationList += "</select>"
    return classificationList
  }

  Util.buildLoggedInView = async function(data) {
    
    //console.log("--------------------buldloggedinview---------------\n",data)
    if(data.accountData.account_type == "Admin"  || data.accountData.account_type == "Employee"){
        return  `<div>
                    <h2>Welcome ${data.accountData.account_firstname}</h2>
                    <h3>Inventory Management</h3>
                    <a href="/inv"><p> Click here for inventory management</p></a>
                    <h3>Update Account Information</h3>
                    <a href="/account/update"><p>Click here to Update Account Information</p></a>
                    
                </div>        
    `
    }else{
         return  `
                <div>
                    <h2>Welcome ${data.accountData.account_firstname}</h2>
                    <h3>Update Account Information</h3>
                    <a href="/account/update"><p>Click here to Update Account Information</p></a>

                </div>        
            `
 
    }
      //return  view
  }


/* ****************************************
 * Middleware For Handling Errors
 * Wrap other function in this for 
 * General Error Handling
 **************************************** */
Util.handleErrors = fn => (req, res, next) => Promise.resolve(fn(req,res,next)).catch(next)




/* ****************************************
* Middleware to check token validity
**************************************** */
Util.checkJWTToken = (req,res,next) => {
    console.log("**************************Comencing the CheckJWTToken************************")
    if (req.cookies.jwt) {// all 3 components is the cookie value, with 2 components it givess the object with sessionid and jwt token
        //console.log("**********************/*/*/*/*/*/*/*****\n",req.cookies)
        jwt.verify(
            req.cookies.jwt,//token aka account data being signed in
            process.env.ACCESS_TOKEN_SECRET, //sk
            function (err, accountData){ // optional call back
                //the JWT was tampered and will be erased and will direct user to login again to get a new JWT
                if (err) {
                    req.flash("Please log in")
                    res.clearCookie("jwt")
                    return res.redirect("/account/login")
                }
                //console.log("//////////////************************//////////////////\n",accountData)
                jwt.account_type = accountData.account_type
                console.log("jwt.account_type == ",jwt.account_type)
                res.locals.accountData = accountData
                res.locals.loggedin = 1
                if(jwt.account_type == "Employee" || jwt.account_type == "Admin"){
                    console.log("authroized personel account detected....",jwt.account_type)
                    next()
                }
                else{
                    //req.flash("notice",'This is a client account')
                    //return res.redirect("/account/login")
                    next()
                }
                
            }
        )
    }
    else{
        //There wasn't a valid JWT
         //next()
        //req.flash("notice",'JWT was not valid')
                    //return res.redirect("/account/login")
                     next()
    }
}

Util.authAccount = (req, res, next) =>{
    console.log("//////////////////////// starting authAccount ////////////////")
    if(res.locals.accountData.account_type == "Employee" || res.locals.accountData.account_type == "Admin"){
        console.log("authroized personel account detected....")
        next()
    }else{
        console.log("Access to this view is restricted to personel only...")
        req.flash("notice","Access to this view is restricted...")
        res.redirect("/account/login")
    }
}

/* ****************************************
 *  Check Login
 * ************************************/
  Util.checkLogin = (req, res, next) => {
    if(res.locals.loggedin){
        console.log("///////////////////////////////||||||", res.locals)
        next()
    } else{
        req.flash("notice", "Please log in before continuing.")
        return res.redirect("/account/login")
    }
  }

//this is to change the link on the top right of the app to welcome/logout or my account
Util.loggedIn = async function (data) {

    console.log("--------------------- Util.loggedIn------------------a\n",data)
    let loggedIn = data.loggedin 

    if(loggedIn == 1){
        console.log("You are logged in")
    let tools = `
            <div id="tools">
                <span>
                <a title="Click to go to account management" href="/account/account-management" >Welcome ${data.accountData.account_firstname}</a>
                <a title="Click here to log out" href="/account/logout">Logout</a>
                </span>
            </div>
    `
        return await tools
    }else{
        console.log("you aren't logged in yet")
        let tools = `
        <div id="tools">
            
            <a title="Click to go to login" href="/account/login" >My Account</a>
            
        </div>
`
        return tools
    }

    // if(res.locals.loggedin){
    //     console.log("!!!!!!!!!!!!!!!!!!!!!!!!------------------",res.locals.accountData.account_type)

        
        
    //     //  //when logged in
    //     // let welcome = document.createElement('a') // this will be a link to account management
    //     // welcome.innerHTML = `Welcome ${accountData.account_firstname}`
    //     // welcome.setAttribute('title','Click to go to Account Management')
    //     // welcome.setAttribute('href','/account-management')

    //     // let logout = document.createElement('a') // this will trigger a logout
    //     // logout.setAttribute('title','Click to logout')
    //     // logout.setAttribute('href','/account-management') ///account/account-management?

    //     // let span = document.createElement('span')
    //     // span.appendChild(welcome, logout)
    //     // console.log(span)

    //     // //container for the login/logout
    //     // let tools = document.querySelector("#tools")
    //     // //tools.removeChild()

       
    //     next()
    // } else{
    //     console.log("???????????????????????????????????\nno one is logged in")
    //     //  //when not logged in
    //     //  let login = document.createElement('a')
    //     //  login.innerHTML= "My Account"
    //     //  login.setAttribute('title','Click to login')
    //     //  login.setAttribute('href','/account/login')

    //     //  //container for the login/logout
    //     // let tools = document.querySelector("#tools")
    //     //tools.removeChild()

    //    next()
    //     // req.flash("notice", "Please log in before continuing.")
    //     // return res.redirect("/account/login")
    // }
}

Util.buildTools = () => {
    let tools = `
            <div id="tools">
                
                <a title="Click to go to login" href="/account/login" >My Account</a>
                
            </div>
    `
    return tools

}

module.exports = Util