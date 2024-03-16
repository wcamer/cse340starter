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


/* ****************************************
 * Middleware For Handling Errors
 * Wrap other function in this for 
 * General Error Handling
 **************************************** */
Util.handleErrors = fn => (req, res, next) => Promise.resolve(fn(req,res,next)).catch(next)



module.exports = Util