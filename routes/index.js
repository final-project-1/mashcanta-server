var express = require('express');
var router = express.Router();

var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/mashcantaDB";

const bodyParser=require('body-parser');
router.use(bodyParser.json());


const jwt = require("jsonwebtoken");

const TOKEN_SECRET =
  "F9EACB0E0AB8102E999DF5E3808B215C028448E868333041026C481960EFC126";

const generateAccessToken = (email) => {
  return jwt.sign({email}, TOKEN_SECRET);
};

router.get('/createDB',()=>{
  MongoClient.connect(url, function(err, db) {
    if (err) throw err;
    console.log("Database created!");
    db.close();
  });
})

router.get('/createCustomersCollection',()=>{
  MongoClient.connect(url, function(err, db) {
    if (err) throw err;
    var dbo = db.db("mashcantaDB");
    dbo.createCollection("customers", function(err, res) {
      if (err) throw err;
      console.log("Collection created!");
      db.close();
    });
  });
})

router.get("/login", function (req, res) {
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
  const { email, password } = req.query;

  MongoClient.connect(url, function(err, db) {
    if (err) return res.status(500).json(err);
    var dbo = db.db("mashcantaDB");
    dbo.collection("customers").findOne({email,password}, function(err, result) {
      if (err) return res.json(err)
      console.log(result.email);
      db.close();
    });
  });
  const token = generateAccessToken(email);
  console.log("token", token);
  return res.json({ token });
});

router.post("/signup", function (req, res) {
   const { firstName, lastName, email, password } = req.body;
    //validation
    //check if user exsists

  MongoClient.connect(url, function(err, db) {
    if (err) return res.status(500).json(err);
    var dbo = db.db("mashcantaDB");
    var customer ={
      firstName:firstName,
      lastName:lastName,
      email:email,
      password:password
    };
    dbo.collection("customers").insertOne(customer, function(err, res) {
      if (err) return res.json(err);
      console.log("1 document inserted");
      db.close();
    });
    const token= generateAccessToken(email)
    console.log("token",token);
    return res.json({token});
  });
});

module.exports = router;