//const utilities = require("/utilities/index")
// const jwt = async function(){
//     return await require("jsonwebtoken")
// }
//require("dotenv").config()

// const jwt = require("jsonwebtoken")
// require("dotenv").config()



//when logged in
let welcome = document.createElement('a') // this will be a link to account management
welcome.innerHTML = "Welcome [insert account type here or name]"
welcome.setAttribute('title','/account-managment')
welcome.setAttribute('href','/inv')

let logout = document.createElement('a') // this will trigger a logout
logout.setAttribute('href','/account-management') ///account/account-management?



//when not logged in
let login = document.createElement('a')
login.innerHTML= "My Account"
login.setAttribute('title','Click to login')
login.setAttribute('href','/account/login')




//container for the login/logout
let tools = document.querySelector("#tools")
//tools.removeChild()

let cookie = document.cookie;

console.log("!!!!!!!!!!!!",cookie)