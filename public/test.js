
      var socket = io();
      $(document).ready(function(){

//--------------------------chao
  var modal = document.getElementById('myModal');

// Get the image and insert it inside the modal - use its "alt" text as a caption
var sub = document.getElementById("submit");
var modalImg = document.getElementById("img01");
var modalImg1 = document.getElementById("img02");
var modalImg2 = document.getElementById("img03");
var modalImg3 = document.getElementById("img04");
var captionText = document.getElementById("caption");
var name;
var myID;
var profile = "";
    modal.style.display = "block";
    modalImg.src = 'pics/1.png';
    modalImg1.src = "pics/2.png";
    modalImg2.src = 'pics/3.png';
    modalImg3.src = "pics/4.png";
    img01.onclick=function(){
        profile=this.src;
        document.getElementById("img01").style.border="2px solid #FFFFFF";
        document.getElementById("img02").style.border="none";
        document.getElementById("img03").style.border="none";
        document.getElementById("img04").style.border="none";
        console.log(profile);
    }
    img02.onclick=function(){
        profile=this.src;
        document.getElementById("img02").style.border="2px solid #FFFFFF";
        document.getElementById("img01").style.border="none";
        document.getElementById("img03").style.border="none";
        document.getElementById("img04").style.border="none";
        console.log(profile);
    }
    img03.onclick=function(){
        profile=this.src;
        document.getElementById("img03").style.border="2px solid #FFFFFF";
        document.getElementById("img01").style.border="none";
        document.getElementById("img02").style.border="none";
        document.getElementById("img04").style.border="none";
        console.log(profile);
    }
    img04.onclick=function(){
        profile=this.src;
        document.getElementById("img04").style.border="2px solid #FFFFFF";
        document.getElementById("img01").style.border="none";
        document.getElementById("img02").style.border="none";
        document.getElementById("img03").style.border="none";
        console.log(profile);
    }
    //captionText.innerHTML = this.alt;
    sub.onclick=function() {
    name = document.getElementById("myInput").value;
    
    document.getElementById("myInput").value = "";
        users = {};
        if(name=="" || name==null){
          name = "guest";
        }
        
        modal.style.display="none";
        if (profile=="" || profile==null){
            profile="pics/2.png";
        }
	socket.emit("add user",{"name":name,"pic":profile});
    }
    $("#PDF").mouseover(function () {
        $("#PDFoverlay").css('opacity','0.5');
    }).mouseleave(function () {
        $("#PDFoverlay").css('opacity','1');
    })
    $("#photo").mouseover(function () {
        $("#photooverlay").css('opacity','0.5');
    }).mouseleave(function () {
        $("#photooverlay").css('opacity','1');
    })

//------------------------

		canvas1 = document.getElementById('1');
    	drawmode = 'pen'
		pdfDocs = {}
	    prevCanvas = []
		pdf_can=[]
		prevPdfCanvas = {}
		current_canvas = 1;
        w = canvas1.width;
        h = canvas1.height;
		init(canvas1,1)
        //var name = prompt("請輸入暱稱","guest");
		users = {};
        if(name=="" || name==null){
          name = "guest";
        }
		
		
        //tell server
        //socket.emit("add user",name);

        //監聽新訊息事件
         socket.on('chat message', function(data){console.log(myID,data.id)
          if(myID!=data.id)appendOtherMessage(data.username,data.msg,users[data.id].pic);
          else appendMyMessage(data.username,data.msg);
          
          //appendMessage(data.username+":"+data.msg);
        });

        socket.on('add user',function(data){console.log(myID,data.id)
					users=data.users;
            //if(data.username==name) myID=data.id;
          
          //appendMessage(data.username+"已加入");
        });

        socket.on('user left',function(data){
          //appendMessage(data.username+"已離開");
        });
		socket.on('whichCanvas',function(num){
          whichCanvas(num)
        });
		socket.on('WBchange',function(data){
          document.getElementById("whiteboard").value = data
        });

		socket.on('clear_can',function(cur){ //clear function
			var ctx_ = document.getElementById(cur.toString()).getContext('2d');
			ctx_.clearRect(0,0,w,h)
			prevCanvas[cur] = ''
        });
        //$('#whiteboard').change(function(){console.log("change!!")})
		jQuery('#whiteboard').on('input propertychange paste',function(){//if wb changed
			data = document.getElementById("whiteboard").value
			socket.emit('WBchange',data);
		})
        $('#send').click(function(){
          var text = $('#m').val();
          socket.emit('chat message', text);
          $('#m').val('');
          return false;
        });

        $("#m").keydown(function(event){
          if ( event.which == 13 ){
            $('#send').click();
          }
        });
		socket.on('color',function(data){
			var u = users[data.id]
			u.color = data.color
		})
		socket.on('draw_width',function(data){
			var u = users[data.id]
			u.draw_width = data.draw_width
		})
		socket.on('changeBG',function(data){
			 $('#1').css("background-image",data.src);
			 document.getElementById("whiteboard").value = data.wb
		})

		socket.on('changePDF',function(data){
			pdf_can.push(data.can_num)
            //$('#can').css({"background-image":data.src, "background-size":"contain", "background-repeat":"no-repeat"});
            src = showPDF(data.src,data.can_num);

        })


		socket.on('addBG',function(data){console.log('addBG',data.num)
			addBG(data.num,data.src)
		})
		function addBG(num, src){ // add one new bg
			console.log("addBG",num)
			if (num!=1){
				var new_can = document.createElement('canvas')
				new_can.id = num.toString()
				new_can.className = "canvases";
				new_can.width = 1000;
				new_can.height = 1600;
				//width="1000" height="1600" 
				new_can.style.backgroundImage = 'url('+src+')';
				new_can.style.display = "none";
				init(new_can,num)
				document.getElementById("canvas_div").appendChild(new_can)
			}
			if(num == 1 && pdf_can.indexOf(num)==-1){	console.log("firstcanvas")
				$('#1').css("background-image",'url('+src+')');
			}
			if(num!=1) total_canvas ++
			var BGs = document.getElementById('BGs') 
			var bgimg = document.createElement('img')
			bgimg.src = src
			bgimg.height = 50
            bgimg.className = "bgimg"
			bgimg.onclick = function(){
				socket.emit('whichCanvas',num)
			}
			whichCanvas(num)
			BGs.appendChild(bgimg);
			current_canvas = num;

		}

		function whichCanvas(num){ //upon click on the small images
			console.log('whichcanvas',num+'/'+total_canvas)
			for (j=1;j<=total_canvas;j++){
				document.getElementById(j.toString()).style.display="none";
			}
			var toshow = document.getElementById(num.toString())
			toshow.style.display="";
			current_canvas = num;
			if(pdf_can.indexOf(num)!=-1) {
				document.getElementById('page').style.display=''
				document.getElementById('page_count').textContent = pdfDocs[num].data.numPages
				document.getElementById('page_num').textContent = pdfDocs[num].page_num;
			}
			else document.getElementById('page').style.display='none'
		}
		socket.on('newuser_add',function(data){ // for new user, add canvas and bgs
			console.log("newadd")
            myID=data.id
			for (i=1;i<=data.src.length;i++){console.log(i)
				if(data.pdf.indexOf(i)==-1) addBG(i,data.src[i-1])
				else {
					pdf_can.push(i)
					showPDF(data.src[i-1], i)
					
				}
			}
			document.getElementById("whiteboard").value = data.wb
		})
		
		socket.on('askCurDraw',function(data){	//for new user
			console.log("askcurr begin")
			var srcCanvas = []
			for (i=1;i<=total_canvas;i++){
				srcCanvas.push(document.getElementById(i.toString()).toDataURL());
			}
			console.log("askcurr begin emit")
			console.log(pdfDocs)
			socket.emit('giveCurDraw',{'target':data.target,
										'srcCanvas': srcCanvas,
										'pdfdocs':pdfDocs,
										'currcan':current_canvas
			})
			console.log("askcurr over")
        });
		socket.on('CurDraw',function(data){console.log("cur",data.srcCanvas.length)
			pdfdocs = data.pdfdocs
			for (i=1;i<=data.srcCanvas.length;i++){	//for new user, draw current paints 
				var img = new Image();
				img.src = data.srcCanvas[i-1]
				document.getElementById(i.toString()).getContext('2d').drawImage(img,0,0)
			}
			whichCanvas(data.currcan)
        });
		socket.on('down',function(data){
			findxy('down', data.pos, data.id, data.pos.can);
		})
		socket.on('move',function(data){
 			findxy('move', data.pos, data.id, data.pos.can);

		})
		socket.on('up',function(data){
			findxy('up', data.pos,data.id, data.pos.can);
		})
		socket.on('out',function(data){
			findxy('out', data.pos,data.id, data.pos.can);
		})
		
	/*
		$('#Iframe').scroll(function(){console.log("!!!")
		
		var poss = Iframe.document.body.scrollLeft;
		console.log("@@@")
		});*/
	
         function appendMessage(msg){
          $('#messages').append($('<li>').text(msg));
          var message = document.getElementById("message_block");
          message.scrollTop = message.scrollHeight;

        }

        function appendOtherMessage(username,msg,other_pic){
          $('#messages').append('<li><div style="width:50%;"><img style="align:left;" id="profile; padding-right:20px;" src="'+other_pic+'" width="15%" height="15%"><span style="position:relative;bottom:10px;left:8px;font-size:15px;color:gray">'+username+'</span><br><div id="OtherMessage">'+msg+'</div></div></li>');
          //$('#messages').append('<li><img src="' + msg + '" /></li>');
          var message = document.getElementById("message_block");
          message.scrollTop = message.scrollHeight;

        }

        function appendMyMessage(username,msg){
          $('#messages').append('<li ><div align="right"><div class="MessageBG"><span id="MyMessage">'+msg+'</span></div></div></li>');
          //$('#messages').append('<li><img src="' + msg + '"  /></li>');
          var message = document.getElementById("message_block");
          message.scrollTop = message.scrollHeight;

        }

        function appendMember(username,src){
            $('#members').append('<img src="'+src+'" width="7%" height="7%"/>')
        }
      });
    var canvas, ctx, flag = false,
        prevX = 0,
        currX = 0,
        prevY = 0,
        currY = 0,
        dot_flag = false;

    var x = "black",		
        y = 2;
	function  getMousePos(canvas, evt) {
  		var rect = canvas.getBoundingClientRect(), // abs. size of element
      		scaleX = canvas.width / rect.width,    // relationship bitmap vs. element for X
      		scaleY = canvas.height / rect.height;  // relationship bitmap vs. element for Y

  			return {
    			x: (evt.clientX - rect.left) * scaleX,   // scale mouse coordinates after they have
    			y: (evt.clientY - rect.top) * scaleY     // been adjusted to be relative to element
  			}
	}
    function init(canvas,which) {
//leo
		canvas2 = document.getElementById('can2');
        ctx2 = canvas2.getContext("2d");

		var ctx = canvas.getContext('2d')
		if(pdf_can.indexOf(which)!=-1) prevPdfCanvas[which]=[]
		prevCanvas.push(canvas.toDataURL());
        canvas.addEventListener("mousemove", function (e) {
			mousePos = getMousePos(canvas, e)
			if (drawmode == 'pen'){ $("canvas").css({"cursor": 'url("rsz_pencil2.png") 0 60,auto'});}
			if (drawmode == 'rect' || drawmode == 'circle') canvas.style.cursor = 'cell'
			if (drawmode == 'marker'){ $("canvas").css({"cursor": 'url("marker.png") 0 120,auto'});}
			if (drawmode == 'eraser'){ $("canvas").css({"cursor": 'url("eraser.png") 0 100,auto'});}
			
            //findxy('move', e)
			//console.log(e.clientX-canvas.offsetLeft,e.clientY- canvas.offsetTop)
			socket.emit('move',{X:mousePos.x,Y:mousePos.y, mode:drawmode, can:which});
        }, false);
        canvas.addEventListener("mousedown", function (e) {
			mousePos = getMousePos(canvas, e)
			
			socket.emit('down',{X:mousePos.x,Y:mousePos.y,mode:drawmode, can:which});
        }, false);
        canvas.addEventListener("mouseup", function (e) {
			mousePos = getMousePos(canvas, e)
            //findxy('up', e)
			socket.emit('up',{X:mousePos.x,Y:mousePos.y, can:which});
        }, false);
        canvas.addEventListener("mouseout", function (e) {
			mousePos = getMousePos(canvas, e)
            //findxy('out', e)
			socket.emit('out',{X:mousePos.x,Y:mousePos.y, can:which});
        }, false);
//leo
	        document.getElementById('download').addEventListener('click', function() {
            downloadCanvas(this, current_canvas, 'can2', 'test.png');
        }, false);
    }
