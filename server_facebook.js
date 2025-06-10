//MongDB + Node.js 접속 코드

const mongoclient = require('mongodb').MongoClient;
const url = 'mongodb+srv://admin:1234@cluster0.airyv.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';
const ObjId = require('mongodb').ObjectId;

let mydb;

mongoclient.connect(url)
    .then(client=>{
        console.log('몽고DB 접속 성공');
        mydb = client.db('myboard');

        app.listen(9500, function(){
            console.log("포트 9500으로 서버 대기중...");
        });
    })
    .catch(err=>{
        console.log(err);
    })


//MySql + Node.js 접속 코드
const mysql = require("mysql");
const conn = mysql.createConnection({
    host : 'localhost',
    user : 'root',
    password : '123456',
    database : 'myboard299',
    port : '3307'
});

conn.connect();

const express = require('express');
const app = express();
const sha = require('sha256');

let cookieParser = require('cookie-parser');
app.use(cookieParser('dkfjs545165451'));

const bodyparser = require('body-parser');
app.use(bodyparser.urlencoded({extended:true}))
//정적 파일 라이브러리
app.use(express.static('public'));

app.set('view engine', 'ejs');

app.get('/cookie', function(req, res){
    let milk = parseInt(req.signedCookies.milk) + 1000;

    if(isNaN(milk)){
        milk = 0;
    }
    res.cookie('milk', milk, {signed : true});
    res.send('product : ' + milk + "원");
})

const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;


let session = require('express-session');
app.use(session({
    secret : 'dkfjaslkjfisdofj',
    resave : false,
    saveUninitialized : true 
}))

app.use(passport.initialize()); //req.session.passport.user
app.use(passport.session()); //deserializeUser()

app.get('/session', function(req, res){
    if(isNaN(req.session.milk)){
        req.session.milk = 0;
    }
    req.session.milk = req.session.milk + 1000;
    res.send("session : " + req.session.milk + "원");
})

// app.get('/', function(req, res){
//     res.send(
//         '<html>\
//             <body>\
//                 <h1>홈화면입니다.</h1>\
//                 <marquee>김호현님. 반갑습니다.</marquee>\
//             </body>\
//         </html>');
// })

app.get('/', function(req, res){
    if(req.session.passport){
        res.render('index.ejs', {user : req.session.passport});
    }else{
        res.render('index.ejs', {user : null});
    }
})

app.get('/enter', function(req, res){
    res.render('enter.ejs');
})

app.post('/save', function(req, res){
    console.log(req.body.title);
    console.log(req.body.content);
    console.log(req.body.someDate);

    mydb.collection('post')
        .insertOne({title : req.body.title, content : req.body.content, 
            date : req.body.someDate})
        .then(result=>{
            console.log(result);
            console.log('데이터 추가 성공');
            res.redirect('/list');
    });


    // let sql = "insert into post (title, content, created) values(?, ?, now())";
    // let params = [req.body.title, req.body.content];
    
    // conn.query(sql, params, function(err, result){
    //     if(err) throw err;
    //         console.log('데이터 추가 성공');
    // });
    // res.send('데이터 추가 성공');
})


app.get('/list', function(req, res){
    // conn.query("select * from post", function(err, rows, field){
    //     if(err) throw err;
    //         console.log(rows);
    // });

    mydb.collection('post').find().toArray().then(result=>{
        console.log(result);
        res.render('list.ejs', {data : result});
    })
})

app.post("/delete", function(req, res){
    console.log(req.body._id);
    req.body._id = new ObjId(req.body._id);
    mydb.collection('post').deleteOne(req.body)
    .then(result=>{
        console.log("삭제완료"); 
        res.status(200).send();   
    })
    .catch(err => {
        console.log(err);
        res.status(500).send();
    })
})

app.get('/content/:id', function(req, res){
    console.log(req.params.id);
    req.params.id = new ObjId(req.params.id);
    console.log(req.params.id);

    mydb
    .collection('post')
    .findOne({_id : req.params.id})
    .then(result=>{
        console.log(result);
        res.render('content.ejs', {data : result});
    })
})

app.get('/edit/:id', function(req, res){
    console.log(req.params.id);
    req.params.id = new ObjId(req.params.id);

    mydb
    .collection('post')
    .findOne({_id : req.params.id})
    .then(result=>{
        console.log(result);
        res.render('edit.ejs', {data : result});
    })
})

app.post('/edit', function(req, res){
    console.log(req.body);

    req.body.id = new ObjId(req.body.id);

    //updateOne(수정할 게시물 식별자, 수정할 값);
    //수정할 값 : {$set : { 키 : 변경할 값}}
    mydb.collection('post')
        .updateOne({_id : req.body.id}, 
            {$set : {title : req.body.title, content : req.body.content, 
            date : req.body.someDate}})
        .then(result=>{
            console.log(result);
            console.log('데이터 수정 완료');
            res.redirect('/list');
        })
        .catch((err)=>{
            console.log(err);
        });
})

app.get('/login', function(req, res){
    console.log(req.session);
    if(req.session.user){
        console.log("세션 유지");
        res.send('로그인 되었습니다.');
    }else{
        res.render('login.ejs');
    }
})

app.post(
    '/login', 
    passport.authenticate("local",{failureRedirect : '/fail'}), 
    function(req, res){
        console.log(req.session);
        console.log(req.session.passport);
        res.render("index.ejs", {user : req.session.passport});
})

passport.serializeUser(function(user, done){
    console.log('serializerUser');
    console.log(user.userid);
    done(null, user.userid);
})

passport.deserializeUser(function(puserid, done){
    console.log('deserializerUser');
    console.log(puserid);

    mydb
        .collection("account")
        .findOne({userid : puserid})
        .then((result) => {
            console.log(result);
            done(null, result);
        })
})


passport.use(
    new LocalStrategy({
        usernameField : "userid",
        passwordField : "userpw",
        session : true,
        passReqToCallback : false,
    },
    function (inputid, inputpw, done){
        mydb
        .collection("account")
        .findOne({userid : inputid})
        .then((result) => {
            if(result.userpw == sha(inputpw)){
                console.log('새로운 로그인');
                done(null, result); //인증 성공
            }else{
                done(null, false, {message : "비밀번호 오류"}); //인증 실패
            }
        })
    }
    )
)

app.get('/logout', function(req, res){
    console.log('로그아웃');
    req.session.destroy();
    // res.render('index.ejs', {user : null});
    res.redirect('/');
})

app.get('/signup', function(req, res){
    console.log('회원가입');
    res.render('signup.ejs');
})

app.post('/signup', function(req, res){
    console.log(req.body.userid);
    console.log(sha(req.body.userpw));
    console.log(req.body.usergroup);
    console.log(req.body.useremail);

    mydb.collection('account')
    .insertOne({
        userid : req.body.userid, 
        userpw : sha(req.body.userpw), 
        usergroup : req.body.usergroup,
        useremail : req.body.useremail
    })
    .then(result=>{
        console.log('회원가입 완료');
    });
    res.redirect('/');
})