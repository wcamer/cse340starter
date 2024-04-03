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

let addToCartbutton = document.querySelector(".addToCartButton")
if (addToCartbutton){
    console.log("We have an add2Cart Button!!!!!!!!!!!!!")
    addToCartbutton.addEventListener("click",() =>{
        addToCartbutton.setAttribute("disabled", "")
        console.log("the button has been smashed")
        let inv_id = parseInt(document.querySelector("#inv_id").value)
        let year = document.querySelector("#detailYear").value
        let make = document.querySelector("#detailMake").value
        let model = document.querySelector("#detailModel").value
        let price = parseInt((document.querySelector("#detailPrice").value).replace(",",""))
        //let image = (document.querySelector("#detailImage").value).replace(" ","-")
        //let priceOnly = price.replace("$","")
        console.log(price,"33333")
        // price = price.trim()
        // price = parseInt(price)
        let tb = `/images/vehicles/` + model.replace(" ","-") + `-tn.jpg`
    
       fetch("/inv/detail/:inv_Id", {
        method: "POST", 
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({
            inv_id: inv_id,
            inv_year: year,
            inv_make: make,
            inv_model: model,
            inv_price: price,
            inv_thumbnail: tb,
        })
    }).then(response => {
        if(response.ok){
            console.log("this is the response",response)
        }else{
            console.log("no response")
        }
        

    })

        console.log("the button has been smashedddddddddddddddddddddddd")
    })
  

}else{
    console.log("NO add to cart button present")
}