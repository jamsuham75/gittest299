const express = require('express')
const passport = require('passport');
const kakaoStrategy = require('passport-kakao').Strategy;

const app = express();

let session = require('express-session');

app.use(session({
    secret : 'dkfjaslkjfisdofj',
    resave : false,
    saveUninitialized : true 
}))

app.use(passport.initialize()); //req.session.passport.user
app.use(passport.session()); //deserializeUser()

const users = [];

passport.use(
    new kakaoStrategy(
        {
            clientID : '3ddc1e8691b076c6c37d621a618ba3ab',
            callbackURL : '/auth/kakao/callback',
        },
        function (accessToken, refreshToken, profile, done){
            
            var authId = 'Kakao' + profile.id;
            console.log(authId);
            let user = users.find(user=> user.authId === authId);
            console.log(user);
            if(!user){
                user = {
                    authId : authId,
                    displayName : profile.username || profile.displayName
                };
                users.push(user);
            }
            return done(null, user);
        }
    )
)

passport.serializeUser(function(user, done){
    console.log('serializeUser');
    done(null, user.authId);
})

passport.deserializeUser(function(authId, done){
    console.log('deserializeUser');
    const user = users.find(user => user.authId === authId);
    done(null, user || false);
})


app.get('/', function(req, res){
    res.send(`
        <h1>카카오 로그인</h1>
        <a href = "/auth/kakao">로그인</a>
        `);
})

app.get('/auth/kakao', passport.authenticate('kakao'));

app.get('/auth/kakao/callback', passport.authenticate('kakao', {
    successRedirect : '/profile',
    failureRedirect : '/'
}))

app.get('/profile', (req, res)=>{
    if(!req.isAuthenticated()){
        return res.redirect('/');
    }
    res.send(`
        <h1>${req.user.displayName}님 반갑습니다.</h1>
        <a href = "/logout">로그아웃</a>
        `)
})

const PORT = 9500;
app.listen(PORT, ()=>{
    console.log(`포트 ${PORT}에서 실행중...`)
})