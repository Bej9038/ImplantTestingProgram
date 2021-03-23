/**
 * ITP Loudness Matching Module
 *
 * @author Ben Jordan
 */

// let SNRThreshold = 2;
let amp_low = 0.0195; //A small enough number to avoid sound clipping
let amp_high = amp_low;
let dureeson = 500; //duration of tones
let dureeISI = 2000; //silence between the two sounds
let dureeITI = 2000; //silence before the tone
let mistuning1 = 0.2;
let mistuning2 = 0.4;
let nb_essais_max = 100; //maximum number of trials
let nb_essais = 0; //current number of trials

let F1S1;
let S1FreqList;
let F1S2;
let S2FreqList;
let mistuning;
let F1S2mist;
let valeur_mistuning;

let audioCTX = new AudioContext();
let dac = audioCTX.destination;

let noise1;
let noise1Buffer;
let noise2;
let noise2Buffer;

let S1gain = audioCTX.createGain();
let S2gain = audioCTX.createGain();

let S1HPfilter= audioCTX.createBiquadFilter();
let S1LPfilter = audioCTX.createBiquadFilter();
let S2HPfilter= audioCTX.createBiquadFilter();
let S2LPfilter = audioCTX.createBiquadFilter();
let filterQ = 24;

let S1OscList;
let S2OscList;

let decisionInt; //randomly selects which tone is played first (0 = low tone, 1 = high tone)
/**
 * Runs a trial
 */
function main()
{
    updateTrialNum();
    if(nb_essais <= nb_essais_max) {
        F1S1 = 125 + (175 - 125) * Math.random(); //Math.rand includes 0, matlab rand does not
        S1FreqList = [F1S1, 2 * F1S1, 3 * F1S1, 4 * F1S1, 5 * F1S1];
        mistuning = mistuning1;
        valeur_mistuning = Math.random();
        if (valeur_mistuning < 0.5) {
            mistuning = mistuning2
        }
        F1S2 = 125 + (175 - 125) * Math.random(); //Math.rand includes 0, matlab rand does not
        if (F1S2 >= 150) {
            mistuning = -mistuning;
        }
        F1S2mist = F1S2 + (F1S2 * mistuning);
        S2FreqList = [11 * F1S2mist, 12 * F1S2mist, 13 * F1S2mist, 14 * F1S2mist, 15 * F1S2mist, 16 * F1S2mist, 17 * F1S2mist,
            18 * F1S2mist, 19 * F1S2mist, 20 * F1S2mist, 21 * F1S2mist, 22 * F1S2mist, 23 * F1S2mist, 24 * F1S2mist,
            25 * F1S2mist, 26 * F1S2mist, 27 * F1S2mist, 28 * F1S2mist, 29 * F1S2mist, 30 * F1S2mist, 31 * F1S2mist,
            32 * F1S2mist, 33 * F1S2mist, 34 * F1S2mist, 35 * F1S2mist, 36 * F1S2mist, 37 * F1S2mist, 38 * F1S2mist,
            39 * F1S2mist, 40 * F1S2mist, 41 * F1S2mist, 42 * F1S2mist, 43 * F1S2mist, 44 * F1S2mist, 45 * F1S2mist,
            46 * F1S2mist, 47 * F1S2mist, 48 * F1S2mist, 49 * F1S2mist, 50 * F1S2mist, 51 * F1S2mist, 52 * F1S2mist,
            53 * F1S2mist, 54 * F1S2mist, 55 * F1S2mist, 56 * F1S2mist, 57 * F1S2mist];

        S1OscList = [];
        S2OscList = [];

        noiseSetup();

        generateS1();
        generateS2();

        S1gain.gain.value = amp_low;
        S2gain.gain.value = amp_high;

        S1FilterSetup();
        S2FilterSetup();

        S1gain.connect(dac);
        S2gain.connect(dac);

        decisionInt = Math.round(Math.random());

        disableUI();
        if (decisionInt === 0) {
                setTimeout(function () {
                    startstopS1("start");
                    ledOn();
                    setTimeout(function () {
                        startstopS1("stop");
                        ledReset();
                        setTimeout(function () {
                            startstopS2("start");
                            ledOn();
                            setTimeout(function () {
                                startstopS2("stop");
                                ledReset();
                                enableUI();
                            }, dureeson);
                        }, dureeISI);
                    }, dureeson);
                }, dureeITI);
        } else {
                setTimeout(function () {
                    startstopS2("start");
                    ledOn();
                    setTimeout(function () {
                        startstopS2("stop");
                        ledReset();
                        setTimeout(function () {
                            startstopS1("start");
                            ledOn();
                            setTimeout(function () {
                                startstopS1("stop");
                                ledReset();
                                enableUI();
                            }, dureeson);
                        }, dureeISI);
                    }, dureeson);
                }, dureeITI);
        }
    }
    else
    {
        document.getElementById("trial").innerHTML = "Trials: MAX";
        window.alert("The maximum number of trials has been reached");
    }
}

/**
 * Calls noise load functions
 */
function loadNoise()
{
    loadNoise1();
    loadNoise2();
}

/**
 * Disables test ui
 */
function disableUI()
{
    document.getElementById("tone1").disabled = true;
    document.getElementById("tone2").disabled = true;
    document.getElementById("neither").disabled = true;
    document.getElementById("lmui").style.display = "none";
}

/**
 * Enables test ui
 */
