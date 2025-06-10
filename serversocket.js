const express = require('express');
const app = express();
const http = require('http').createServer(app);
const { Server } = require('socket.io');
const io = new Server(http);

app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public'));

app.get('/socket', function (req, res) {
    res.render('socket.ejs');
});

io.on('connection', function (socket) {
    console.log('클라이언트 접속');

    // room1에 입장
    socket.on('joinroom', function () {
        socket.join('room1');
        console.log('room1에 입장');
    });

    // room1에 메시지 보내기
    socket.on('room1-send', function (data) {
        io.to('room1').emit('broadcast', `[room1] ${data}`);
    });

    // 모든 클라이언트에게 메시지 보내기
    socket.on('user-send', function (data) {
        console.log(data);
        io.emit('broadcast', `[전체] ${data}`);
    });
});

http.listen(3000, () => {
    console.log('http://localhost:3000');
});
