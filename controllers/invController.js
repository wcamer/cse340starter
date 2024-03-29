const invModel = require("../models/inventory-model")
const utilities = require("../utilities/")

const invCont = {}

/* ***************************
 *  Build inventory by classification view
 * ************************** */
invCont.buildByClassificationId = async function (req, res, next) {
    const classification_id = req.params.classificationId
    console.log(req.params) // this is an object 
    const tools = await utilities.loggedIn(res.locals)
    const data = await invModel.getInventoryByClassificationId(classification_id)
    const grid = await utilities.buildClassificationGrid(data)
    let nav = await utilities.getNav()
    //console.log("!!!!!!!!!!!!!!!!",grid)
    const className = data[0].classification_name/////////////////////////////////////fix this here
    res.render("./inventory/classification", { // renders the view in views/inventory/classification.ejs
        title: className + " vehicles", //+ req.params, //this shows in the meta data
        nav,
        grid,
        tools,
        
        
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
    console.log("??????????????",req.params)
    let nav = await utilities.getNav()
    const tools = await utilities.loggedIn(res.locals)
    const className = resultSet[0].inv_year + " " + resultSet[0].inv_make + " " + resultSet[0].inv_model
    res.render("./inventory/detail", {
        title: className, //this shows in the meta data and become h1
        nav,
        view,
        tools,
        
    })

}

/*inventory management */
invCont.buildManagement = async function (req, res) {
    let nav = await utilities.getNav()
    const tools = await utilities.loggedIn(res.locals)
    const managementView = await utilities.buildManagmentView() //this needs to be fixed
    const classificationList = await utilities.buildClassificationList()
    console.log("$$$$$$$$$$$$$$",req.params) // this is {}, if it's just req then its a huge thing

    res.render("inventory/management", {
        title: "Management",
        nav,
        errors: null,
        managementView,
        classificationList,
        tools,
    })

}

invCont.buildAddClassForm = async function (req,res){
    console.log("//////////////////////////////////////////")
    let nav = await utilities.getNav()
    const tools = await utilities.loggedIn(res.locals)
    console.log(">>>>>>>>>>>>>>>>>>>>>>>tools in buildaddclassform here>>>>>>>\n",tools)
    //let addClassFormView = await utilities.buildAddClassFormView()
    
    res.render("inventory/add-classification", {
        title: "Add Classification",
        nav,
        errors: null,
        //addClassFormView,
        tools,
    })
}

invCont.registerAddClassForm = async function (req,res){
    let nav = await utilities.getNav()
    const tools = await utilities.loggedIn(res.locals)
    const {classification_name} = req.body
    //console.log("****************req.body",req.body,"\n\nclass_name",classification_name)
    const addClassFormView = utilities.buildAddClassFormView() /// i have prior to this
    const regResult = await invModel.registerNewClassificationName(classification_name)
    console.log("((((((((((((((((((((((((((")//,regResult)

    if(regResult ){
      
        req.flash(
            "notice",
            `New classfication of "${classification_name}" was just added`)


        
        // nav = utilities.getNav()
        res.status(201).render("inventory/add-classification", {
            title: "Add Classification",
            nav:   await utilities.getNav(),
            errors: null,
            // addClassFormView,
            tools,
        })


    }else{
        req.flash(
            "notice",
            "Something went wrong..."

        )

        res.status(501).render("inventory/add-classification"), {
            title: "Add Classification",
            nav,
            errors:null, //this will change
            tools,
        }
    }
}

invCont.buildAddInventory = async function(req, res) {
    let nav = await utilities.getNav()
    const tools = await utilities.loggedIn(res.locals)
    let droplist = await utilities.buildClassificationList()
    //console.log(droplist)
    //let addInventoryView = utilities.buildAddInventoryView(droplist)
    //console.log("%%%%%%%%%%%%***********************************************")

    res.render("inventory/add-inventory",{
        title: "Add Inventory",
        nav,
        tools,
        errors: null,
        droplist
        //addInventoryView,
    })
}

invCont.registerAddNewInventory = async function(req, res) {
    const { inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, classification_id} = req.body
    let nav = await utilities.getNav()
    const tools = await utilities.loggedIn(res.locals)
    let droplist = await utilities.buildClassificationList()
    
    //let addInventoryView = utilities.buildAddInventoryView(droplist)
    let managementView = await utilities.buildManagmentView()
    console.log(req.body)

    const regResult = await invModel.registerAddNewInventory(inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, classification_id)
    console.log("------------------------------------------",regResult)

    if(regResult){

        req.flash("notice", `The vehicle "${inv_make} ${inv_model}" has been added`)
        res.status(201).render("inventory/management",{
            title: "Management",
            nav,
            tools,
            errors: null,
            managementView,
            classificationList: droplist
        })
    }else{
        req.flash("notice", "Something went wrong with processing the new inventory")

        res.status(501).render("inventory/add-inventory",{
            title: "Add Inventory",
            nav,
            tools,
            errors,
            droplist,
            //addInventoryView,
            inv_year,
            inv_make,
            inv_model,
            inv_description,
            inv_image,
            inv_thumbnail,
            inv_price,
            inv_miles,
            inv_color,
            classification_id
        })
    }
    
}


/* ***************************
 *  Return Inventory by Classification As JSON
 * ************************** */

invCont.getInventoryJSON = async (req, res, next) => {
    const classification_id = parseInt(req.params.classification_id)
    const invData = await invModel.getInventoryByClassificationId(classification_id)
   if(invData[0].inv_id) {
    return res.json(invData)

    } else {
        next(new Error("No data returned"))
    }
}

// builds the initial view for inventory edit 
invCont.buildInventoryEdit = async (req, res, next) =>{
    const inv_id = parseInt(req.params.inv_id)
    console.log(inv_id)
    let nav = await utilities.getNav()
    const tools = await utilities.loggedIn(res.locals)
    let getInvById = await invModel.getInventoryByInv_id(inv_id)
    // console.log("---------------///////////////////",getInvById)
    let name = `${getInvById[0].inv_make}  ${getInvById[0].inv_model}`
    console.log("---------------///////////////////",getInvById[0], name)
    let droplist = await utilities.buildClassificationList(getInvById[0].classification_id)
    console.log(droplist, name)
    // let inventoryEditView = utilities.buildInventoryEdit

    res.render("inventory/edit-inventory",{
        title: "Edit " + name,
        nav,
        tools,
        errors: null,
        droplist: droplist,
        // inventoryEditView,
        inv_id: getInvById[0].inv_id,
        inv_make: getInvById[0].inv_make,
        inv_model: getInvById[0].inv_model,
        inv_year: getInvById[0].inv_year,
        inv_description: getInvById[0].inv_description,
        inv_image: getInvById[0].inv_image,
        inv_thumbnail: getInvById[0].inv_thumbnail,
        inv_price: getInvById[0].inv_price,
        inv_miles: getInvById[0].inv_miles,
        inv_color: getInvById[0].inv_color,
        classification_id: getInvById[0].classification_id


    })
}

/* */
invCont.registerInventoryEdit = async function(req, res) {
    const { inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, classification_id, inv_id} = req.body
    let nav = await utilities.getNav()
    const tools = await utilities.loggedIn(res.locals)
    let droplist = await utilities.buildClassificationList()
    //let addInventoryView = utilities.buildAddInventoryView(droplist)
    let managementView = await utilities.buildManagmentView()
    console.log(req.body)

                        //aka .........updateInventory()
    const updateResult = await invModel.editInventory(inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, classification_id, inv_id)
    ////
    
    console.log("------------------------------------------",updateResult)

    if(updateResult){

        req.flash("notice", `The vehicle "${inv_make} ${inv_model}" has been edited`)
        res.status(201).render("inventory/management",{
            title: "Management",
            nav,
            tools,
            errors: null,
            managementView,
            classificationList: droplist,
        })
    }else{
        req.flash("notice", "Something went wrong with processing the edit/insert")

        res.status(501).render("inventory/edit-inventory",{
            title: "Edit " + inv_make + " " + inv_model,
            nav,
            tools,
            errors: null,
            //addInventoryView,
            inv_year,
            inv_make,
            inv_model,
            inv_description,
            inv_image,
            inv_thumbnail,
            inv_price,
            inv_miles,
            inv_color,
            classification_id,
            droplist,
        })
    }
    
}

/* This builds the initial delete-confirm view */

invCont.buildDeleteInv = async  (req,res,next) =>{
    const inv_id = parseInt(req.params.inv_id)
    console.log(inv_id)
    let nav = await utilities.getNav()
    const tools = await utilities.loggedIn(res.locals)
    let getInvById = await invModel.getInventoryByInv_id(inv_id)
    // console.log("---------------///////////////////",getInvById)
    let name = `${getInvById[0].inv_make}  ${getInvById[0].inv_model}`
    console.log("--/-/-/-/--/-/---/-/-/",getInvById[0], name)
    //let droplist = await utilities.buildClassificationList(getInvById[0].classification_id)
    //console.log(droplist, name)
    // let inventoryEditView = utilities.buildInventoryEdit

    res.render("inventory/delete-confirm",{
        title: "Delete " + name,
        nav,
        tools,
        errors: null,
        //droplist: droplist,
        // inventoryEditView,
        inv_id: getInvById[0].inv_id,
        inv_make: getInvById[0].inv_make,
        inv_model: getInvById[0].inv_model,
        inv_year: getInvById[0].inv_year,
        inv_price: getInvById[0].inv_price,
        


    })
}

/* This registers/processes the deletion*/
invCont.registerDeleteInv = async function (req, res) {
    const {inv_id, inv_make, inv_model, inv_price, inv_year} = req.body
    let nav = await utilities.getNav()
    const tools = await utilities.loggedIn(res.locals)
    //console.log(req.params)
    //const inv_id = parseInt(req.params.inv_id)
   //console.log('******',inv_id)//,"*-*****************\n",req)
    //const { inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, classification_id, inv_id} = req.body
  
    
    //let addInventoryView = utilities.buildAddInventoryView(droplist)
    
  

        
    //const deletionResult = await invModel.deleteVehicle(inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, classification_id, inv_id)
    const deletionResult = await invModel.deleteVehicle(inv_id)
    
    // console.log("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!",deletionResult.rowCount)

    if(deletionResult == 1){
        let managementView = await utilities.buildManagmentView()
        let droplist = await utilities.buildClassificationList()
        req.flash("notice", "The deletion was successful.")
        res.status(201).render("inventory/management",{
            title: "Management",
            nav,
            tools,
            errors: null,
            managementView,
            classificationList: droplist,
        })
    }else{
        // console.log("@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@")
        req.flash("notice", "Something went wrong with processing the deletion.  Process aborted.")

        // res.status(501).redirect(`/delete-confirm/${inv_id}`, 501,{
        //     title: "Delete" + inv_make + " " + inv_model,
        //     nav,
        //     errors: null,
        //     //addInventoryView,
        //     inv_year: inv_year,
        //     inv_make: inv_make,
        //     inv_model: inv_model,
        //     inv_price: inv_price,
        //     inv_id: inv_id,
            
        // })
        res.status(501).render(`/delete-confirm/${inv_id}`,{
            title: "Delete" + inv_make + " " + inv_model,
            nav,
            tools,
            errors: null,
            //addInventoryView,
            inv_year: inv_year,
            inv_make: inv_make,
            inv_model: inv_model,
            inv_price: inv_price,
            inv_id: inv_id,
            
        })
    }
}

//probably not going to fix and use this
// invCont.imGonnaBreak = async function(req,res,next){
//     console.log("^^^^^^^^^^^^^^^^^^ i'm triggered")
//     const inv_id = req.params.inv_Id
//     const resultSet = await invModel.getInventoryByInv_id(inv_id)//needs to return data in rows
//     const view = await utilities.detailViewBuilder(resultSet) //needs rows plugged in and return the view
//     //let nav = await utilities.getNav()
//     const className = resultSet[0].inv_year + " " + resultSet[0].inv_make + " " + resultSet[0].inv_model
//     res.render("./inventory/detail", {//this wil render the file in this
//         title: className, //this shows in the meta data and become h1
//         nav,
//         view,
        
//     })
// }

module.exports = invCont



