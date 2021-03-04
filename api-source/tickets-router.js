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
username = process.env.USER
password = process.env.PASSWORD
connectionString = `mongodb+srv://${username}:${password}@cluster0.d0ygw.mongodb.net/tickets?retryWrites=true&w=majority`
// port # from .env


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
    let role = (req.oidc.user["https://useroles"]) ?  req.oidc.user["https://useroles"][0] : 'user';
    if(role === 'admin') {
      data = db.collection('tickets').find().sort( { requestedDate : -1, name : 1} ).toArray();
      data.then(result => res.send(result))
        .catch(error => console.error(error));
    }else{
      data = db.collection('tickets').find({name: req.oidc.user.name}).sort( { requestedDate : -1, name : 1} ).toArray();
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
      data =  assignTech(req.body)
      console.log(data)
      data = db.collection('tickets').insertOne(req.body);
      data.then(result => res.redirect(301, '/'))
      .catch(error => console.error(error));
  });

  //Put Method

  router.put('/:id', requiresAuth(),  (req, res) => {
    id = req.params.id
    let o_id = ObjectID(`${id}`)
    console.log(req.body)
    data = db.collection('tickets').findOneAndUpdate(
      { _id: o_id },
      {
        $set: {
          status: req.body.status,
          type: req.body.type,
          priority: req.body.priority,
          assignedTo: req.body.assignedTo,
          ticketDetails: req.body.ticketDetails
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
  let {name, status, type, priority, ticketDetails, requestedDate} = reqBody
  return data = {
    name,
    status,
    type,
    priority,
    ticketDetails,
    requestedDate,
    assignedTo
  }
}

module.exports = router