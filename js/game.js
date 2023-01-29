"use strict";

//This is the latest version 14:16 . 
/*declaration of global variables*/
var canvas = document.getElementById("canvas");
var context = canvas.getContext("2d"); 
const WIDTH = canvas.width ;
const HEIGHT = canvas.height ;
var PICWIDTH = 100 ;  
var PICHEIGHT = 100  ;
if ( WIDTH < 500 ) {
    PICWIDTH = 50 ;
    PICHEIGHT = 50 ;
}
const MAXX = WIDTH - PICWIDTH ; 
const MAXY = HEIGHT - PICHEIGHT; 
var picNames = ["house", "duck", "girl", "yacht","square","circle"] ;
var picHistory = [] ; 
var counts = [0,0]; //stores round count and correct image count
var myImages = [];


/*function that starts game */
function startplaying() {
    var display = document.getElementById("gamepagefont");
    var playername = document.getElementById("playername").value;
    
    document.getElementById("game").classList.add("hide"); 
    document.getElementById("play").classList.remove("hide"); 
    display.textContent= "Hello " + playername + "!" ; 
}

//what happens at each round
function round(){
    var select =  picHistory[Math.floor(Math.random() * 3)] ; 
    document.getElementById("thisround").textContent = "click on picture of " + select.picName + "!";  
    canvas.addEventListener('click', function handle(evt) { detectclick(evt, select) ; } , {once: true} ) ; 
    counts[0]++
}


var button1 = document.getElementById("startgame");
button1.addEventListener("click", startplaying, false );  
button1.addEventListener("click", round, false);


var button2 = document.getElementById("round");
button2.addEventListener("click", function(){
          if (counts[0]<3){ 
              draw(context, myImages);
              round(); }
           else { alert("Your Score is: " + counts[1] + "/3") ;}   

}, false) ; 

//clears canvas
function clear(){
    context.clearRect(0,0,WIDTH,HEIGHT); 
}


/*prevents images and shapes from overlapping*/
function plsdontoverlap(picarray, x, y){
    for ( var i = 0 ; i < picarray.length ; i ++){
        if ((x >= picarray[i].xcoor) && (x <= picarray[i].xcoor+PICWIDTH))  {
            return true ;
        }
        if ((x < picarray[i].xcoor) && (x+PICWIDTH > picarray[i].xcoor)) {
            return true ;
        }
    }
    return false ; 
}
  

/*function that ensures pictures are not repeated in one round*/
function compare(array,val) {
    for ( var j = 0; j < array.length ; j++){
        if (array[j] == val) {
            return true
        }
    }
    return false
}

/*draws sqaure*/
function square(x,y){
    context.beginPath();
    context.fillStyle = "red";
    context.fillRect(x, y, PICWIDTH, PICHEIGHT);
    context.stroke();
}

/*draws circle*/
function circle(x,y){
    context.beginPath();
    context.arc(x + PICWIDTH/2 , y + PICWIDTH/2, PICWIDTH/2, 0, 2 * Math.PI);
    context.fillStyle = "blue";
    context.fill();
    context.stroke();
}

/*draws images in canvas, contains all drawing functions*/
function draw(context, myImages) {
    clear();
    var x = 0;
    var y = 0;
    var indexArray = [] ; 
    var index ; 
    var repeated ;

    for (var i = 0 ; i < 3 ; ++i) {    
       if (i > 0) { 
           do { 
            index = Math.floor(Math.random() * 6);
            repeated = compare(indexArray, index) ; 
           }
           while (repeated == true);

           do {
             x = Math.floor(Math.random()*MAXX);
             y = Math.floor(Math.random()*MAXY);
             console.log(x + " , " + y);
             var overlap = plsdontoverlap(picHistory,x,y);
             console.log(overlap);
           }
           while (overlap == true);
       }
       else { 
           index = Math.floor(Math.random() * 6); 
           x = Math.floor(Math.random()*MAXX);
           y = Math.floor(Math.random()*MAXY);
           console.log(x + " , " + y);
        }
       indexArray.push(index);
       if (index < 4 ) { 
         context.drawImage(myImages[index], 0,0, myImages[index].width, myImages[index].height, x, y , PICWIDTH , PICHEIGHT); 
       } 
       else if (index == 4){ square(x, y) ; }
       else { circle(x, y) ;}
       var thisPicture = {picName : picNames[index] , xcoor : x , ycoor : y};
       picHistory[i] = thisPicture ; 
       console.log(picHistory[i]) ;
       
       
    }
  }

/*checks clicked on coordinates are contained in image*/
function checkContained (x, y, pic) {
    console.log((x) + " " + y); 
    console.log("iamge " + pic.xcoor + " , " + pic.ycoor );
    return ((x >= pic.xcoor) && (x <= pic.xcoor+PICWIDTH ) && (y >= pic.ycoor) && (y <= pic.ycoor+PICHEIGHT));
}

/*return whether or not click was in the image*/ 
function detectclick(evt, theimage) {
    var pos = getMouseXY(evt);
    var answer = checkContained(pos.x, pos.y, theimage);
    if (answer){
         alert("correct Image");
         counts[1]++ ;
         }
    else { alert("Wrong Image");  }
}

function getMouseXY(e) {
    var canvas = document.getElementById('canvas');
    var boundingRect = canvas.getBoundingClientRect();
    var offsetX = boundingRect.left;
    var offsetY = boundingRect.top;
    var w = (boundingRect.width-canvas.width)/2;
    var h = (boundingRect.height-canvas.height)/2;
    offsetX += w;
    offsetY += h;
    // use clientX and clientY as getBoundingClientRect is used above
    var mx = Math.round(e.clientX-offsetX);
    var my = Math.round(e.clientY-offsetY);
    return {x: mx, y: my};
  }


/*loads images*/
function loadImages(context, filenames, callback) {
    var imageCount = 0;
    for (var i=0; i<filenames.length; ++i) {
      myImages[i] = new Image();
      myImages[i].onload = function() {
        imageCount++; 
        if (imageCount==filenames.length) callback(context, myImages);
      }
      myImages[i].src = filenames[i];
    }
  }

/*intialises and starts loading of images*/
function initAndStart(context) {
    //images have been refrenced in design documnet 
    var names = ["images/house.jpg", "images/duck.jpg", "images/girl.jpg", "images/yacht.jpg"];
    loadImages(context, names, draw);
  }

initAndStart(context);


