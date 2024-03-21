const invModel = require("../models/inventory-model")
const utilities = require("../utilities/")

const invCont = {}

/* ***************************
 *  Build inventory by classification view
 * ************************** */
invCont.buildByClassificationId = async function (req, res, next) {
    const classification_id = req.params.classificationId
    // console.log(req.params) // this is an object 
    
    const data = await invModel.getInventoryByClassificationId(classification_id)
    const grid = await utilities.buildClassificationGrid(data)
    let nav = await utilities.getNav()
    //console.log("!!!!!!!!!!!!!!!!",grid)
    const className = data[0].classification_name/////////////////////////////////////fix this here
    res.render("./inventory/classification", { // renders the view in views/inventory/classification.ejs
        title: className + " vehicles", //+ req.params, //this shows in the meta data
        nav,
        grid,
        
        
    })
}

/*
 Build a specific vehicle view by inventory ID
*/

invCont.buildByInv_Id = async function(req, res, next){
    const inv_id = req.params.inv_Id
    const resultSet = await invModel.getInventoryByInv_id(inv_id)//needs to return data in rows
    console.log(".................\n",resultSet[0]) // its an object that show undfined alt=
    //build a view
    const view = await utilities.detailViewBuilder(resultSet) //needs rows plugged in and return the view
    console.log("??????????????",view)
    let nav = await utilities.getNav()
    const className = resultSet[0].inv_year + " " + resultSet[0].inv_make + " " + resultSet[0].inv_model
    res.render("./inventory/detail", {
        title: className, //this shows in the meta data and become h1
        nav,
        view,
        
    })

}

invCont.imGonnaBreak = async function(req,res,next){
    console.log("^^^^^^^^^^^^^^^^^^ i'm triggered")
    const inv_id = req.params.inv_Id
    const resultSet = await invModel.getInventoryByInv_id(inv_id)//needs to return data in rows
    const view = await utilities.detailViewBuilder(resultSet) //needs rows plugged in and return the view
    //let nav = await utilities.getNav()
    const className = resultSet[0].inv_year + " " + resultSet[0].inv_make + " " + resultSet[0].inv_model
    res.render("./inventory/detail", {//this wil render the file in this
        title: className, //this shows in the meta data and become h1
        nav,
        view,
        
    })
}

module.exports = invCont



