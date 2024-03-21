const invModel = require("../models/inventory-model")
const Util = {}

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
    let classNameData = data[0].classification_name
    let className = classNameData.trim()
    // console.log("--------------------------------",className)
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

Util.buildAccountView = function(){
    // console.log("11111111111111111111111111111111111111111111111111111111111111111!!!!!!")
    /*create the template here*/
    let accountView = `
                        <form id=loginForm>
                            <fieldset>
                                <legend>Login Form</legend><br>
                                <label for="account_email">Email Address</label><br>
                                <input type="email" id="account_email" name="account_email" required><br><br>
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
                        <h2 id="noAccount">No Account? <a href="./register">Sign-Up</a></2>
                            

                        
    `
    return accountView

}

Util.buildRegisterView = function(){
    
    let registerView = `
                        <form id="registerForm" action="/account/register" method="post">
                            <fieldset >
                                <legend>Registration Form</legend>
                                <label for="account_firstname">First Name:</label><br>
                                <input type="text" id="account_firstname" name="account_firstname" required><br><br>
                                <label for="account_lastname">Last Name:</label><br>
                                <input type="text" id="account_lastname" name="account_lastname" required><br><br>
                                <label for="account_email">Email Address</label><br>
                                <input type="email" id="account_email" name="account_email" required><br><br>
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

/* ****************************************
 * Middleware For Handling Errors
 * Wrap other function in this for 
 * General Error Handling
 **************************************** */
Util.handleErrors = fn => (req, res, next) => Promise.resolve(fn(req,res,next)).catch(next)



module.exports = Util