var express = require('express');
var router = express.Router();
const Plans = require('../models/plans')

/* GET users listing. */
router.route('/')
.get((req, res, next) =>{
  Plans.find({}).then((plans) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.json(plans);
    console.log('get plans infos')
  }, (err) => {console.log( 'error:'+ err)})
  .catch((err) => {console.log('error outside'+err)})

})
.post((req,res,next) => {
    Plans.create(req.body)
    .then((plan) => {
      console.log("Plano criado", plan);
      res.statusCode = 200
      res.setHeader('Content-Type', 'application/json');
      res.json(plan);
    }, (err) => {console.log( 'error:'+ err)})
    .catch((err) => {console.log('error outside'+err)})
});

module.exports = router;
