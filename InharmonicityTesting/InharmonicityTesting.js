/**
 * ITP Inharmonicity Testing Module
 *
 * @author Ben Jordan
 */

let SNRThreshold = 10;
let SNRTarget = SNRThreshold * 10^(20/20);
let ampFactor = 1;
let amp_low = 0.0195;
let duration = 500; //in seconds
let duration_ITI = 2000; //silence between the two sounds
let duration_Silence = 2000; //silence before the tone
let mistuning1 = 0.20; //only high level mistuning
let mistuning2 = 0.40;
let nb_rep_correctes = 0; //total number of correct
let nb_rep_correctes_condition = [0,0]; //number of correct answers for each mistuning value
let compt_mistuning = [0,0]; //compts number of trials [mistuning1;mistuning2]
let numTrials = 20; //maximum number of trials
let currTrial = 0; //current number of trials

let F1S1;
let F1S2;
let S1FreqList;
let S2FreqList;

let audioCTX = new AudioContext();
let dac = audioCTX.destination;

let noise1;
let noise1Buffer;
let noise2;
let noise2Buffer;
let noiseAmp = 1;

let S1Lowgain = audioCTX.createGain();
let S1Highgain = audioCTX.createGain();
let S2Lowgain = audioCTX.createGain();
let S2Highgain = audioCTX.createGain();

let noiseGain = audioCTX.createGain();
let S1gain = audioCTX.createGain();
let S2gain = audioCTX.createGain();
let overallGain = audioCTX.createGain();
overallGain.gain.value = 1/52;

let S1LowHPfilter = audioCTX.createBiquadFilter();
let S1LowLPfilter = audioCTX.createBiquadFilter();
let S1HighHPfilter = audioCTX.createBiquadFilter();
let S1HighLPfilter = audioCTX.createBiquadFilter();

let S2LowHPfilter = audioCTX.createBiquadFilter();
let S2LowLPfilter = audioCTX.createBiquadFilter();
let S2HighHPfilter = audioCTX.createBiquadFilter();
let S2HighLPfilter = audioCTX.createBiquadFilter();

let filterQ = 24;

let S1LowOscList;
let S1HighOscList;
let S2LowOscList;
let S2HighOscList;

let decisionInt; //randomly selects which tone is played first (0 = low tone, 1 = high tone)

let F1S1Matrix = [];
let F1S2Matrix = [];
let MistuningMatrix = [];

/**
 * Runs a single trial
 */
