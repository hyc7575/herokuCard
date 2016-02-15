
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes');

var app = module.exports = express.createServer();
var io = require('socket.io')(app);
var url = require('url');
// Configuration

app.configure(function(){
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(__dirname + '/public'));
});

app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

app.configure('production', function(){
  app.use(express.errorHandler());
});


//db connect
var mysql = require('mysql');
var dbConfig = {
	host: 'localhost',
	user: 'root',
	password: 's15031503',
	database: 'cardRoom'
}
var connection = mysql.createConnection(dbConfig);
connection.connect(function(err) {
	if(err) {
		console.log('에러 발생 : ' + err);
	} else {
		console.log('mysql 연결 성공');
	}
})
// Routes
app.get('/',function(req,res) {
	res.redirect('/room_list.html');
});

app.get('/card/:id',function(req,res) {
	res.redirect('/index.html?room='+req.params.id);
});


app.post('/room/create',function(req,res) {
	var insert = "insert into room (name,user_num) values (?,?)";
	connection.query(insert,[req.body.name,0],function(err,results) {
		res.redirect('/index.html?room='+results.insertId);
	});
});
app.post('/chat',function(req,res) {

});



var RoomInfo = {
	room: {

	}
}
io.sockets.on('connection',function(socket) {
	//console.log(socket.handshake.headers.referer);
	socket.on('list show',function(data) {
		var select = 'select * from room';
		connection.query(select,function(err,results) {
			socket.emit('test',results);
		});
	});
	socket.on('join',function(data) {
		/*
		var user = io.sockets.clients(data.room);
		console.log(user);
		*/
		var select = 'select * from room where room_id=?';
		connection.query(select,[data.room],function(err, results) {
			var currentUserNum = results[0].user_num +1;
			var update = 'update room set user_num=? where room_id=?';
			if(currentUserNum > 2) {
				socket.emit('full user');
			} else if (currentUserNum == 2) {
				joinUser();
			} else if(currentUserNum == 1) {
				createRoom();
			}
			function createRoom() {
				socket.join(data.room);
				RoomInfo.room["room"+data.room] = {};
				connection.query(update,[results[0].user_num+1,results[0].room_id],function(err,resultsUpdate) {
					console.log('방 생성자 입장');
				});
			}
			function joinUser() {
				socket.join(data.room);
				var cardData = cardView();
				connection.query(update,[results[0].user_num+1,results[0].room_id],function(err,resultsUpdate) {
					console.log(results);
					console.log('도전자 입장');
					io.sockets.in(data.room).emit('join room',cardData);
				});
			}
		});
	});
	socket.on('dice result',function(data) {
		//아마 userName 중복 버그 생길듯. 나중에 분기 해줍시당
		var userName = data.userName;
		var diceResult = data.diceResult;
		var myRoom = RoomInfo.room["room"+data.room];
		myRoom[userName] = {'dice':diceResult};
		myRoom.count = 0;
		console.log(RoomInfo);
		for(var k in myRoom) {
			myRoom.count++;
		}
		if(myRoom.count == 3) {
			io.sockets.in(data.room).emit('start',RoomInfo);
			myRoom.count = 0;
		}
	});
	socket.on('message', function(data) {
		io.sockets.in(data).emit('message',data);
	});
	
	socket.on('click card',function(data) {
		socket.broadcast.to(data.room).emit('click ok',data.clickCard);
	});
	socket.on('change user',function(data) {
		io.sockets.in(data.room).emit('change ok',data);
	});
	socket.on('chat write',function(data) {
		console.log('RoomInfo');
		io.sockets.in(data.room).emit('chat write ok',data);
	});
	socket.on('join before',function(data) {
		var select = 'select user_num from room where room_id=?';
		connection.query(select,[data],function(err,results) {
			var resultObj = {};
			resultObj.id = data;
			resultObj.status = results[0];
			console.log(resultObj);
			socket.broadcast.emit('status change',resultObj);
		});
	});



	socket.on('disconnect',function(data) {
		console.log(url.format);
		console.log('disconnect 발생');
		io.sockets.in(data).emit('leave',data);
	});
});

function cardView (){
	card = [];
	for(var i = 1; i<=18; i++) {
		card.push('card'+i+'.jpg');
		card.push('card'+i+'.jpg');
	}
	for(var i = card.length -1; i>0; i--) {
		var num = Math.floor(Math.random() * (i+1));
		var temp = card[i]; 
		card[i] = card[num];
		card[num]= temp;
		/*
			1.배열의 마지막 원소의 인덱스가 5라면 4까지의 인덱스 요소중 한개를 랜덤으로 선택하여 바꿔준다.
			2.전에 바꾸었던 원소의 인덱스 값이 5라면, 4번째 인덱스 값을 0~3 까지의 인덱스에 담긴 값들중 한개와 바꿔준다.
			3.반복
		*/
	}
	return card;
}



app.listen(5000, function() {
	console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
});
