//var colors = ["#B8D430", "#3AB745", "#029990", "#3501CB",
//               "#2E2C75", "#673A7E", "#CC0071", "#F80120",
//               "#F35B20", "#FB9A00", "#FFCC00", "#FEF200"];
//var colors = ["

var ctx;
var startAngle = 0;

function spin(wheelItems,segmentCount) 
{
  spinAngleStart = Math.random() * 10 + 10;
  spinTime = 0;
  spinTimeTotal = 8000;
  rotateWheel(wheelItems, segmentCount);
}

function shuffleList(wheelItems)
{
	wheelItems = shuffle(wheelItems);
	drawRouletteWheel(wheelItems);
	
	if(sessionStorage)
	{
		sessionStorage.setItem("wheelList",JSON.stringify(wheelItems));
	}
	return wheelItems;
}


shuffle = function(o){ //v1.0
	for(var j, x, i = o.length; i; j = parseInt(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
	return o;
};

function drawRouletteWheel(wheelItems) 
{  
  var segmentCount = wheelItems.length
  var arc = Math.PI / (segmentCount/2);
  var canvas = document.getElementById("canvas");
  if (canvas.getContext) {
     var outsideRadius = 200;
    var textRadius = 160;
    var insideRadius = 125;
    
    ctx = canvas.getContext("2d");
    ctx.clearRect(0,0,500,500);        
    ctx.strokeStyle = "black";
    ctx.lineWidth = 2;
    
    ctx.font = 'bold 12px Helvetica, Arial';	
    
    for(var i = 0; i < segmentCount; i++) {
      var angle = startAngle + i * arc;
      ctx.fillStyle = "white";
      
      ctx.beginPath();
      ctx.arc(250, 250, outsideRadius, angle, angle + arc, false);
      ctx.arc(250, 250, insideRadius, angle + arc, angle, true);
      ctx.stroke();
      ctx.fill();
      
      ctx.save();
      ctx.shadowOffsetX = -1;
      ctx.shadowOffsetY = -1;
      ctx.shadowBlur    = 0;
      ctx.shadowColor   = "rgb(220,220,220)";
      ctx.fillStyle = "black";
      ctx.translate(250 + Math.cos(angle + arc / 2) * textRadius, 
                    250 + Math.sin(angle + arc / 2) * textRadius);
      ctx.rotate(angle + arc / 2 + Math.PI / 2);
      var text = wheelItems[i];
      ctx.fillText(text, -ctx.measureText(text).width / 2, 0);
      ctx.restore();
    }
	
	 //Arrow
    ctx.fillStyle = "black";
    ctx.beginPath();
    ctx.moveTo(250 - 4, 250 - (outsideRadius + 5));
    ctx.lineTo(250 + 4, 250 - (outsideRadius + 5));
    ctx.lineTo(250 + 4, 250 - (outsideRadius - 5));
    ctx.lineTo(250 + 9, 250 - (outsideRadius - 5));
    ctx.lineTo(250 + 0, 250 - (outsideRadius - 13));
    ctx.lineTo(250 - 9, 250 - (outsideRadius - 5));
    ctx.lineTo(250 - 4, 250 - (outsideRadius - 5));
    ctx.lineTo(250 - 4, 250 - (outsideRadius + 5));
    ctx.fill();
  }
}

function rotateWheel(wheelItems, segmentCount) 
{
 var arc = Math.PI / (segmentCount/2);
  spinTime += 30;
  if(spinTime >= spinTimeTotal) {
    stopRotateWheel(wheelItems, arc);
    return;
  }
  var spinAngle = spinAngleStart - easeOut(spinTime, 0, spinAngleStart, spinTimeTotal);
  startAngle += (spinAngle * Math.PI / 180);
  drawRouletteWheel(wheelItems);
  spinTimeout = setTimeout(function(){rotateWheel(wheelItems,segmentCount);}, 30);
}

function stopRotateWheel(wheelItems,arc) 
{
  clearTimeout(spinTimeout);
  var degrees = startAngle * 180 / Math.PI + 90;
  var arcd = arc * 180 / Math.PI;
  var index = Math.floor((360 - degrees % 360) / arcd);
  ctx.save();
  ctx.font = 'bold 30px Helvetica, Arial';
  var text = wheelItems[index];
  ctx.fillText(text, 250 - ctx.measureText(text).width / 2, 250 + 10);
  ctx.restore();
}

function easeOut(t, b, c, d) 
{
  var ts = (t/=d)*t;
  var tc = ts*t;
  return b+c*(tc + -3*ts + 3*t);
}