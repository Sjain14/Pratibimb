//p5.js shader basic structure ref from https://www.openprocessing.org/sketch/920144

var s1 = function (p) {
  // let faceapi;
  p.detections = [];
  p.update_finalex = 3;
  // let video;
  // let canvas;

  // var timer;

  // var countdown;

  p.setup = function () {
    p.canvas = p.createCanvas(480, 360);
    p.canvas.id("canvas");

    p.video = p.createCapture(p.VIDEO); // Create the video:
    p.video.id("video");
    p.video.size(p.width, p.height);

    p.faceOptions = {
      withLandmarks: true,
      withExpressions: true,
      withDescriptors: true,
      minConfidence: 0.5,
    };

    //Initialize the model Api call
    p.faceapi = ml5.faceApi(p.video, p.faceOptions, p.faceReady);

    p.timer = p.millis();
  };

  p.faceReady = function () {
    p.faceapi.detect(p.gotFaces);
    // p.setTimeout(p.faceapi.detect(p.gotFaces),1000);

    // Start detecting faces
  };

  p.gotFaces = function (error, result) {
    p.countdown = p.ceil(p.millis() / 1000);

    if (error) {
      p.console.log(error);
      return;
    }

    p.detections = result; //Now all the data in this detections:
    // console.log(detections);

    p.clear(); //Draw transparent background;:
    p.drawBoxs(p.detections); //Draw detection box:

    p.drawLandmarks(p.detections);
    // if (p.countdown%10 == 0){
    //// Draw all the face points:
    p.drawExpressions(p.detections, 20, 250, 14); //Draw face expression:
    // }
    // if (p.countdown%1 == 0){ //to slow the render to every 1 sec
    p.faceapi.detect(p.gotFaces); // Call the function again at here:
    // p.setTimeout(p.faceapi.detect(p.gotFaces),5000);
    // }

    //got facesz end
  };

  p.drawBoxs = function (detections) {
    detections = detections;
    if (detections.length > 0) {
      //If at least 1 face is detected:
      for (p.f = 0; p.f < detections.length; p.f++) {
        let { _x, _y, _width, _height } = detections[p.f].alignedRect._box;
        p.stroke(44, 169, 225);
        p.strokeWeight(1);
        p.noFill();
        p.rect(_x, _y, _width, _height);
        p.facex = _x;
        p.facey = _y;
      }
    }
  };

  p.drawLandmarks = function (detections) {
    if (detections.length > 0) {
      //If at least 1 face is detected:
      for (p.f = 0; p.f < detections.length; p.f++) {
        p.points = detections[p.f].landmarks.positions;
        for (p.i = 0; p.i < p.points.length; p.i++) {
          p.stroke(44, 169, 225);
          p.strokeWeight(3);
          p.point(p.points[p.i]._x, p.points[p.i]._y);
        }
      }
    }
  };

  p.drawExpressions = function (detections, x, y, textYSpace) {
    if (detections.length > 0) {
      //If at least 1 face is detected:
      let {
        neutral,
        happy,
        angry,
        sad,
        disgusted,
        surprised,
        fearful,
      } = detections[0].expressions;
      var arr = [neutral, happy, angry, sad, disgusted, surprised, fearful];
      p.textFont("Helvetica Neue");
      p.textSize(14);
      p.noStroke();
      p.fill(44, 169, 225);

      p.text("neutral:       " + p.nf(neutral * 100, 2, 2) + "%", x, y);
      p.text("happiness: " + p.nf(happy * 100, 2, 2) + "%", x, y + textYSpace);
      p.text(
        "anger:        " + p.nf(angry * 100, 2, 2) + "%",
        x,
        y + textYSpace * 2
      );
      p.text(
        "sad:            " + p.nf(sad * 100, 2, 2) + "%",
        x,
        y + textYSpace * 3
      );
      p.text(
        "disgusted: " + p.nf(disgusted * 100, 2, 2) + "%",
        x,
        y + textYSpace * 4
      );
      p.text(
        "surprised:  " + p.nf(surprised * 100, 2, 2) + "%",
        x,
        y + textYSpace * 5
      );
      p.text(
        "fear:           " + p.nf(fearful * 100, 2, 2) + "%",
        x,
        y + textYSpace * 6
      );

      p.text(p.countdown, x, y + textYSpace * 7);

      // p.console.log(dict)

      if (p.countdown % p.update_finalex == 0) {
        p.calfinalex(arr);
        // p.final = p.calcfinalex();
        // p.text(typeof p.final, x, y+textYSpace*8);
      }
    } else {
      //If no faces is detected:
      p.text("neutral: ", x, y);
      p.text("happiness: ", x, y + textYSpace);
      p.text("anger: ", x, y + textYSpace * 2);
      p.text("sad: ", x, y + textYSpace * 3);
      p.text("disgusted: ", x, y + textYSpace * 4);
      p.text("surprised: ", x, y + textYSpace * 5);
      p.text("fear: ", x, y + textYSpace * 6);
    }
  };

  p.calfinalex = function (arr) {
    // slowed the calculation of max to every 6 sec
    let maxKey,
      maxValue = 0;
    let secmaxKey,
      secmaxValue = 0;

    // p.print(arr)

    maxValue = Math.max.apply(null, arr); // get the max of the array
    maxKey = arr.indexOf(maxValue);

    // console.log(maxValue , maxKey)
    if (maxKey == 0) {
      if (maxValue >= 0.9) {
        p.finalex = maxKey;
      } else {
        arr.splice(maxKey, 1); // remove max from the array
        secmaxValue = Math.max.apply(null, arr); // get the 2nd max
        secmaxKey = arr.indexOf(secmaxValue);
        p.finalex = secmaxKey;
      }
    } else {
      p.finalex = maxKey;
    }
    console.log("finalex ", p.finalex);

    // return p.finalex
    // p.text(typeof p.finalex, x, y+textYSpace*8);
    // p.text( p.finalex, 0, 0);
  };
};

