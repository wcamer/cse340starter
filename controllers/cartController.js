const invModel = require("../models/inventory-model")
const utilities = require("../utilities/")
const bcrypt = require("bcryptjs")
const accountModel = require("../models/account-model")
const jwt = require("jsonwebtoken")
const cartModel = require("../models/cart-model")
require("dotenv").config()

let cartCont = {}

cartCont.buildCart = async function(req,res){
    const nav = await utilities.getNav()
    const tools = await utilities.loggedIn(res.locals)
    let data = await cartModel.getCartItems(res.locals.account_id)
    const cart = await utilities.buildCartView(data)
    res.render("cart/index",{
        title: "Cart",
        nav,
        tools,
        errors: null,
        cart
    })

}


module.exports = cartCont