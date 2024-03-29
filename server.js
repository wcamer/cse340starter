/* ******************************************
 * This server.js file is the primary file of the 
 * application. It is used to control the project.
*******************************************/
/* ***********************
 * Require Statements
 *************************/
const session = require("express-session")
const pool = require('./database/')
const expressLayouts = require("express-ejs-layouts")
const express = require("express")
const env = require("dotenv").config()
const app = express()
const static = require("./routes/static")
const baseController = require("./controllers/baseController")
const inventoryRoute = require("./routes/inventoryRoute")
const detailRoute = require("./routes/detailRoute")
const managementRoute = require("./routes/managementRoute")
const intentErrorRoute = require("./routes/intentErrorRoute")
const accountRoute = require("./routes/accountRoute")
const bodyParser = require("body-parser")
const utilities = require("./utilities/")
const cookieParser = require("cookie-parser")
//

/* ***********************
 * Middleware
 * ************************/
app.use(session({
  store: new (require('connect-pg-simple')(session))({
    createTableIfMissing: true,
    pool,
  }),
  secret: process.env.SESSION_SECRET,
  resave: true,
  saveUninitialized: true,
  name: 'sessionId',
}))

//Express Messages Middleware
app.use(require('connect-flash')())
app.use(function(req, res, next){
  res.locals.messages = require('express-messages')(req,res)
  next()
})

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true})) // for parsing application/x-www-form-urlencoded
app.use(cookieParser())
app.use(utilities.checkJWTToken)

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
//mangement route
app.use("/inv", utilities.handleErrors(managementRoute))
//intentional error route
app.use("/er", utilities.handleErrors(intentErrorRoute))
app.use("/account", utilities.handleErrors(accountRoute))
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
  let tools = await utilities.loggedIn(res.locals)
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
    tools,
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