var myp51 = new p5(s1);

// timings Conmtrol
update_art_control = 5;
myp51.update_finalex = 3;

//colours for emotions

var colors1 = "d9f0ff-a3d5ff-83c9f4-6f73f2-7681e3-d9f0ff-a3d5ff-83c9f4-6f73f2-7681e3-FF4A4F"
  .split("-")
  .map((a) => "#" + a);
var colors2 = "331832-d81e5b-f0544f-c6d8d3-fdf0d5"
  .split("-")
  .map((a) => "#" + a);
var happycolor = "F90716-F76E11-FD004C-FFE400-FFA900"
  .split("-")
  .map((a) => "#" + a);
var angercolor = "3D0000-950101-171717-9D0B28-FF0000"
  .split("-")
  .map((a) => "#" + a);
var sadcolor = "133B5C-1B262C-1E5F74-353941-383838-066163"
  .split("-")
  .map((a) => "#" + a);
var disgustcolor = "446A46-82A284-82954B-614124-243D25"
  .split("-")
  .map((a) => "#" + a);
var suprisedcolor = "00FFDD-06FF00-FF5200-005F99-FF008E"
  .split("-")
  .map((a) => "#" + a);
var fearcolor = "711A75-46244C-1F1D36-4C0027-151515"
  .split("-")
  .map((a) => "#" + a);

var emotion_control = 1;
var follow_control = 0;

let theShader;
let colors = colors2;
const MAX_PARTICLE_COUNT = 250;
var particles = [];
function preload() {
  theShader = new p5.Shader(this.renderer, vert, frag);
}

function setup() {
  c = createCanvas(1000, 1000, WEBGL);
  noStroke();
  background(100);
  pixelDensity(1);
  // 	for(var i=0;i<5;i++){

  // 		particles.push({
  // 			p: createVector(width/2,height/2),
  // 			r: 10,
  // 			v: p5.Vector.random2D(),
  // 			color: color(random(colors))
  // 		})
  // 	}
  let mx = width / 2;
  let my = height / 2;
  // setTimeout(()=>{
  // 	save()
  // },5000)
}
let userControl = false;

// ## enable mouse control !!@!!!!!!
// function mouseMoved(){
// 	userControl = true
// }

