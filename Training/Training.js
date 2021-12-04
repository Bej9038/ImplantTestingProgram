/**
 * ITP Training Module
 *
 * @author Ben Jordan
 */

let audioCTX = new AudioContext();
let dac = audioCTX.destination;
let mute = audioCTX.createGain(); mute.gain.value = 0;
let overallGain = audioCTX.createGain();
let noise;
let noiseBuffer;

overallGain.gain.value = 1/9;
mute.connect(overallGain);
overallGain.connect(dac);

let ctx;
let dim = 600;
let offsetX = -13;
let offsetY = -220;
let diagonalOrientation = 1;

let F1upper = 160;
let F1lower = 120;
let F1dimPerFreq;
let F0_Xlist = [];
let F2upper = 180;
let F2lower = 140;
let F2dimPerFreq;
let F0_Ylist = [];

let mousePos = [];
for(let i = 0; i < 20; i++)
{
    mousePos[i] = [];
}

let mouseEventCoord; //real time updated coordinate of mouse on canvas set by mouseMove event
let interval = setInterval(function () { //sets an interval to save the mouse position in the background
    if(allowInput)
    {
        pushMousePos(mouseEventCoord);
    }
}, 100);

let trial = 0;
let trialGrade;
let gradeList = [];
let maxTrials = 20;
let dot1X;
let dot1Y;
let dot1Grade;
let numClicks = 0;
let isPlaying = false; //tone is playing either muted or unmuted
let allowInput = false; //allow user to markCanvas
let allowChange = false; //allow user to change tone

/**
 * Mouse down event listener
 * @param e Mouse coords
 */
function mouseDown(e)
{
    if(allowChange) {
        numClicks++;
        if (numClicks < 2 ) { //click 1
            ctx.fillRect(e.pageX + offsetX, e.pageY + offsetY, 10, 10);
            dot1Grade = (calculateGrade(e.pageX, e.pageY));
            dot1X = e.pageX;
            dot1Y = e.pageY;
            pushMousePos(e);
        }
        else if (numClicks === 2) //click 2
        {
            allowInput = false;
            if(trial === 1) {
                document.getElementById("hint").style.display = "flex";
            }

            //dot2
            ctx.fillRect(e.pageX + offsetX, e.pageY + offsetY, 10, 10);
            pushMousePos(e);

            //connect the dots
            ctx.beginPath();
            ctx.moveTo(dot1X + offsetX + 5, dot1Y + offsetY + 4);
            ctx.lineTo(e.pageX + offsetX + 5, e.pageY + offsetY + 4);
            ctx.strokeStyle = "black";
            ctx.stroke();

            //grade
            let dot2grade = (calculateGrade(e.pageX, e.pageY));
            if (isPlaying === true) {
                trialGrade = (dot2grade + dot1Grade) / 2;
                document.getElementById("grade").innerHTML = "" + trialGrade;
            } else {
                document.getElementById("grade").innerHTML = "";
            }

            displayGradient();

            document.getElementById("go").disabled = false;
        }
    }
}

function displayGradient()
{
    // ctx.beginPath();
    // ctx.moveTo(freqToDim(F2lower, 'x'), freqToDim(F1upper, 'y'));
    // ctx.lineTo(freqToDim(F2upper, 'x'), freqToDim(F1lower, 'y'));
    // ctx.strokeStyle = "red";
    // ctx.stroke();
    let x = 1;

    let radian = Math.atan((freqToDim(F1upper, 'y') - freqToDim(F1lower, 'y'))/(freqToDim(F2upper, 'x') - freqToDim(F2lower, 'x')));
    let angle = -radian * 180 / Math.PI;
    console.log(angle);
    document.getElementById("gradient").style.backgroundImage = "linear-gradient(" + angle + "deg , white 20%, #80CBC4 50%, white 80%)";
    let ysh = ( 600 - freqToDim(F1lower, 'y') - freqToDim(F1upper, 'y'))/2;
    let xsh = ( 600 - freqToDim(F2lower, 'x') - freqToDim(F2upper, 'x'))/2;
    console.log(ysh);
    console.log(xsh);
    document.getElementById("gradient").style.top = -300 - ysh + "px";
    document.getElementById("gradient").style.left = -300 - xsh + "px";
    document.getElementById("gradient").style.backgroundRepeat = "no-repeat";
}

/**
 * Converts a page dim to a freq
 * @param d The page dim
 * @param axis The Axis
 * @returns {number} The freq
 */