//leo
	var img1 = '';
    var img2 = '';

    function downloadCanvas(link, canvasId, canvasId2, filename) {
        //var img = document.getElementById(canvasId).toDataURL('image/png');
        var imgwidth = 0;
        var imgheight = 0;
        if (img1 !== ''){
            console.log('img1 not empty')
            if (img1.width/img1.height >= w/h){
                imgwidth = w;
                imgheight = w/img1.width*img1.height;
            }
            else {
                imgheight = h;
                imgwidth = h/img1.height*img1.width;
            }

            ctx2.drawImage(img1, 0, 0, imgwidth, imgheight);
        }
        img2 = document.getElementById('canvasdownload');
        img2.src = document.getElementById(canvasId).toDataURL("image/png");
        ctx2.drawImage(img2, 0, 0);
        //base_image = new Image();
        //base_image.src = data.src;
        //base_image.onload = function(){
        //console.log(data)
        //    ctx.drawImage(data, 0, 0);
        //}
        //ctx.drawImage('<img src="'+data.src+'"/>',0,0);

        link.href = document.getElementById(canvasId2).toDataURL("image/png");
        console.log(link)
        link.download = filename;
        //document.write('<img src="'+img+'"/>');
    }

	
	function DrawMode(mode){
		drawmode = mode;
        document.getElementById('rect').style.border="none";
        document.getElementById('circle').style.border="none";
        document.getElementById('pen').style.border="none";
        document.getElementById('marker').style.border="none";
        document.getElementById('eraser').style.border="none";
        document.getElementById(mode).style.border="2px solid gray";
	}
    
    function color(obj) {
        switch (obj.id) {
            case "green":
                socket.emit('color','green');
                break;
            case "blue":
                socket.emit('color','blue');
                break;
            case "red":
                socket.emit('color','red');
                break;
            case "yellow":
                socket.emit('color','yellow');
                break;
            case "orange":
                socket.emit('color','orange');
                break;
            case "black":
                socket.emit('color','black');
                break;
            case "white":
                socket.emit('color','white');
                break;
            case "indigo":
                socket.emit('color','indigo');
                break;
            case "violet":
                socket.emit('color','#33ccff');
                break;
            case "brown":
                socket.emit('color','brown');
                break;
            case "pink":
                socket.emit('color','pink');
                break;
            case "gray":
                socket.emit('color','gray');
                break;
        }
        document.getElementById('green').style.border="none";
        document.getElementById('blue').style.border="none";
        document.getElementById('red').style.border="none";
        document.getElementById('yellow').style.border="none";
        document.getElementById('orange').style.border="none";
        document.getElementById('black').style.border="none";
        document.getElementById('white').style.border="1px solid gray";
        document.getElementById('indigo').style.border="none";
        document.getElementById('violet').style.border="none";
        document.getElementById('pink').style.border="none";
        document.getElementById('gray').style.border="none";
        document.getElementById('brown').style.border="none";
        if (obj.id == 'gray') {
            document.getElementById(obj.id).style.border = "2px solid #494949";
        } else {
            document.getElementById(obj.id).style.border="2px solid gray";
        }
    }

	function draw_width(num,b) {
        socket.emit('draw_width',num)
        document.getElementById('thick1').style.opacity="1";
        document.getElementById('thick2').style.opacity="1";
        document.getElementById('thick3').style.opacity="1";
        document.getElementById('thick4').style.opacity="1";
        b.style.opacity="0.5";
    }
    
    function draw(u,ctx,can_num) {
        ctx.beginPath();
		//console.log([u.prevX, u.prevY],[u.currX, u.currY])
        ctx.moveTo(u.prevX, u.prevY);
        ctx.lineTo(u.currX, u.currY);
        ctx.strokeStyle = u.color;
        ctx.lineWidth = u.draw_width;
        ctx.stroke();
        ctx.closePath();
    }

	function draw_rect(u,ctx,can_num) {
        ctx.beginPath();
		ctx.clearRect(0,0,w,h)
		var img = new Image();
			if(pdf_can.indexOf(can_num)!=-1) img.src = prevPdfCanvas[can_num][pdfDocs[can_num].page_num]
			else img.src = prevCanvas[can_num]
		ctx.drawImage(img,0,0);
        ctx.rect(u.oriX,u.oriY,u.currX-u.oriX,u.currY-u.oriY)
        ctx.strokeStyle = u.color;
        ctx.lineWidth = u.draw_width;
        ctx.stroke();
        ctx.closePath();
    }
	function draw_marker(u,ctx,can_num) {
         ctx.beginPath();
		//console.log([u.prevX, u.prevY],[u.currX, u.currY])
        ctx.moveTo(u.prevX, u.prevY);
        ctx.lineTo(u.currX, u.currY);
        ctx.strokeStyle = "rgba(255,255,0,0.5)"
        ctx.lineWidth = 20;
        ctx.stroke();
        ctx.closePath();
    }
 	function draw_cir(u,ctx,can_num) {
        ctx.beginPath();
		ctx.clearRect(0,0,w,h)
		var img = new Image();
			if(pdf_can.indexOf(can_num)!=-1) img.src = prevPdfCanvas[can_num][pdfDocs[can_num].page_num]
			else img.src = prevCanvas[can_num]
		ctx.drawImage(img,0,0);
//        ctx.arc(u.oriX, u.oriY, Math.sqrt(Math.pow(u.currX-u.oriX,2)+Math.pow(u.currY-u.oriY,2)), 0, Math.PI*2, true);
        ctx.ellipse((u.oriX+u.currX)/2, (u.oriY+u.currY)/2, Math.abs(u.currX-u.oriX)/2,Math.abs(u.currY-u.oriY)/2, 0, 0, Math.PI*2, true);
        ctx.strokeStyle = u.color;
        ctx.lineWidth = u.draw_width;
        ctx.stroke();
        ctx.closePath();
    }
    
    function draw_eraser(u,ctx,can_num) {
		
        ctx.clearRect(u.currX-10,u.currY-10,30,30)

    }

	function clear_can() {
		socket.emit('clear_can',current_canvas)
    }
    
    function save() {
        document.getElementById("canvasimg").style.border = "2px solid";
        var dataURL = canvas.toDataURL();
        document.getElementById("canvasimg").src = dataURL;
        document.getElementById("canvasimg").style.display = "inline";
    }
    
    function findxy(res, pos, id, can_num) {
		var canvas = document.getElementById(can_num.toString())
		var ctx = canvas.getContext('2d')
		var u = users[id]
        if (res == 'down') {
			u.oriX = pos.X;
			u.oriY = pos.Y;
            u.prevX = u.currX;
            u.prevY = u.currY;
            u.currX = pos.X ;
            u.currY = pos.Y ;
            u.flag = true;
            u.dot_flag = true;
            if (u.dot_flag && pos.mode == 'pen') {
                ctx.beginPath();
                ctx.fillStyle = u.color;
                ctx.fillRect(u.currX, u.currY, 2, 2);
                ctx.closePath();
                u.dot_flag = false;
            }
        }
        if (res == 'up' || res == "out") {
            u.flag = false;
			if(pdf_can.indexOf(can_num)!=-1) prevPdfCanvas[can_num][pdfDocs[can_num].page_num] = canvas.toDataURL();
			else prevCanvas[can_num] = canvas.toDataURL();
			
        }
		if (res == 'move'){
		    if (pos.mode == 'pen') {
		        if (u.flag) {
		            u.prevX = u.currX;
		            u.prevY = u.currY;
		            u.currX = pos.X ;
		            u.currY = pos.Y ;
		            draw(u,ctx,can_num);
		        }
		    }

			if (pos.mode == 'rect') {
		        if (u.flag) {
		            u.prevX = u.currX;
		            u.prevY = u.currY;
		            u.currX = pos.X ;
		            u.currY = pos.Y ;
		            draw_rect(u,ctx,can_num);
		        }
		    }
			if (pos.mode == 'circle') {
		        if (u.flag) {
		            u.prevX = u.currX;
		            u.prevY = u.currY;
		            u.currX = pos.X ;
		            u.currY = pos.Y ;
		            draw_cir(u,ctx,can_num);
		        }
		    }
			if (pos.mode == 'eraser') {
		        if (u.flag) {
		            u.prevX = u.currX;
		            u.prevY = u.currY;
		            u.currX = pos.X ;
		            u.currY = pos.Y ;
		            draw_eraser(u,ctx,can_num);
		        }
		    }
			if (pos.mode == 'marker') {
		        if (u.flag) {
		            u.prevX = u.currX;
		            u.prevY = u.currY;
		            u.currX = pos.X ;
		            u.currY = pos.Y ;
		            draw_marker(u,ctx,can_num);
		        }
		    }
		}
    }

    function readURL(input) {
            if (input.files && input.files[0]) {
                var reader = new FileReader();

                reader.onload = function (e) {

					socket.emit('addBG',e.target.result);

					img1 = document.getElementById("background");
                    img1.src = e.target.result;
                   // $('#can')
                   //     .css("background-image","url("+e.target.result+")");
                };

                reader.readAsDataURL(input.files[0]);
            }
        }
//leo
 function readPdfURL(input) {
            if (input.files && input.files[0]) {
                var reader = new FileReader();

                reader.onload = function (e) {

                    socket.emit('changePDF', e.target.result);
					//showPDF(data.src,data.can_num);
                    img1 = document.getElementById("background");
                    img1.src = e.target.result;
                   // $('#can')
                   //     .css("background-image","url("+e.target.result+")");
                };

                reader.readAsDataURL(input.files[0]);
            }
        }




