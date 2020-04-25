let modelObj; // setup initializes this to a p5.js 3D model
let sensorData;
var env;

let r = 909; 

function preload() {
    modelObj = loadModel('models/guitar.obj', true);
}

function setup() {
    createCanvas(windowWidth, windowHeight, WEBGL);
    imuConnection.onSensorData((device) => {
        sensorData = device.data;
    });
    env = new p5.Envelope();
    env.setADSR(0.05, 0.1, 0.1, 0.5);
    env.setRange(1.2, 0);

    wave = new p5.Oscillator();

    wave.setType('sine');
    wave.start();
    wave.freq(440);
    wave.amp(env);
}

function draw() {
    background(200, 200, 212);
    noStroke();
    lights();
    orbitControl();

    if (!sensorData) {
        return;
    }
    let euler = sensorData.euler;
    let x = abs(euler[0]);
    let y = abs(euler[1]);
    let z = abs(euler[2]);
    if (x > 0 && x < 28){
        wave.freq(261.6);
    } else if (x >= 28 && x < 56){
        wave.freq(293.7);
    } else if (x < 84 && x >= 56){
        wave.freq(329.6);
    } else if (x >= 84 && x < 112){
        wave.freq(349.2);
    } else if (x >= 112 && x < 140){
        wave.freq(392.0);
    } else if (x >= 140 && x < 169) {
        wave.freq(440.0);
    } else{
        wave.freq(493.9);
    }
    env.play();

    background(euler[0]/360*255, euler[1]/360*255, euler[2]/360*255, 100);
    noFill();
    stroke(255, 255, 255);
    strokeWeight(5)
    if (r > 0){
        ellipse(0, 0, r,);
        ellipse(0, 0, r - 300);
        ellipse(0, 0, r - 600);
        r -= 1;
    } else {r = 909}

    applyMatrix.apply(null, sensorData.orientationMatrix);

    // Fade the model out, if the sensor data is stale
    let currentTime = new Date();
    let age = max(0, currentTime - sensorData.receivedAt - 250);
    let alpha = max(5, 255 - age / 10);
    fill(255, 255, 255, alpha);

    // Render the model
    noStroke();
    model(modelObj);
}