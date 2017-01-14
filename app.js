var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.get('/', function(req, res){
	res.sendFile(__dirname + '/index.html');
});
/*
app.get('/:roomid', function(req, res){
	res.sendFile(__dirname + '/index.html');
});*/

app.use(express.static(__dirname + '/public'));
var user_count = 0;
var users={};
var whiteboard='';
var BGsrc=[];
var PDFsrc='';
var pdf_can=[]


//當新的使用者連接進來的時候
io.on('connection', function(socket){
	
	//新user
	socket.on('add user',function(msg){
		u = {
				prevX:0,
				prevY:0,
				currX:0,
				currX:0,
				oriX:0,
  				oriy:0,
				flag:false,
				color:'black',
				draw_width:'2',
				pic:msg.pic		
			}
		users[socket.id]=u;
		socket.username = msg.name;
		console.log("new user:"+msg.name+" logged.");
		io.emit('add user',{
			'username':msg.name,
			'id':socket.id,
			'users':users
		});
		io.to(socket.id).emit('newuser_add', {src:BGsrc,wb:whiteboard,pdf:pdf_can,id:socket.id});
		if(Object.keys(users)[1]!=null) io.to(Object.keys(users)[0]).emit('askCurDraw',{target:socket.id});
	});

	//監聽新訊息事件
	socket.on('chat message', function(msg){

		console.log(socket.username+":"+msg);

  		//發佈新訊息
		io.emit('chat message', {
			username:socket.username,
			msg:msg,
			id:socket.id
		});
	});
	socket.on('addBG', function(src){
		BGsrc.push(src);
		io.emit('addBG',{
				src:src,
				num:BGsrc.length		
		})
	})
	socket.on('pdfinit', function(data){console.log("##############")
		io.emit('pdfinit',data)
	})
	socket.on('pdfaddpage', function(data){
		io.emit('pdfaddpage',data)
	})
	socket.on('pdfnextpage', function(){
		io.emit('pdfnextpage')
	})
	socket.on('pdfprevpage', function(){
		io.emit('pdfprevpage')
	})

	socket.on('changePDF', function(src){
		BGsrc.push(src);
		pdf_can.push(BGsrc.length);
		console.log(BGsrc.length)
		io.emit('changePDF',{
			src:src,
			can_num:BGsrc.length
		})
	})

	socket.on('WBchange', function(src){
		whiteboard = src
		io.emit('WBchange',src)
	})
	socket.on('clear_can', function(cur){
		io.emit('clear_can',cur)
	})
	socket.on('whichCanvas', function(num){
		io.emit('whichCanvas',num)
	})
	socket.on('giveCurDraw', function(data){console.log("giveCurDraw")
		io.to(data.target).emit('CurDraw',data)
	})

	//left
	socket.on('disconnect',function(){
		console.log(socket.username+" left.");
		io.emit('user left',{
			username:socket.username
		});
	});
	socket.on('down',function(pos){
		io.emit('down',{
			pos: pos,
			id: socket.id
		});
	});
	socket.on('move',function(pos){
		io.emit('move',{
			pos: pos,
			id: socket.id
		});
	});
	socket.on('up',function(pos){
		io.emit('up',{
			pos: pos,
			id: socket.id
		});
	});
	socket.on('out',function(pos){
		io.emit('out',{
			pos: pos,
			id: socket.id
		});
	});
	socket.on('color',function(color){
		io.emit('color',{
			color:color,
			id: socket.id
		});
	});

	socket.on('draw_width',function(dw){
		io.emit('draw_width',{
			draw_width:dw,
			id: socket.id
		});
	});

});

//指定port
http.listen(process.env.PORT || 3000/*,'192.168.43.150'*/, function(){
	console.log('listening on *:3000');
});
