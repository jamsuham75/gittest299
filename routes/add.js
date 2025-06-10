const router = require('express').Router();

const mongoclient = require('mongodb').MongoClient;
const url = process.env.DB_URL;
const ObjId = require('mongodb').ObjectId;

let mydb;

mongoclient.connect(url)
    .then(client=>{
        mydb = client.db('myboard');
    })
    .catch(err=>{
        console.log(err);
    })


router.get('/enter', function(req, res){
    res.render('enter.ejs');
})
    

module.exports = router;