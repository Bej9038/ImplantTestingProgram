/**
 * ITP Threshold Testing Module
 *
 * @author Ben Jordan
 */

let audioCTX = new AudioContext();
let dac = audioCTX.destination;
let gain = audioCTX.createGain();
let noise;
let noiseBuffer = null;

let duration = 500;
let duration_silence = 2000;
let duration_ITI = 2000; //silence before the tone

let frequencies = [125, 250, 500, 1000, 2000, 4000, 8000];
let responses = [];
let trialnum = 0;
let startingAmp = 0.1;
let amp = startingAmp;

/**
 * Prepares an osc at a given frequency
 * @param frequency The frequency
 * @returns {OscillatorNode} The osc
 */
function setupOsc(frequency)
{
    noise = audioCTX.createBufferSource();
    noise.buffer = noiseBuffer;
    let osc = audioCTX.createOscillator();
    osc.frequency.value = frequency;
    osc.connect(gain);
    noise.connect(gain);
    gain.gain.value = amp;
    gain.connect(dac);
    return osc;
}

/**
 * Loads the noise
 */
function loadNoise()
{
    let request = new XMLHttpRequest();
    request.open("GET", "/Implant Testing Program/TE_noise_50-500Hz_300-2400ms.wav", true);
    request.responseType = "arraybuffer";
    request.onload = function()
    {
        audioCTX.decodeAudioData(request.response, (data) => noiseBuffer = data);
    };
    request.send();
}

/**
 * Controls timing of tones and led and inits each osc
 * @param frequency The current frequency
 */
function generateTone(frequency)
{
    disabledUI();
    let osc1 = setupOsc(frequency);
    setTimeout(function () {
        //ledOn();
        startstop("start", osc1);
        setTimeout(function () {
            startstop("stop", osc1);
            //ledReset();
            setTimeout(function () {
                let osc2 = setupOsc(frequency);
                //ledOn();
                startstop("start", osc2);
                setTimeout(function () {
                    startstop("stop", osc2);
                    //ledReset();
                    enableUI();
                }, duration);
            }, duration_silence);
        }, duration);
    }, duration_ITI);
}

/**
 * Starts or stops an osc
 * @param op "start" or "stop"
 * @param osc
 */
function startstop(op, osc)
{
    if(op === "start")
    {
        osc.start();
        noise.start();
    }
    else
    {
       osc.stop();
       noise.stop();
    }
}

/**
 * Controls the flow of the program
 * @param response
 */
function main(response)
{
    if(trialnum !== 0)
    {
        if (response === 1)
        {
            amp = amp / (10^(5/20));
            responses.push(1);
        }
        else if (response === 2)
        {
            amp = amp * (10^(5/20));
            responses.push(-1);
        }
    }

    let length = responses.length;
    if((trialnum > 4) && (responses[length-1] + responses[length - 2] + responses[length - 3] + responses[length - 4] === 0))
    {
        saveData();
        resetTrial();
    }
    else if(trialnum === 30)
    {
        saveData();
        resetTrial();
    }
    else {
        trialnum++;
        document.getElementById("trial").style.display = "flex";
        document.getElementById("trial").innerHTML = " Frequency: " + frequencies[readFreqCookie()] + " Trial: " + trialnum;
        document.title = "Threshold Testing - " + frequencies[readFreqCookie()];
        document.getElementById("question").innerHTML = "Did you hear two beeps?";
        document.getElementById("testui").style.display = "flex";
        generateTone(frequencies[readFreqCookie()]);
    }
}

/**
 * Submits the data to the server
 */
function saveData()
{
    document.getElementById("freq").value = frequencies[readFreqCookie()];
    document.getElementById("amp").value = amp;
    document.getElementById("subj").value = sessionStorage.getItem("name");
    document.getElementById("starttime").value = localStorage.getItem("starttime");
    let d = new Date();
    document.getElementById("endtime").value = d.getHours() + ":" + d.getMinutes() + ":" + d.getSeconds();
    document.forms["storedata"].submit();
}

/**
 * Resets the trial for the next frequency
 */
function resetTrial()
{
    let oldFreq = readFreqCookie();
    oldFreq++;
    document.cookie = "frequency=" + oldFreq;
    trialnum = 0;
    responses = [];
    amp = startingAmp;
    document.getElementById("trial").style.display = "none";
    document.getElementById("question").innerHTML = "Storing Threshold..." + '<br>' + '<br>'+ "Beginning Next Trial";
    document.getElementById("testui").style.display = "none";
}

/**
 * Reads the current frequency from cookies
 * @returns {string} The frequency
 */
function readFreqCookie()
{
    return document.cookie.slice(10, 11);
}

/**
 * Disables UI
 */
function disabledUI()
{
    document.getElementById("tone1").disabled = true;
    document.getElementById("tone2").disabled = true;
    document.getElementById("testui").style.display = "none";
}

/**
 * Enables UI
 */
function enableUI()
{
    document.getElementById("tone1").disabled = false;
    document.getElementById("tone2").disabled = false;
    document.getElementById("testui").style.display = "flex";
}

// /**
//  * Clears css animation values to turn off led
//  */
// function ledReset()
// {
//     let led = document.getElementById("led-red");
//     led.style.webkitAnimation = "none";
//     led.style.mozAnimation = "none";
//     led.style.msAnimation = "none";
//     led.style.animation = "none";
//     led.style.oAnimation = "none";
// }
//
// /**
//  * Turns on the led by reactivating the css values
//  */
// function ledOn()
// {
//     let led = document.getElementById("led-red");
//     led.style.webkitAnimation = "";
//     led.style.mozAnimation = "";
//     led.style.msAnimation = "";
//     led.style.animation = "";
//     led.style.oAnimation = "";
// }