function dimToFreq(d, axis)
{
    if(diagonalOrientation === 1)
    {
        if(axis === 'x')
        {
            d = Math.max(d + offsetX, 0);
            return d / F1dimPerFreq + F1lower;
        }
        else
        {
            d = Math.max(convertY(d + offsetY), 0);
            return d / F2dimPerFreq + F2lower;
        }
    }
    else if(diagonalOrientation === 2)
    {
        if(axis === 'x')
        {
            d = Math.max(d + offsetX, 0);
            return F1upper - d / F1dimPerFreq;
        }
        else
        {
            d = Math.max(convertY(d + offsetY), 0);
            return d / F2dimPerFreq + F2lower;
        }
    }
    else if(diagonalOrientation === 3)
    {
        if(axis === 'x')
        {
            d = Math.max(d + offsetX, 0);
            return d / F1dimPerFreq + F1lower;
        }
        else
        {
            d = Math.max(convertY(d + offsetY), 0);
            return F2upper - d / F2dimPerFreq;
        }
    }
    else if(diagonalOrientation === 4)
    {
        if(axis === 'x')
        {
            d = Math.max(d + offsetX, 0);
            return F1upper - d / F1dimPerFreq;
        }
        else
        {
            d = Math.max(convertY(d + offsetY), 0);
            return F2upper - d / F2dimPerFreq;
        }
    }
}

/**
 * Converts a frequency to a canvas dim
 * @param f The frequency
 * @param axis The axis
 * @returns {number} The canvas dim
 */
function freqToDim(f, axis)
{
    if(diagonalOrientation === 1)
    {
        if(axis === 'x') {
            if(f < F1lower) {
                return 0;
            }
            else if(f > F1upper) {
                return 600;
            }
            else {
                return (f - F1lower) * F1dimPerFreq;
            }
        }
        else {
            if(f < F2lower) {
                return 0;
            }
            else if(f > F2upper) {
                return 600;
            }
            else {
                return (f - F2lower) * F2dimPerFreq;
            }
        }
    }
    else if(diagonalOrientation === 2)
    {
        if(axis === 'x') {
            if(f < F1lower) {
                return 600;
            }
            else if(f > F1upper) {
                return 0;
            }
            else {
                return (F1upper - f) * F1dimPerFreq;
            }
        }
        else {
            if(f < F2lower) {
                return 0;
            }
            else if(f > F2upper) {
                return 600;
            }
            else {
                return (f - F2lower) * F2dimPerFreq;
            }
        }
    }
    else if(diagonalOrientation === 3)
    {
        if(axis === 'x') {
            if(f < F1lower) {
                return 0;
            }
            else if(f > F1upper) {
                return 600;
            }
            else {
                return (f - F1lower) * F1dimPerFreq;
            }
        }
        else {
            if(f < F2lower) {
                return 600;
            }
            else if(f > F2upper) {
                return 0;
            }
            else {
                return (F2upper - f) * F2dimPerFreq;
            }
        }
    }
    else if(diagonalOrientation === 4)
    {
        if(axis === 'x') {
            if(f < F1lower) {
                return 600;
            }
            else if(f > F1upper) {
                return 0;
            }
            else {
                return (F1upper - f) * F1dimPerFreq;
            }
        }
        else {
            if(f < F2lower) {
                return 600;
            }
            else if(f > F2upper) {
                return 0;
            }
            else {
                return (F2upper - f) * F2dimPerFreq;
            }
        }
    }
}

/**
 * Randomizes the diagonal of the harmonicty line by changing the freq to canvas dimension relationship
 */
function randomizeDiagonal()
{
    if(sessionStorage.getItem('trainingmode') === 'H')
    {
        diagonalOrientation = Math.floor(Math.random() * 4) + 1;
    }
    console.log(diagonalOrientation);
}

/**
 * Calculates the grade
 * @param x Mouse x
 * @param y Mouse y
 * @returns {number} The grade
 */
function calculateGrade(x, y)
{
    let F1 = dimToFreq(x, 'x');
    let F2 = dimToFreq(y, 'y');
    let minGrade = Math.max(F1upper - F2lower, F2upper - F1lower);
    let result = Math.abs(F1 - F2);

    return Math.round(100 - result/minGrade * 100);
}

/**
 * Converts the page y value to the canvas y value
 * @param y Page Y
 * @returns {number} Canvas y
 */
function convertY(y)
{
    return dim - y;
}

/**
 * Mouse leave event listener
 * @param e Mouse coords
 */
function mouseExit(e)
{
    mute.gain.value = 0;
    if(isPlaying)
    {
        ledOff();
    }
}

