

const utilities = require("../utilities/")
const baseController = {}

baseController.buildHome = async function(req, res){
    //const nav = await utilities.getNav()
    res.render("index", {title: "Home", nav}) //homeee shows in meta data 
}

module.exports = baseController

//module.exports = router;

