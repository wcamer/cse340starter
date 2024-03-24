const utilities = require("../utilities")


async function buildManagement(req, res) {
    let nav = await utilities.getNav()
    const managementView = await utilities.buildManagmentView()
    console.log("$$$$$$$$$$$$$$",req.params) // this is {}, if it's just req then its a huge thing

    res.render("inventory/management", {
        title: "Management",
        nav,
        errors: null,
        managementView,
    })

}

async function buildAddClassForm(req, res){
    let nav = await utilities.getNav()
    let AddClassFormview = await 

    res.render("/inventory/add-classification", {
        title: "Add Classification",
        nav,
        errors: null,
        AddClassFormview 
    })

}

module.exports = {buildManagement}