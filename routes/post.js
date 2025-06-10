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


router.get('/list', function(req, res){
    // conn.query("select * from post", function(err, rows, field){
    //     if(err) throw err;
    //         console.log(rows);
    // });

    mydb.collection('post').find().toArray().then(result=>{
        console.log(result);
        res.render('list.ejs', {data : result});
    })
})

module.exports = router;