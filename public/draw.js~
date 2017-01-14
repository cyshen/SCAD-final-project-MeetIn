function draw = (){
	this.find = function (res, pos, u, ctx) {

        if (res == 'down') {
			u.oriX = pos.X;
			u.oriY = pos.Y;
            u.prevX = u.currX;
            u.prevY = u.currY;
            u.currX = pos.X ;
            u.currY = pos.Y ;
            u.flag = true;
            u.dot_flag = true;
            if (u.dot_flag) {
                ctx.beginPath();
                ctx.fillStyle = u.color;
                ctx.fillRect(u.currX, u.currY, 2, 2);
                ctx.closePath();
                u.dot_flag = false;
            }
        }
        if (res == 'up' || res == "out") {
            u.flag = false;
			prevCanvas = canvas.toDataURL();
			
        }

        if (res == 'move') {
            if (u.flag) {
                u.prevX = u.currX;
                u.prevY = u.currY;
                u.currX = pos.X ;
                u.currY = pos.Y ;
                //draw(u);
            }
        }

		if (res == 'rect') {
            if (u.flag) {
                u.prevX = u.currX;
                u.prevY = u.currY;
                u.currX = pos.X ;
                u.currY = pos.Y ;
                draw_rect(u,ctx);
            }
        }
    }

	function draw_rect(u,ctx) {
        ctx.beginPath();
 		x_sign = (u.prevX-u.oriX>0) ? 1:-1
		y_sign = (u.prevY-u.oriY>0) ? 1:-1
		ctx.clearRect(0,0,w,h)
		var img = new Image();
			img.src = prevCanvas
		ctx.drawImage(img,0,0);
        ctx.rect(u.oriX,u.oriY,u.currX-u.oriX,u.currY-u.oriY)
        ctx.strokeStyle = u.color;
        ctx.lineWidth = y;
        ctx.stroke();
        ctx.closePath();
    }


}

module.exports = new draw()
