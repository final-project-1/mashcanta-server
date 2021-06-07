var express = require('express');
var router = express.Router();

const bodyParser=require('body-parser');
router.use(bodyParser.json());

const jwt = require("jsonwebtoken");

const TOKEN_SECRET =
  "F9EACB0E0AB8102E999DF5E3808B215C028448E868333041026C481960EFC126";

const generateAccessToken = (username) => {
  return jwt.sign({username}, TOKEN_SECRET);
};


router.get("/login", function (req, res) {
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
  const { user, password } = req.query;
  const token = generateAccessToken(user);
  console.log("token", token);
  return res.json({ token }).send();
});

router.post("/signup", function (req, res) {
  const { user, password } = req.body;
  //console.log(req.body);
  //const name =req.body.name
  res.send(req.body)
});

module.exports = router;