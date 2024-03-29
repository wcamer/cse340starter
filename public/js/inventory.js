"use strict"

//const { buildAddInventory } = require("../../controllers/invController")

 // Get a list of items in inventory based on the classification_id 
let classificationList = document.querySelector("#classificationList")
//let cl = document.querySelector("#classficationList")
classificationList.addEventListener("change", function () {
    let classification_id = classificationList.value 
    console.log(`classification_id is: ${classification_id}`)
    let classIdURL = "/inv/getInventory/" + classification_id // the path might need to be changed
    fetch(classIdURL)
    .then(function (response) {
        if (response.ok){
            return response.json();
        }
        throw Error("Network response was not OK")
    })
    .then(function (data) {
        console.log(data)
        buildInventoryList(data)//////

    })
    .catch(function (error){
        console.log("there was a problem: ", error.message)
    })

    // Build inventory items into HTML table components and inject into DOM 
    function buildInventoryList(data){
        let inventoryDisplay = document.getElementById("inventoryDisplay")
        //setup the table labels
        let dataTable = '<thead>'
        dataTable += "<tr><th>Vehicle Name</th><td>&nbsp;</td></tr>";
        dataTable += "</thead>"
        dataTable += "<tbody>"
        data.forEach(function (element) {
            console.log(element.inv_id + ", " + element.inv_model)
            dataTable += `<tr><td>${element.inv_make} ${element.inv_model}</td>`;
            dataTable += `<td><a href='/inv/edit-inventory/${element.inv_id}' title='Click to update'>Modify</a></td>`;
            dataTable += `<td><a href='/inv/delete-confirm/${element.inv_id}' title='Click to delete'>Delete</a></td>`;

        })

        dataTable += '</tbody'
         // Display the contents in the Inventory Management view 
         inventoryDisplay.innerHTML = dataTable
    }


 })// end of event handler
