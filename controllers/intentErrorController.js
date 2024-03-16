const utilities = require("../utilities/")
const invModel = require("../models/inventory-model")

const broke = {}

broke.imGonnaBreak = async function(req,res,next){
    console.log("%%%%%%%%%%%%%%%%%%%%%%% i'm triggered")
    //throw new Error("@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@")
    const inv_id = req.params.inv_Id
    const resultSet = await invModel.getInventoryByInv_id(inv_id)//needs to return data in rows
    console.log(".333333333333333333333\n",resultSet[0]) // its an object that show undfined alt=
    //build a view
    //const view = await utilities.detailViewBuilder(resultSet) //needs rows plugged in and return the view
    console.log("11111111111111111",view)
    //let nav = await utilities.getNav()
    const className = resultSet[0].inv_year + " " + resultSet[0].inv_make + " " + resultSet[0].inv_model
    res.render("./inventory/details", {
        title: className, //this shows in the meta data and become h1
        nav,
        view,
    })
}



module.exports = broke 