function enableUI()
{
    document.getElementById("tone1").disabled = false;
    document.getElementById("tone2").disabled = false;
    document.getElementById("neither").disabled = false;
    document.getElementById("lmui").style.display = "flex";
}

/**
 * Prepares noise for playback
 */
function noiseSetup()
{
    noise1 = audioCTX.createBufferSource();
    noise2 = audioCTX.createBufferSource();
    noise1.buffer = noise1Buffer;
    noise2.buffer = noise2Buffer;
    noise1.connect(S1gain);
    noise2.connect(S2gain);
}

/**
 * Loads noise 1
 */
function loadNoise1()
{
    let request = new XMLHttpRequest();
    request.open("GET", "/Implant Testing Program/TE_noise_50-500Hz_300-2400ms.wav", true);
    request.responseType = "arraybuffer";
    request.onload = function()
    {
        audioCTX.decodeAudioData(request.response, (data) => noise1Buffer = data);
    };
    request.send();
}

/**
 * Loads noise 2
 */
function loadNoise2()
{
    let request = new XMLHttpRequest();
    request.open("GET", "/Implant Testing Program/TE_noise_50-500Hz_300-2400ms.wav", true);
    request.responseType = "arraybuffer";
    request.onload = function()
    {
        audioCTX.decodeAudioData(request.response, (data) => noise2Buffer = data);
    };
    request.send();
}

/**
 * Creates S1's oscs and adds them to the list
 */
function generateS1()
{
    for(let i = 0; i < S1FreqList.length; i++)
    {
        let osc = audioCTX.createOscillator();
        osc.frequency.value = S1FreqList[i]; //2 * Math.PI *
        osc.connect(S1HPfilter);
        S1OscList.push(osc);
    }
}

/**
 * Creates S2's oscs and adds them to the list
 */
function generateS2()
{
    for(let i = 0; i < S2FreqList.length; i++)
    {
        let osc = audioCTX.createOscillator();
        osc.frequency.value = S2FreqList[i];
        osc.connect(S2HPfilter);
        S2OscList.push(osc);
    }
}

/**
 * Prepares the filters for S1
 */
function S1FilterSetup()
{
    S1HPfilter.frequency.value = 125;
    S1HPfilter.Q.value = filterQ;
    S1HPfilter.connect(S1LPfilter);
    S1LPfilter.frequency.value = 400;
    S1LPfilter.Q.value = filterQ;
    S1LPfilter.connect(S1gain);
}

/**
 * Prepares the filters for S2
 */
function S2FilterSetup()
{
    S2HPfilter.frequency.value = 2300;
    S2HPfilter.Q.value = filterQ;
    S2HPfilter.connect(S2LPfilter);
    S2LPfilter.frequency.value = 3500;
    S2LPfilter.Q.value = filterQ;
    S2LPfilter.connect(S2gain);
}

/**
 * Starts or stops S1
 * @param op start or stop
 */
function startstopS1(op)
{
    if(op === "start") {
        noise1.start();
        for (let i = 0; i < S1OscList.length; i++)
        {
            S1OscList[i].start();
        }
    }
    else
    {
        noise1.stop();
        for (let i = 0; i < S1OscList.length; i++)
        {
            S1OscList[i].stop();
        }
    }
}

/**
 * Starts or stops S2
 * @param op start or stop
 */
function startstopS2(op)
{
    if(op === "start")
    {
        noise2.start();
        for (let i = 0; i < S2OscList.length; i++) {
            S2OscList[i].start();
        }
    }
    else
    {
        noise2.stop();
        for (let i = 0; i < S2OscList.length; i++) {
            S2OscList[i].stop();
        }
    }
}

/**
 * Starts the test and sets up trial event listeners for the buttons. Only called once
 */
function eventSetup()
{
    document.getElementById("tone1").addEventListener("click", function () {
    if (decisionInt === 0) {
        amp_high *= 1.5;
    } else if (decisionInt === 1) {
        amp_high /= 1.5;
    }
    main();
});
    document.getElementById("tone2").addEventListener("click", function () {
        if (decisionInt === 0) {
            amp_high /= 1.5;
        } else if (decisionInt === 1) {
            amp_high *= 1.5;
        }
        main();
    });
    document.getElementById("neither").addEventListener("click", function () {
        document.getElementById("ampratio").value = amp_low + "/" + amp_high;
        document.getElementById("subj").value = sessionStorage.getItem("name");
        document.getElementById("starttime").value = localStorage.getItem("starttime");
        let d = new Date();
        let endtime = d.getHours() + ":" + d.getMinutes() + ":" + d.getSeconds();
        document.getElementById("endtime").value = endtime;
        document.getElementById("lmsubmit").submit();
    });
}

/**
 * Updates trial number
 * @returns {number} Trial number
 */
function updateTrialNum()
{
    nb_essais++;
    document.getElementById("trial").innerHTML = "Trial: " + nb_essais + "/" + nb_essais_max;
    document.title = "Loudness Matching - " + nb_essais + "/" + nb_essais_max;
    return 0;
}

/**
 * Turns off led
 */
function ledReset()
{
    let led = document.getElementById("led-red");
    led.style.webkitAnimation = "none";
    led.style.mozAnimation = "none";
    led.style.msAnimation = "none";
    led.style.animation = "none";
    led.style.oAnimation = "none";
}

/**
 * Turns on led
 */
function ledOn()
{
    let led = document.getElementById("led-red");
    led.style.webkitAnimation = "";
    led.style.mozAnimation = "";
    led.style.msAnimation = "";
    led.style.animation = "";
    led.style.oAnimation = "";
}