function main()
{
    updateTrialNum();
    if(currTrial <= numTrials) {
        let RandMistuning = [];
        let RandMistuning1 = [];
        let RandMistuning2 = [];

        let arr = [];
        for(let i = 0; i < numTrials; i++)
        {
            arr[i] = (i % (50)) + 125;
        }

        initF1S1Matrix(arr);
        initF1S2Matrix(arr);
        initMistuningMatrix(RandMistuning, RandMistuning1, RandMistuning2);

        F1S1 = F1S1Matrix[currTrial - 1];
        S1FreqList = [F1S1, 2 * F1S1, 3 * F1S1, 4 * F1S1, 5 * F1S1, 11 * F1S1, 12 * F1S1, 13 * F1S1, 14 * F1S1,
                        15 * F1S1, 16 * F1S1, 17 * F1S1, 18 * F1S1, 19 * F1S1, 20 * F1S1, 21 * F1S1, 22 * F1S1,
                        23 * F1S1, 24 * F1S1, 25 * F1S1, 26 * F1S1, 27 * F1S1, 28 * F1S1, 29 * F1S1, 30 * F1S1,
                        31 * F1S1, 32 * F1S1, 33 * F1S1, 34 * F1S1, 35 * F1S1, 36 * F1S1, 37 * F1S1, 38 * F1S1,
                        39 * F1S1, 40 * F1S1, 41 * F1S1, 42 * F1S1, 43 * F1S1, 44 * F1S1, 45 * F1S1, 46 * F1S1,
                        47 * F1S1, 48 * F1S1, 49 * F1S1, 50 * F1S1, 51 * F1S1, 52 * F1S1, 53 * F1S1, 54 * F1S1,
                        55 * F1S1, 56 * F1S1, 57 * F1S1];

        F1S2 = F1S2Matrix[currTrial - 1];
        mistuning = MistuningMatrix[currTrial - 1];
        F1S2mist = F1S2 + (F1S2 * mistuning);
        S2FreqList = [F1S2, 2 * F1S2, 3 * F1S2, 4 * F1S2, 5 * F1S2, 11 * F1S2mist, 12 * F1S2mist, 13 * F1S2mist, 14 * F1S2mist, 15 * F1S2mist, 16 * F1S2mist, 17 * F1S2mist,
            18 * F1S2mist, 19 * F1S2mist, 20 * F1S2mist, 21 * F1S2mist, 22 * F1S2mist, 23 * F1S2mist, 24 * F1S2mist,
            25 * F1S2mist, 26 * F1S2mist, 27 * F1S2mist, 28 * F1S2mist, 29 * F1S2mist, 30 * F1S2mist, 31 * F1S2mist,
            32 * F1S2mist, 33 * F1S2mist, 34 * F1S2mist, 35 * F1S2mist, 36 * F1S2mist, 37 * F1S2mist, 38 * F1S2mist,
            39 * F1S2mist, 40 * F1S2mist, 41 * F1S2mist, 42 * F1S2mist, 43 * F1S2mist, 44 * F1S2mist, 45 * F1S2mist,
            46 * F1S2mist, 47 * F1S2mist, 48 * F1S2mist, 49 * F1S2mist, 50 * F1S2mist, 51 * F1S2mist, 52 * F1S2mist,
            53 * F1S2mist, 54 * F1S2mist, 55 * F1S2mist, 56 * F1S2mist, 57 * F1S2mist];

        //sound generation
        S1LowOscList = [];
        S1HighOscList = [];
        S2LowOscList = [];
        S2HighOscList = [];

        decisionInt = Math.round(Math.random());

        disabledUI();
        if (decisionInt === 0) {
            setTimeout(function () {
                initAudio();
                startstopS1("start");
                ledOn();
                setTimeout(function () {
                    startstopS1("stop");
                    ledReset();
                    setTimeout(function () {
                        initAudio();
                        startstopS2("start");
                        ledOn();
                        setTimeout(function () {
                            startstopS2("stop");
                            ledReset();
                            enableUI();
                        }, duration);

                    }, duration_Silence);

                }, duration);

            }, duration_ITI);
        } else {
            setTimeout(function () {
                initAudio();
                startstopS2("start");
                ledOn();
                setTimeout(function () {
                    startstopS2("stop");
                    ledReset();
                    setTimeout(function () {
                        initAudio();
                        startstopS1("start");
                        ledOn();
                        setTimeout(function () {
                            startstopS1("stop");
                            ledReset();
                            enableUI();
                        }, duration);
                    }, duration_Silence);
                }, duration);
            }, duration_ITI);
        }
    }
    else
    {
        document.getElementById("results").value = nb_rep_correctes;
        document.getElementById("subj").value = sessionStorage.getItem("name");
        document.getElementById("starttime").value = localStorage.getItem("starttime");
        let d = new Date();
        let endtime = d.getHours() + ":" + d.getMinutes() + ":" + d.getSeconds();
        document.getElementById("endtime").value = endtime;
        document.getElementById("submitdata").submit();
    }
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

/**
 * init F1S1 Matrix
 * @param arr Freq array
 */
function initF1S1Matrix(arr)
{
    F1S1Matrix = randomizeFreq(arr, randperm(numTrials));
}

/**
 * init F1S2 Matrix
 * @param arr Freq array
 */
function initF1S2Matrix(arr)
{
    F1S2Matrix = randomizeFreq(arr, randperm(numTrials));
}

/**
 * Creates the mistuning matrix
 * @param RandMistuning RM
 * @param RandMistuning1 RM S1
 * @param RandMistuning2 RM S2
 */
function initMistuningMatrix(RandMistuning, RandMistuning1, RandMistuning2)
{
    RandMistuning = randperm(numTrials/2);
    RandMistuning1 = RandMistuning.slice(0, Math.round(numTrials/4));
    RandMistuning2 = RandMistuning.slice(-Math.round(-numTrials/4));
    let highFreq = find(F1S2Matrix, 135, 'g');
    for(let i = 0; i < RandMistuning1.length; i++)
    {
        MistuningMatrix[highFreq[RandMistuning1[i]]] = -mistuning1;
    }
    for(let i = 0; i < RandMistuning2.length; i++)
    {
        MistuningMatrix[highFreq[RandMistuning2[i]]] = -mistuning2;
    }

    RandMistuning = randperm(numTrials/2);
    RandMistuning1 = RandMistuning.slice(0, Math.round(numTrials/4));
    RandMistuning2 = RandMistuning.slice(-Math.round(-numTrials/4));
    let lowFreq = find(F1S2Matrix, 135, 'l');
    for(let i = 0; i < RandMistuning1.length; i++)
    {
        MistuningMatrix[lowFreq[RandMistuning1[i]]] = mistuning1;
    }
    for(let i = 0; i < RandMistuning2.length; i++)
    {
        MistuningMatrix[lowFreq[RandMistuning2[i]]] = mistuning2;
    }
}

/**
 * Finds All values >= or <= x in an array depending on the op
 * @param arr The array
 * @param x The pivot value
 * @param op "g" (>=) or "l" (<=)
 * @returns {[]} The values
 */
function find(arr, x, op)
{
    let temp = [];
    for(let i = 0; i < arr.length; i++)
    {
        if(op === 'l')
        {
            if(arr[i] < x)
            {
                temp.push(i);
            }
        }
        else if(op === 'g')
        {
            if(arr[i] >= x)
            {
                temp.push(i);
            }
        }
    }
    return temp;
}

/**
 * Returns a randomized array of frequencies given an array of ordered frequencies using a rand perm
 * @param arr Ordered array of freqs
 * @param randperm A rand perm The rand perm
 * @returns {[]} The randomized array
 */
function randomizeFreq(arr, randperm)
{
    let randFreqArr = [];
    for(let i = 0; i < randperm.length; i++)
    {
        randFreqArr.push(arr[randperm[i]]);
    }
    return randFreqArr;
}

/**
 * Creates a rand perm with ints 0 to n-1
 * @param n Size of perm
 * @returns {[]} Perm array
 */
function randperm(n)
{
    let arr = [];
    let randint;
    let stop = 0;
    for(let i = 0; i < n; i++)
    {
        stop = 0;
        while(stop === 0)
        {
            randint = Math.floor(Math.random() * n);
            if(arr.indexOf(randint) === -1) {
                arr.push(randint);
                stop = 1;
            }
        }
    }
    return arr;
}

/**
 * Calls noise load functions
 */
function noiseLoad()
{
    loadNoise1();
    loadNoise2();
}

/**
 * Prepares audio connections for playback
 */
function initAudio()
{
    noise1 = audioCTX.createBufferSource();
    noise1.buffer = noise1Buffer;
    noise1.connect(noiseGain);
    noise2 = audioCTX.createBufferSource();
    noise2.buffer = noise2Buffer;
    noise2.connect(noiseGain);
    noiseGain.gain.value = noiseAmp;

    generateS1();
    generateS2();

    S1Lowgain.gain.value = amp_low;
    S1Highgain.gain.value = ampFactor;
    S2Lowgain.gain.value = amp_low;
    S2Highgain.gain.value = ampFactor;

    S1FilterSetup(S1Lowgain, S1Highgain);
    S2FilterSetup(S2Lowgain, S2Highgain);

    noiseGain.connect(overallGain);
    S1gain.connect(overallGain);
    S2gain.connect(overallGain);

    overallGain.connect(dac);
}

/**
 * Loads noise 1
 */
function loadNoise1()
{
    let request = new XMLHttpRequest();
    request.open("GET", "InharmonicityTesting/White 10m.mp3", true);
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
    request.open("GET", "InharmonicityTesting/White 10m.mp3", true);
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
    for(let i = 0; i < 5; i++)
    {
        let osc = audioCTX.createOscillator();
        osc.frequency.value = S1FreqList[i];
        osc.connect(S1Lowgain);
        S1LowOscList.push(osc);
    }
    for(let i = 5; i < S1FreqList.length; i++)
    {
        let osc = audioCTX.createOscillator();
        osc.frequency.value = S1FreqList[i];
        osc.connect(S1Highgain);
        S1HighOscList.push(osc);
    }
}

/**
 * Creates S2's oscs and adds them to the list
 */
function generateS2()
{
    for(let i = 0; i < 5; i++)
    {
        let osc = audioCTX.createOscillator();
        osc.frequency.value = S2FreqList[i];
        osc.connect(S2Lowgain);
        S2LowOscList.push(osc);
    }
    for(let i = 5; i < S2FreqList.length; i++)
    {
        let osc = audioCTX.createOscillator();
        osc.frequency.value = S2FreqList[i];
        osc.connect(S2Highgain);
        S2HighOscList.push(osc);
    }
}

/**
 * Prepares the filters for S1
 */
function S1FilterSetup(S1Lowgain, S1Highgain)
{
    //S1 Low
    S1LowLPfilter.frequency.value = 125;
    S1LowLPfilter.Q.value = filterQ;
    S1LowHPfilter.frequency.value = 400;
    S1LowHPfilter.Q.value = filterQ;

    S1Lowgain.connect(S1LowLPfilter);
    S1LowLPfilter.connect(S1LowHPfilter);
    S1LowHPfilter.connect(S1gain);

    //S1 High
    S1HighLPfilter.frequency.value = 2300;
    S1HighLPfilter.Q.value = filterQ;
    S1HighHPfilter.frequency.value = 3500;
    S1HighHPfilter.Q.value = filterQ;

    S1Highgain.connect(S1HighLPfilter);
    S1HighLPfilter.connect(S1HighHPfilter);
    S1HighHPfilter.connect(S1gain);
}

/**
 * Prepares the filters for S2
 */
function S2FilterSetup(S2Lowgain, S2Highgain)
{

    S2LowLPfilter.frequency.value = 125;
    S2LowLPfilter.Q.value = filterQ;
    S2LowHPfilter.frequency.value = 400;
    S2LowHPfilter.Q.value = filterQ;

    S2Lowgain.connect(S2LowLPfilter);
    S2LowLPfilter.connect(S2LowHPfilter);
    S2LowHPfilter.connect(S2gain);

    S2HighLPfilter.frequency.value = 2300;
    S2HighLPfilter.Q.value = filterQ;
    S2HighHPfilter.frequency.value = 3500;
    S2HighHPfilter.Q.value = filterQ;

    S2Highgain.connect(S2HighLPfilter);
    S2HighLPfilter.connect(S2HighHPfilter);
    S2HighHPfilter.connect(S2gain);
}

/**
 * Starts or stops S1
 * @param op start or stop
 */
function startstopS1(op)
{
    if(op === "start") {
        // noise1.start();
        for (let i = 0; i < S1LowOscList.length; i++)
        {
            S1LowOscList[i].start();
        }
        for (let i = 0; i < S1HighOscList.length; i++)
        {
            S1HighOscList[i].start();
        }
    }
    else if(op === "stop")
    {
        // noise1.stop();
        for (let i = 0; i < S1LowOscList.length; i++)
        {
            S1LowOscList[i].stop();
        }
        for (let i = 0; i < S1HighOscList.length; i++)
        {
            S1HighOscList[i].stop();
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
        // noise2.start();
        for (let i = 0; i < S2LowOscList.length; i++) {
            S2LowOscList[i].start();
        }
        for (let i = 0; i < S2HighOscList.length; i++) {
            S2HighOscList[i].start();
        }
    }
    else if(op === "stop")
    {
        // noise2.stop();
        for (let i = 0; i < S2LowOscList.length; i++) {
            S2LowOscList[i].stop();
        }
        for (let i = 0; i < S2HighOscList.length; i++) {
            S2HighOscList[i].stop();
        }
    }
}

/**
 * Setups event listeners that control program
 */
function eventSetup()
{
    document.getElementById("tone1").addEventListener("click", function () {
        if (decisionInt === 0) {
            //S1
            nb_rep_correctes++;
            if(MistuningMatrix[currTrial] === 0.2)
            {
                nb_rep_correctes_condition[0]++;
            }
            else
            {
                nb_rep_correctes_condition[1]++;
            }
        } else if (decisionInt === 1) {
            //S2
            if(MistuningMatrix[currTrial] === 0.2)
            {
                compt_mistuning[0]++;
            }
            else
            {
                compt_mistuning[1]++;
            }
        }
        main();
    });
    document.getElementById("tone2").addEventListener("click", function () {
        if (decisionInt === 0) {
            //S2
            if(MistuningMatrix[currTrial] === 0.2)
            {
                compt_mistuning[0]++;
            }
            else
            {
                compt_mistuning[1]++;
            }
        } else if (decisionInt === 1) {
            //S1
            nb_rep_correctes++;
            if(MistuningMatrix[currTrial] === 0.2)
            {
                nb_rep_correctes_condition[0]++;
            }
            else
            {
                nb_rep_correctes_condition[1]++;
            }
        }
        main();
    });
}

/**
 * Update trial num
 */
function updateTrialNum()
{
    currTrial++;
    if(currTrial <= numTrials) {
        document.getElementById("trial").innerHTML = "Trial: " + currTrial + "/" + numTrials;
        document.title = "Inharmonicity Testing - " + currTrial + "/" + numTrials;
    }
}

/**
 * Turns led off
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
 * Turns led on
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