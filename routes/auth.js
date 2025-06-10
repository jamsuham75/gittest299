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


let session = require('express-session');
router.use(session({
    secret : 'dkfjaslkjfisdofj',
    resave : false,
    saveUninitialized : true 
}))

router.get('/login', function(req, res){
    console.log(req.session);
    if(req.session.user){
        console.log("세션 유지");
        res.send('로그인 되었습니다.');
    }else{
        res.render('login.ejs');
    }
})

    

module.exports = router;