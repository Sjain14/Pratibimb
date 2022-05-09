//p5.js shader basic structure ref from https://www.openprocessing.org/sketch/920144
var colors1 = "d9f0ff-a3d5ff-83c9f4-6f73f2-7681e3-d9f0ff-a3d5ff-83c9f4-6f73f2-7681e3-FF4A4F".split("-").map(a=>"#"+a)
var colors2 = "331832-d81e5b-f0544f-c6d8d3-fdf0d5".split("-").map(a=>"#"+a);
var happycolor = "F90716-F76E11-FD004C-FFE400-FFA900".split("-").map(a=>"#"+a);
var angercolor = "3D0000-950101-171717-9D0B28-FF0000".split("-").map(a=>"#"+a);
var sadcolor = "133B5C-1B262C-1E5F74-353941-383838-066163".split("-").map(a=>"#"+a);
var disgustcolor = "446A46-82A284-82954B-614124-243D25".split("-").map(a=>"#"+a);
var suprisedcolor = "00FFDD-06FF00-FF5200-005F99-FF008E".split("-").map(a=>"#"+a);
var fearcolor = "711A75-46244C-1F1D36-4C0027-151515".split("-").map(a=>"#"+a);

let theShader;
let colors = colors1;
const MAX_PARTICLE_COUNT = 250;
var particles = []
function preload(){
	theShader = new p5.Shader(this.renderer,vert,frag)
}

function setup() {
	c = createCanvas(1000,1000,WEBGL);
	noStroke()
	background(100);
	pixelDensity(1)
// 	for(var i=0;i<5;i++){

// 		particles.push({
// 			p: createVector(width/2,height/2),
// 			r: 10,
// 			v: p5.Vector.random2D(),
// 			color: color(random(colors))
// 		})
// 	}
	mouseX = width/2
	mouseY = height/2
	// setTimeout(()=>{
	// 	save()
	// },5000)
}
let userControl = false

// ## enable mouse control !!@!!!!!!
// function mouseMoved(){
// 	userControl = true
// }

function flatten(arr){

	let passData = []
	//flatten array data
	arr.forEach(a=>passData=passData.concat(a)) 
	return passData
}
var attracting = false
function draw() {
	if (!userControl){
		let rr = width*0.32+ width*0.05*sin(frameCount/20)
		pmouseX = mouseX
		pmouseY = mouseY
		mouseX = width/2+rr*cos(frameCount/6)
		mouseY = height/2+rr*sin(frameCount/6)
		// attracting = sin(frameCount/100)<0
		// attracting = false
	}else{
		attracting = mouseIsPressed
	}

	shader(theShader)
	theShader.setUniform('u_resolution',[width/1000,height/1000])
	theShader.setUniform('u_time',millis()/1000)
	theShader.setUniform('u_mouse',[mouseX/width,mouseY/height])
	let arr = particles.map(p=>[
		p.p.x/width,
		p.p.y/height,
		p.r/10
	])
	
	theShader.setUniform('particles',flatten(arr))
	let arr2 = particles.map(p=>[
		p.color._getRed()/255,
		p.color._getGreen()/255,
		p.color._getBlue()/255
	])
	
	theShader.setUniform('colors',flatten(arr2))
	theShader.setUniform('tex0',c)
	
	for(var i=0;i<2;i++){
		particles.push({
			p: createVector(mouseX,mouseY),
			r: random(5,20),
			v: p5.Vector.random2D().mult(random(8)).add(
				createVector(mouseX-pmouseX,mouseY-pmouseY).limit(5)
			),
			color:  color(random(colors)),
			atFactor: random(0.5,2)
		})
	}
	particles = particles.slice(-MAX_PARTICLE_COUNT)
	particles.forEach(p=>{
		p.r*=0.98
		p.p.add(p.v)
		p.v.mult(0.995)
		// ellipse(p.p.x,p.p.y,10)
		if (attracting){
			p.v.add(createVector(mouseX,mouseY).sub(p.p).limit(p.atFactor) )
		}
	})
	particles = particles.filter(p=>p.r>0.05)
	rect(-width/2,-height/2,width,height)

}

// function mousePressed(){
// 	colors = colors===colors1?suprisedcolor:colors1;
// }

function keyTyped() {
	if (key === '1') {
	  colors = colors1
	  attracting = false;
	} else if (key === '2') {
		colors = happycolor
		attracting = false;
	} else if (key === '3') {
		colors = angercolor;
		attracting = true;
	} else if (key === '4') {
		colors = sadcolor
		attracting = false;
	} else if (key === '5') {
		colors = disgustcolor
		attracting = false;
	} else if (key === '6') {
		colors = suprisedcolor 
		attracting = true;
	} else if (key === '7') {
		colors = fearcolor
		attracting = false;
	} 
	// uncomment to prevent any default behavior
	// return false;
  }
  