/**
 * Mouse enter event listener
 * @param e Mouse coords
 */
function mouseEnter(e)
{
    mute.gain.value = 1;
    if(isPlaying)
    {
        ledOn();
    }
}

/**
 * Mouse move event listener
 * @param e Mouse coords
 */
function mouseMove(e)
{
    mouseEventCoord = e;
    for(let i = 0; i < 3; i++)
    {
        F0_Xlist[i].frequency.value = dimToFreq(e.pageX, 'x') * (i + 1);
    }
    for(let i = 0; i < 6; i++)
    {
        F0_Ylist[i].frequency.value = dimToFreq(e.pageY, 'y') * (i + 15);
    }
}

/**
 * Plays the sound if it is not playing, otherwise it stops the sound and re-initializes the canvas
 * for the next trial.
 */
function play()
{
    document.getElementById("go").disabled = true;

    if(isPlaying === false)
    {
        trialSetup();
        startOscillators();
        isPlaying = true;
        allowChange = true;
        allowInput = true;
    }
    else
    {
        clearCanvas();
        stopOscillators();
        isPlaying = false;
        allowChange = false;

        gradeList.push(trialGrade);
        mousePos[trial - 1][0] = "\n\nTrial: " + trial + " Grade: " + trialGrade;

        if(trial < maxTrials)
        {
            play();
        }
        else
        {
            clearInterval(interval);
            submitData();
        }
    }
}

/**
 * Saves the mouse pos to the mousePos array
 * @param e The mouse pos
 */
function pushMousePos(e)
{
    let d = new Date();
    let currentTime = d.getHours() + ":" + d.getMinutes() + ":" + d.getSeconds() + ":" +
        String(d.getMilliseconds()).padStart(3, '0');
    let coord = " (" + (e.pageX + offsetX) + "," + convertY(e.pageY + offsetY) + ")";
    let timepos = "\ntime: " + currentTime + " pos: " + coord;
    mousePos[trial - 1].push(timepos);
}

/**
 * Prepares the page for the next trial
 */
function trialSetup()
{
    updateTrialNum();
    setFrequencyRange();
    randomizeDiagonal();
    initNoise();
    initOsc();
    initCanvas();
    mousePos[trial - 1].push("");
    mousePos[trial - 1].push("\nX1: " + F1lower + " X2: " + F1upper + "Y1: " + F2lower + "Y2: " + F2upper);
}

function updateTrialNum()
{
    trial++;
    document.title = "Inharmonicity Training - " + trial + "/" + maxTrials;
    if(sessionStorage.getItem('trainingmode') === 'E')
    {
        document.getElementById("trial").innerHTML = "Trial: " + trial + "/" + maxTrials + " Difficulty: Easy";
    }
    else if(sessionStorage.getItem('trainingmode') === 'H')
    {
        document.getElementById("trial").innerHTML = "Trial: " + trial + "/" + maxTrials + " Difficulty: Hard";
    }
}

/**
 * Submits the training data to the server
 */
function submitData()
{
    document.getElementById("mousepos").value = mousePos.toString();
    for(let i = 0; i < 20; i++)
    {
        let id = "t" + (i+1);
        document.getElementById(id).value = gradeList[i];
    }
    document.getElementById("subj").value = sessionStorage.getItem("name");
    document.getElementById("starttime").value = localStorage.getItem("starttime");
    let d = new Date();
    document.getElementById("endtime").value = d.getHours() + ":" + d.getMinutes() + ":" + d.getSeconds();
    document.getElementById("dbSubmit").submit();
}

/**
 * Initializes the Canvas events for a new trial
 */
function initCanvas()
{
    document.getElementById("canvas").addEventListener("mousemove", mouseMove);
    document.getElementById("canvas").addEventListener("mousedown", mouseDown);
    document.getElementById("canvas").addEventListener("mouseleave", mouseExit);
    document.getElementById("canvas").addEventListener("mouseenter", mouseEnter);
}

/**
 * Prepares oscs for play
 */
function initOsc()
{
    F0_Xlist = [];
    F0_Ylist = [];

    for(let i = 0; i < 3; i++)
    {
        let osc = audioCTX.createOscillator();
        osc.frequency.value = F1lower * (i + 1);
        osc.connect(mute);
        F0_Xlist.push(osc);
    }

    for(let i = 0; i < 6; i++)
    {
        let osc = audioCTX.createOscillator();
        osc.frequency.value = F2lower * (i + 15);
        osc.connect(mute);
        F0_Ylist.push(osc);
    }
}