function flatten(arr) {
  let passData = [];
  //flatten array data
  arr.forEach((a) => (passData = passData.concat(a)));
  return passData;
}
var attracting = false;
function draw() {
  let mx = width / 2;
  let my = height / 2;
  let pmx = mx;
  let pmy = my;
  // if (!userControl){

  let rr = width * 0.32 + width * 0.05 * sin(frameCount / 20);
  if (myp51.detections.length > 0) {
    //if at least 1 face

    if (follow_control) {
      mx = map(myp51.facex + rr, 0, 480 + 370, 0, 1000);
      my = map(myp51.facey + rr, 0, 360 + 370, 0, 1000);
    } else {
      mx = width / 2 + rr * cos(frameCount / 6);
      my = height / 2 + rr * sin(frameCount / 6);
    }
    // attracting = sin(frameCount/100)<0
    // attracting = false
  } else {
    // attracting = mouseIsPressed
    mx = width / 2 + rr * cos(frameCount / 6);
    my = height / 2 + rr * sin(frameCount / 6);
  }

  shader(theShader);
  theShader.setUniform("u_resolution", [width / 1000, height / 1000]);
  theShader.setUniform("u_time", millis() / 1000);
  theShader.setUniform("u_mouse", [mx / width, my / height]);
  let arr = particles.map((p) => [p.p.x / width, p.p.y / height, p.r / 10]);

  theShader.setUniform("particles", flatten(arr));
  let arr2 = particles.map((p) => [
    p.color._getRed() / 255,
    p.color._getGreen() / 255,
    p.color._getBlue() / 255,
  ]);

  theShader.setUniform("colors", flatten(arr2));
  theShader.setUniform("tex0", c);

  for (var i = 0; i < 2; i++) {
    particles.push({
      p: createVector(mx, my),
      r: random(5, 20),
      v: p5.Vector.random2D()
        .mult(random(8))
        .add(createVector(mx - pmx, my - pmy).limit(5)),
      color: color(random(colors)),
      atFactor: random(0.5, 2),
    });
  }
  particles = particles.slice(-MAX_PARTICLE_COUNT);
  particles.forEach((p) => {
    p.r *= 0.98;
    p.p.add(p.v);
    p.v.mult(0.995);
    // ellipse(p.p.x,p.p.y,10)
    if (attracting) {
      p.v.add(createVector(mx, my).sub(p.p).limit(p.atFactor));
    }
  });
  particles = particles.filter((p) => p.r > 0.05);
  rect(-width / 2, -height / 2, width, height);
}

// function mousePressed(){
// 	colors = colors===colors1?suprisedcolor:colors1;
// }

function keyTyped() {
  if (key === "1") {
    colors = colors1;
    attracting = false;
  } else if (key === "2") {
    colors = happycolor;
    attracting = false;
  } else if (key === "3") {
    colors = angercolor;
    attracting = true;
  } else if (key === "4") {
    colors = sadcolor;
    attracting = false;
  } else if (key === "5") {
    colors = disgustcolor;
    attracting = false;
  } else if (key === "6") {
    colors = suprisedcolor;
    attracting = true;
  } else if (key === "7") {
    colors = fearcolor;
    attracting = false;
  } else if (key === "s") {
    saveCanvas(c, "myCanvas", "png"); //save SS
  }
    
  // uncomment to prevent any default behavior
  // return false;
}

//update art work emotion every 5 seconds

setInterval(updateart, 5000);

function updateart() {
  if (emotion_control) {
    ex = myp51.finalex;
    console.log("ex", ex, emotion_control);
    if (ex == 0) {
      colors = colors1;
      attracting = false;
    } else if (ex == 1) {
      colors = happycolor;
      attracting = false;
    } else if (ex == 2) {
      colors = angercolor;
      attracting = true;
    } else if (ex == 3) {
      colors = sadcolor;
      attracting = false;
    } else if (ex == 4) {
      colors = disgustcolor;
      attracting = false;
    } else if (ex == 5) {
      colors = suprisedcolor;
      attracting = true;
    } else if (ex == 6) {
      colors = fearcolor;
      attracting = false;
    }
  }

  // textFont('Helvetica Neue');
  // textSize(14);
  // fill(50)
  // text("ex:".concat(ex,"  emocntl:",emotion_control) , 2000,1750)
  console.log("ex:".concat(ex, "  emocntl:", emotion_control));
}

//give and take emotioncontrol
function keyPressed() {
  if (keyCode === CONTROL) {
    emotion_control = 1;
  } else if (keyCode === ALT) {
    emotion_control = 0;
  } else if (keyCode === ENTER) {
    updateart();
  } else if (keyCode === TAB) {
    follow_control = 1;
  } else if (keyCode === ESCAPE) {
    follow_control = 0;
  }
}

//   else{
//     // console.log("emotion restricted " , emotion_control)
//     colors = colors2;
//     attracting = false;
//   }
