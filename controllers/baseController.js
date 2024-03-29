const utilities = require("../utilities/")
const baseController = {}

baseController.buildHome = async function(req, res){
    const nav = await utilities.getNav()
    const tools = await utilities.loggedIn(res.locals)
    
    console.log("**************i am in the base controller**************",req.cookies.jwt,"\n*******res.locals.loggedin******\n",res.locals.loggedin)
    //let tools = await utilities.checkForLoggedIn()
    console.log("---------------------- here is tools in the base controller --------------------\n",tools)
    // req.flash("notice", "this is a flash message.")
    // if(res.locals.loggedin == 1){
    //     console.log("coooooooooooooool")
    //     let tools = await utilities.loggedIn(res.locals)
    //     console.log("/*-/*-/*-/*-/*-",tools)
    //     res.render("index", {
    //         title: "Home",
    //         nav,
    //         tools: tools,
    //         }) //homeee shows in meta data 
    // }else{
    //     let tools = await utilities.buildTools()
    //     console.log("nooooooooooooooooooo",tools)
    //     res.render("index", {
    //         title: "Home",
    //         nav,
    //         tools: tools,
    //         }) //homeee shows in meta data 
    // }
    
    res.render("index", {
        title: "Home",
        nav,
        tools,
        }) //homeee shows in meta data 
}

module.exports = baseController

