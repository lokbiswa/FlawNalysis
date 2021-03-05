const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser')
const MongoClient = require('mongodb').MongoClient;
const ObjectID = require("bson-objectid");
const { requiresAuth } = require('express-openid-connect');
const Tech = require('./tech')
// const ticket = require('../models/ticket');
require('dotenv').config();
// getting credential to connect to db
username = process.env.USERNAME
password = process.env.PASSWORD
connectionString = `mongodb+srv://${username}:${password}@cluster0.d0ygw.mongodb.net/tickets?retryWrites=true&w=majority`
// port # from .env

console.log(connectionString)
// connection to mongoDB
MongoClient.connect(connectionString, { useUnifiedTopology: true }).then(client => {

  const db = client.db('capstone');
  const ticketsCollections = db.collection('tickets');
  console.log('connected to database');

  router.use(bodyParser.json());
  router.use(bodyParser.urlencoded({ extended: true }));


  // Add all the CRUD here!

  // Get Methods
  router.get('/', requiresAuth(), (req, res) => {
    // check role
    let role = (req.oidc.user.nickname) ?  req.oidc.user.nickname : 'user';
    if(role === 'admin') {
      data = db.collection('tickets').find().sort( { status: -1 ,_id : -1} ).toArray();
      data.then(result => res.send(result))
        .catch(error => console.error(error));
    }
    else if(req.oidc.user.given_name === Tech.Phone.name){
      data = db.collection('tickets').find({type: "Phone"}).sort( { status: -1 ,_id : -1} ).toArray();
      data.then(result => res.send(result))
        .catch(error => console.error(error));
    }
    else if(req.oidc.user.given_name === Tech.Email.name){
      data = db.collection('tickets').find({type: "Email"}).sort( { status: -1 ,_id : -1} ).toArray();
      data.then(result => res.send(result))
        .catch(error => console.error(error));
    }
    else if(req.oidc.user.given_name === Tech.Computer.name){
      data = db.collection('tickets').find({type: "Computer"}).sort( { status: -1 ,_id : -1} ).toArray();
      data.then(result => res.send(result))
        .catch(error => console.error(error));
    }
    else if(req.oidc.user.given_name == Tech.Other.name){
      data = db.collection('tickets').find({type: "Other"}).sort( { status: -1 ,_id : -1} ).toArray();
      data.then(result => res.send(result))
        .catch(error => console.error(error));
    }
    
    else{
      data = db.collection('tickets').find({name: req.oidc.user.name}).sort( { status : -1, _id : -1} ).toArray();
      data.then(result => res.send(result))
        .catch(error => console.error(error));
    }
  })

  // get ticket by id
  router.get('/:id', requiresAuth(), (req, res) => {
    id = req.params.id
    o_id = ObjectID(`${id}`)
    data = db.collection('tickets').findOne({ _id: o_id });
    data.then(result => res.send(result))
      .catch(error => console.error(error));
  })
  // Post Method

  router.post('/', requiresAuth(),  (req, res) => {
      ticketData =  assignTech(req.body)
      console.log(req.body.type)
      data = db.collection('tickets').insertOne(ticketData);
      data.then(result => res.redirect(301, '/'))
      .catch(error => console.error(error));
  });

  //Put Method

  router.put('/:id', requiresAuth(),  (req, res) => {
    id = req.params.id
    let o_id = ObjectID(`${id}`)
    ticketData = assignTech(req.body)
    console.log(ticketData)
    data = db.collection('tickets').findOneAndUpdate(
      { _id: o_id },
      {
        $set: {
          name: ticketData.name,
          type: ticketData.type,
          assignedTo: ticketData.assignedTo,
          ticketDetails: ticketData.ticketDetails,
          status: ticketData.status,
          priority: ticketData.priority,
          email:ticketData.email
        }
      },
      {
        upsert: true
      }
    )
    data.then(result => {
      res.json('Ticket updated')
    })
      .catch(error => console.error(error))
  })

  //Delete Method
  router.delete('/:id', requiresAuth(), (req, res) => {
    id = req.params.id
    o_id = ObjectID(`${id}`)
    console.log(o_id)
    db.collection('tickets').deleteOne({ _id: o_id })
      .then(result => {
        if (result.deletedCount === 0) {
          return res.json('ticket not found')
        }
        res.json(`deleted`)
      })
      .catch(error => console.error(error))
  })
})
  .catch(error => console.error(error))

function assignTech(reqBody){
  let assignedTo = Tech[reqBody.type].name 
  let { name, status, type, priority, ticketDetails, email } = reqBody
  return data = {
    name,
    status,
    type,
    priority,
    ticketDetails,
    assignedTo,
    email
  }
}

module.exports = router