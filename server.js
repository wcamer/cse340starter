/* ******************************************
 * This server.js file is the primary file of the 
 * application. It is used to control the project.
 *******************************************/
/* ***********************
 * Require Statements
 *************************/
const expressLayouts = require("express-ejs-layouts")
const express = require("express")
const env = require("dotenv").config()
const app = express()
const static = require("./routes/static")
const baseController = require("./controllers/baseController")
const inventoryRoute = require("./routes/inventoryRoute")
const detailRoute = require("./routes/detailRoute")
const intentErrorRoute = require("./routes/intentErrorRoute")
const utilities = require("./utilities/")
//


/* ***********************
 * View Engine and Templates
 *************************/
app.set("view engine", "ejs")
app.use(expressLayouts)
app.set("layout", "./layouts/layout")


/* ***********************
 * Routes
 *************************/
app.use(static)
//Index route
app.get("/", utilities.handleErrors(baseController.buildHome))
//Inventory routes
app.use("/inv", utilities.handleErrors(inventoryRoute))
//Detail route
app.use("/inv", utilities.handleErrors(detailRoute))////
//intentional error route
app.use("/er", utilities.handleErrors(intentErrorRoute))
//File not Found Rout - must be last route in list
app.use(async (req, res, next) => {
  next({status: 404, message: 'Sorry, we appear to have lost that page.'})
})


/* ***********************
* Express Error Handler
* Place after all other middleware
*************************/
app.use(async (err, req, res, next) => {
  let nav = await utilities.getNav()
  console.error(`Error at: "${req.originalURL}": ${err.message}`)
  if(err.status == 404){ 
    message = err.message
  } else {
    err.status = 505
    message = 'Oh no! There was a crash.  Maybe try a different route?'
  }
  let errorView = await utilities.errorViewBuilder(err.status, message)
  res.render("errors/error", {
    title: err.status || 'Server Error',
    nav,
    errorView
  })
})




/* ***********************
 * Local Server Information
 * Values from .env (environment) file
 *************************/
const port = process.env.PORT
const host = process.env.HOST

/* ***********************
 * Log statement to confirm server operation
 *************************/
app.listen(port, () => {
  console.log(`app listening on ${host}:${port}`)
})