/**
 * Prepares the noise for play
 */
function initNoise()
{
    noise = audioCTX.createBufferSource();
    noise.buffer = noiseBuffer;
    noise.loop = true;
    noise.connect(mute);
}

/**
 * Loads the noise file async and then begins play after
 */
function loadNoise()
{
    let request = new XMLHttpRequest();
    request.open("GET", "TE_noise_50-500Hz_300-2400ms.wav", true);
    request.responseType = "arraybuffer";
    request.onload = function()
    {
        audioCTX.decodeAudioData(request.response, (data) => noiseBuffer = data);
        initNoise();
        play();
    };
    request.send();
}

/**
 * Randomly chooses the frequency range for the tones
 */
function setFrequencyRange()
{
    let xlRand = (Math.random() * (140 - 120)) + 120; //xaxis lower limit
    let xuRand = (Math.random() * (180 - 160)) + 160; //xaxis upper limit
    F1lower = xlRand;
    F1upper = xuRand;
    F1dimPerFreq = dim / (F1upper - F1lower);
    console.log(F1lower);
    console.log(F1upper);
    let ylRand = (Math.random() * (140 - 120)) + 120; //y axis lower limit
    let yuRand = (Math.random() * (180 - 160)) + 160; //y axis upper limit
    F2lower = ylRand;
    F2upper = yuRand;
    F2dimPerFreq = dim / (F2upper - F2lower);
    console.log(F2lower);
    console.log(F2upper);
}


/**
 * Clears event listeners and anything showing on the canvas
 */
function clearCanvas()
{
    document.getElementById("hint").style.display = "none";
    document.getElementById("gradient").style.backgroundImage = "none";
    document.getElementById("canvas").style.backgroundImage = "none";
    document.getElementById("grade").innerHTML = "";
    ctx.clearRect(0, 0, dim, dim);
    // displayCtx.clearRect(0, 0, dim, dim);
    numClicks = 0;

    document.getElementById("canvas").removeEventListener("mousemove", mouseDown);
    document.getElementById("canvas").removeEventListener("mousemove", mouseMove);
    document.getElementById("canvas").removeEventListener("mouseleave", mouseExit);
    document.getElementById("canvas").removeEventListener("mouseenter", mouseEnter);
}

function startOscillators()
{
    noise.start();
    for(let i = 0; i < F0_Xlist.length; i++)
    {
        F0_Xlist[i].start();
    }
    for(let i = 0; i < F0_Ylist.length; i++)
    {
        F0_Ylist[i].start();
    }
}

function stopOscillators()
{
    noise.stop();
    for(let i = 0; i < F0_Xlist.length; i++)
    {
        F0_Xlist[i].stop();
    }
    for(let i = 0; i < F0_Ylist.length; i++)
    {
        F0_Ylist[i].stop();
    }
}

/**
 * Activates LED on animation
 */
function ledOn()
{
    let led = document.getElementById("led-red");
    led.style.webkitAnimation = "turnRed .5s forwards";
    led.style.mozAnimation = "turnRed .5s forwards";
    led.style.msAnimation = "turnRed .5s forwards";
    led.style.animation = "turnRed .5s forwards";
    led.style.oAnimation = "turnRed .5s forwards";
    setTimeout(function () {
        led.style.webkitAnimationPlayState = "paused";
        led.style.mozAnimationPlayState = "paused";
        led.style.msAnimationPlayState = "paused";
        led.style.animationPlayState = "paused";
        led.style.oAnimationPlayState = "paused";
    }, 480);
}

/**
 * Activates LED off animation
 */
function ledOff()
{
    let led = document.getElementById("led-red");
    led.style.webkitAnimationPlayState = "running";
    led.style.mozAnimationPlayState = "running";
    led.style.msAnimationPlayState = "running";
    led.style.animationPlayState = "running";
    led.style.oAnimationPlayState = "running";

    led.style.webkitAnimation = "default 1s";
    led.style.mozAnimation = "default 1s";
    led.style.msAnimation = "default 1s";
    led.style.animation = "default 1s";
    led.style.oAnimation = "default 1s";
}

/**
 * Sets up the canvas at the start of the module one time only
 */
function loadCanvas()
{
    ctx = document.getElementById("canvas").getContext("2d");
    // displayCtx = document.getElementById("border").getContext("2d");
    document.getElementById("canvas").setAttribute("width", dim.toString());
    document.getElementById("canvas").setAttribute("height", dim.toString());
}
