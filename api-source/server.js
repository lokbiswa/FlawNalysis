const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const dotenv = require('dotenv');
const path = require('path');
require('dotenv').config();
dotenv.config();
const { auth, requiresAuth } = require('express-openid-connect');
app.use(express.static('public'))
const ejs = require('ejs');
app.set('view engine', 'ejs')
app.use(
  auth({
    authRequired: false,
    auth0Logout: true,
    issuerBaseURL: process.env.ISSUER_BASE_URL,
    baseURL: process.env.BASE_URL,
    clientID: process.env.CLIENT_ID, 
    secret: process.env.SECRET,
  })
);

// app.use(express.static('public'))

// if this file is hosted (Heroku), use the port number they provide, otherwise use port 8080 (will default here for local hosting)
port = process.env.PORT || 8080;
// configure body parser
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

// move routing to an external file to keep things organized
const tickets = require('./tickets-router.js');
const { env } = require('process');
app.use('/tickets', tickets)

// serving home page and display different right links depending on if the user is logedin
app.get('/',(req, res)=>{
  if(req.oidc.isAuthenticated()){
    // adding bootstrap dropdown for user menu
    let status = `<div class = "user"> 
                    <a href = '/profile'> 
                      <img class = avatar src = ${(req.oidc.user.picture)? req.oidc.user.picture : "https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png"} alt = "" />
                    </a> 
                    <div class="dropdown">
                      <button class="btn-lg dropdown-toggle" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                        ${req.oidc.user.name}
                      </button>
                      <div class="dropdown-menu dropdown-menu-right" aria-labelledby="dropdownMenuButton">
                        <a class="dropdown-item" href="/profile">View Profile</a>
                        <a class="dropdown-item" href="/logout">Logout</a>
                      </div>
                    </div>
                  </div>`
    let mobileLinks = [`<a class="dropdown-item" href="/profile">View Profile</a>`,
    `<a class="dropdown-item" href="/logout">Logout</a>`]
    let link = `<a href="/logout" class="btn-primary btn d-block mx-auto my-5" style = "width: fit-content !important;">Click to Logout</a>`
    res.render("index.ejs", {loginStatus: status, status:link, mobile:mobileLinks});
  }
  else{
    let link = `<a href="/login" class="btn-primary btn d-block mx-auto my-5" style = "width: fit-content !important;">Log in or Sign up</a>`
    let status = `<a href="/login"><span class="glyphicon glyphicon-log-in"></span> login</a>`
    res.render("index.ejs", {loginStatus: status, status:link});
  }
})
// dashboard
app.get('/dashboard', requiresAuth(),(req, res)=>{
  let status = `<div class = "user"> 
                    <a href = '/profile'> 
                      <img class = avatar src = ${(req.oidc.user.picture)? req.oidc.user.picture : "https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png"} alt = "" />
                    </a> 
                    <div class="dropdown">
                      <button class="btn-lg dropdown-toggle" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                        ${req.oidc.user.name}
                      </button>
                      <div class="dropdown-menu dropdown-menu-right" aria-labelledby="dropdownMenuButton">
                        <a class="dropdown-item" href="/profile">View Profile</a>
                        <a class="dropdown-item" href="/logout">Logout</a>
                      </div>
                    </div>
                </div>`
  let mobileLinks = [`<a class="dropdown-item" href="/profile">View Profile</a>`,
  `<a class="dropdown-item" href="/logout">Logout</a>`]
  res.render("dashboard.ejs", {loginStatus:status, mobile: mobileLinks});
})


// confirmation page after each time ticker is submited, edited, or deleted. 
app.get('/confirmation', requiresAuth(),(req, res)=>{
  res.render("confirmation.ejs")
})
// create ticker form.
app.get('/create-ticket', requiresAuth(),(req, res)=>{
  let status = `<div class = "user"> 
                  <a href = '/profile'> 
                    <img class = avatar src = ${(req.oidc.user.picture)? req.oidc.user.picture : "https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png"} alt = "" />
                  </a> 
                  <div class="dropdown">
                    <button class="btn-lg dropdown-toggle" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                      ${req.oidc.user.name}
                    </button>
                    <div class="dropdown-menu dropdown-menu-right" aria-labelledby="dropdownMenuButton">
                      <a class="dropdown-item" href="/profile">View Profile</a>
                      <a class="dropdown-item" href="/logout">Logout</a>
                    </div>
                  </div>
                </div>`
  let mobileLinks = [`<a class="dropdown-item" href="/profile">View Profile</a>`,
  `<a class="dropdown-item" href="/logout">Logout</a>`]
  res.render("ticketForm.ejs", {loginStatus:status, mobile: mobileLinks});
})
// view ticket details. 
app.get('/update-ticket', requiresAuth(),(req, res)=>{
  let status = `<div class = "user"> 
                  <a href = '/profile'> 
                    <img class = avatar src = ${(req.oidc.user.picture)? req.oidc.user.picture : "https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png"} alt = "" />
                  </a> 
                  <div class="dropdown">
                    <button class="btn-lg dropdown-toggle" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                      ${req.oidc.user.name}
                    </button>
                    <div class="dropdown-menu dropdown-menu-right" aria-labelledby="dropdownMenuButton">
                      <a class="dropdown-item" href="/profile">View Profile</a>
                      <a class="dropdown-item" href="/logout">Logout</a>
                    </div>
                  </div>
                </div>`
    let mobileLinks = [`<a class="dropdown-item" href="/profile">View Profile</a>`,
                       `<a class="dropdown-item" href="/logout">Logout</a>`]
  res.render("updateTicket.ejs", {loginStatus:status, mobile: mobileLinks});
})
// user profile info
app.get('/profile', requiresAuth(),(req, res)=>{
  res.render("profile.ejs", {user: req.oidc.user, pic: req.oidc.user.picture})
})
// json user info
app.get('/user', requiresAuth(), (req, res)=>{
  res.json(req.oidc.user)
})
// localhost
app.listen(port, function () {
  console.log(`listening on: http://localhost:${port}`)
})

