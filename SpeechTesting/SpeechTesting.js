/**
 * ITP Speech Testing Module
 *
 * @author Ben Jordan
 */

let audioCTX = new AudioContext();
let dac = audioCTX.destination;
let trial = 0;
let maxTrials = 120;

let spokenWord;
let spokenWordSource;
let spokenWordBuffer;

let showTime;
let clickTime;

let noise;
let noiseBuffer;

let noiseGain = audioCTX.createGain();
noiseGain.gain.value = 0.4217;

let overallGain = audioCTX.createGain();
overallGain.gain.value = 1.5;

let b1;
let b2;
let b3;
let b4;

let selectedWords = [];
let trialOutcomes = new Array(120).fill("");
let numCorrect = 0;
let numIncorrect = 0;

let wordGroups = [{a: "ball", b: "fall", c: "shawl", d: "wall"}, {a: "fall", b: "ball", c: "shawl", d: "wall"},
    {a: "shawl", b: "ball", c: "fall", d: "wall"}, {a: "wall", b: "ball", c: "fall", d: "shawl"},

    {a: "ban", b:	"man", c: "van", d:	"than"}, {a: "man", b:	"ban", c: "van", d:	"than"},
    {a: "van", b:	"ban", c: "man", d:	"than"}, {a: "than", b:	"ban", c: "van", d:	"man"},

    {a: "lash", b: "bash", c: "dash", d: "gash"}, {a: "bash", b: "lash", c: "dash",d: "gash"},
    {a: "dash", b: "lash", c: "bash", d: "gash"}, {a: "gash", b: "lash", c: "bash",d: "dash"},

    {a: "patch", b: "thatch", c: "match", d: "batch"}, {a: "thatch", b: "patch", c: "match", d: "batch"},
    {a: "match", b: "patch", c: "latch", d: "batch"}, {a: "batch", b: "patch", c: "latch", d: "match"},

    {a: "lead", b: "mead", c: "weed", d: "need"}, {a: "mead", b: "lead", c: "weed", d: "need"},
    {a: "weed", b: "lead", c: "mead", d: "need"}, {a: "need", b: "lead", c: "mead", d: "weed"},

    {a: "beer", b: "gear", c: "dear", d: "tier"}, {a: "gear", b: "beer", c: "dear", d: "tier"},
    {a: "dear", b: "beer", c: "gear", d: "tier"}, {a: "tier", b: "beer", c: "gear", d: "dear"},

    {a: "yet", b: "vet", c: "get", d: "net"}, {a: "vet", b: "yet", c: "get", d: "net"},
    {a: "get", b: "yet", c:	"vet", d: "net"}, {a: "net", b: "yet", c: "vet", d: "get"},

    {a: "bill", b: "till", c: "gill", d: "dill"}, {a: "till", b: "bill", c: "gill", d: "dill"},
    {a: "gill", b: "bill", c: "till", d: "dill"}, {a: "dill", b: "bill", c: "till", d: "gill"},

    {a: "bob", b: "cob", c:	"sob", d: "gob"}, {a: "cob", b: "bob", c: "sob", d: "gob"},
    {a: "sob", b: "bob", c: "cob", d: "gob"}, {a: "gob", b: "bob", c: "cob", d: "sob"},

    {a: "boom", b: "doom", c: "womb", d: "room"}, {a: "doom", b: "boom", c: "womb", d: "room"},
    {a: "womb", b: "boom", c: "doom", d: "room"}, {a: "room", b: "boom", c: "doom", d: "womb"},

    {a: "boom", b: "dune", c: "noon", d: "moon"}, {a: "dune", b: "boon", c: "noon", d: "moon"},
    {a: "noon", b: "boon", c: "dune", d: "moon"}, {a: "moon", b: "boon", c: "dune", d: "noon"},

    {a: "cop", b: "pop", c: "top", d: "shop"}, {a: "pop", b: "cop", c: "top", d: "shop"},
    {a: "top", b: "cop", c: "pop", d: "shop"},  {a: "shop", b: "cop", c: "pop", d: "top"},

    {a: "that", b: "vat", c: "cat", d: "sat"}, {a: "vat", b: "that", c: "cat", d: "sat"},
    {a: "cat", b: "vat", c: "that", d: "sat"}, {a: "sat", b: "vat", c: "that", d: "cat"},

    {a: "caught", b: "taught", c: "fought", d: "thought"},  {a: "taught", b: "caught", c: "fought", d: "thought"},
    {a: "fought", b: "caught", c: "taught", d: "thought"}, {a: "thought", b: "caught", c: "taught", d: "fought"},

    {a: "tell", b: "cell", c: "shell", d: "yell"}, {a: "cell", b: "tell", c: "shell", d: "yell"},
    {a: "shell", b: "tell", c: "cell", d: "yell"}, {a: "yell", b: "tell", c: "cell", d: "shell"},

    {a: "chute", b: "coot", c: "suit", d: "toot"}, {a: "coot", b: "chute", c: "suit", d: "toot"},
    {a: "suit", b: "chute", c: "coot", d: "toot"}, {a: "toot", b: "chute", c: "coot", d: "suit"},

    {a: "took", b: "look", c: "cook", d: "rook"}, {a: "look", b: "took", c: "cook", d: "rook"},
    {a: "cook", b: "took", c: "look", d: "rook"}, {a: "rook", b: "took", c: "look", d: "cook"},

    {a: "cool", b: "pool", c: "fool", d: "ghoul"}, {a: "pool", b: "cool", c: "fool", d: "ghoul"},
    {a: "fool", b: "cool", c: "pool", d: "ghoul"}, {a: "ghoul", b: "cool", c: "pool", d: "fool"},

    {a: "watt", b: "lot", c: "rot", d: "yacht"}, {a: "lot", b: "watt", c: "rot", d: "yacht"},
    {a: "rot", b: "watt", c: "lot", d: "yacht"}, {a: "yacht", b: "watt", c: "lot", d: "rot"},

    {a: "dab", b: "fab", c: "gab", d: "nab"}, {a: "fab", b: "dab", c: "gab", d: "nab"},
    {a: "gab", b: "dab", c: "fab", d: "nab"}, {a: "nab", b: "dab", c: "fab", d: "gab"},

    {a: "said", b: "dead", c: "red", d: "led"}, {a: "dead", b: "said", c: "red", d: "led"},
    {a: "red", b: "said", c: "dead", d: "led"}, {a: "led", b: "said", c: "dead", d: "red"},

    {a: "kneel", b: "meal", c: "veal", d: "feel"}, {a: "meal", b: "kneel", c: "veal", d: "feel"},
    {a: "veal", b: "kneel", c: "meal", d: "feel"}, {a: "feel", b: "kneel", c: "veal", d: "meal"},

    {a: "sin", b: "shin", c: "kin", d: "thin"}, {a: "shin", b: "sin", c: "kin", d: "thin"},
    {a: "kin", b: "sin", c: "shin", d: "thin"}, {a: "thin", b: "sin", c: "shin", d: "kin"},

    {a: "zip", b: "lip", c: "yip", d: "rip"}, {a: "lip", b: "zip", c: "yip", d: "rip"},
    {a: "yip", b: "zip", c: "lip", d: "rip"}, {a: "rip", b: "zip", c: "lip", d: "yip"},

    {a: "ken", b: "pen", c: "then", d: "zen"}, {a: "pen", b: "ken", c: "then", d: "zen"},
    {a: "then", b: "ken", c: "pen", d: "zen"}, {a: "zen", b: "ken", c: "pen", d: "then"},

    {a: "king", b: "ping", c: "thing", d: "zing"}, {a: "ping", b: "king", c: "thing", d: "zing"},
    {a: "thing", b: "king", c: "ping", d: "zing"}, {a: "zing", b: "king", c: "ping", d: "thing"},

    {a: "sit", b: "zit", c: "lit", d: "mitt"}, {a: "zit", b: "sit", c: "lit", d: "mitt"},
    {a: "lit", b: "sit", c: "zit", d: "mitt"}, {a: "mitt", b: "sit", c: "zit", d: "lit"},

    {a: "lock", b: "rock", c: "mock", d: "wok"}, {a: "rock", b: "lock", c: "mock", d: "wok"},
    {a: "mock", b: "rock", c: "lock", d: "wok"}, {a: "wok", b: "rock", c: "lock", d: "mock"},

    {a: "more", b: "pour", c: "tore", d: "shore"}, {a: "pour", b: "more", c: "tore", d: "shore"},
    {a: "tore", b: "more", c: "pour", d: "shore"}, {a: "shore", b: "more", c: "pour", d: "tore"},

    {a: "pong", b: "tong", c: "thong", d: "song"}, {a: "tong", b: "pong", c: "thong", d: "song"},
    {a: "thong", b: "pong", c: "tong", d: "song"}, {a: "song", b: "pong", c: "tong", d: "thong"},
];

/**
 * Controls the flow of a trial
 */
function main()
{
    trial++;
    if(trial > maxTrials)
    {
        saveData();
    }
    else
    {
        document.getElementById("trial").innerHTML = "Trial: " + trial + "/" + maxTrials;
        document.title = "Speech Testing - " + trial + "/" + maxTrials;
        randSelectValues();
        loadAudio();
        loadNoise();
        playSpeech();
        setTimeout(fillButtons, 2400);
    }
}

function saveData()
{
    document.getElementById("subj").value = sessionStorage.getItem("name");
    document.getElementById("starttime").value = localStorage.getItem("starttime");
    let d = new Date();
    let endtime = d.getHours() + ":" + d.getMinutes() + ":" + d.getSeconds();
    document.getElementById("endtime").value = endtime;
    document.getElementById("outcome").value = trialOutcomes;
    document.getElementById("numc").value = numCorrect;
    document.forms["speechsave"].submit();
}
/**
 * Loads the audio buffer for play
 */
function loadAudio()
{
    spokenWordBuffer = new Audio(getUrl(spokenWord));
}

/**
 * Loads a random noise file
 */
function loadNoise()
{
    let num = Math.floor(Math.random() * 120) + 1;
    let noiseurl;
    if(num < 10)
    {
        noiseurl = "/Implant Testing Program/SpeechTesting/_noises/babble00" + num + ".wav";
    }
    else if(num < 100)
    {
        noiseurl = "/Implant Testing Program/SpeechTesting/_noises/babble0" + num + ".wav";
    }
    else
    {
        noiseurl = "/Implant Testing Program/SpeechTesting/_noises/babble" + num + ".wav";
    }
    noiseBuffer = new Audio(noiseurl);
}

/**
 * Randomly selects the values to be used for a trial
 */
function randSelectValues()
{
    let wordGroupArr = [];
    //find the word group
    let i = Math.floor(Math.random() * wordGroups.length);
    let wordGroup = wordGroups[i];
    wordGroups.splice(i, 1);

    b1 = wordGroup.a;
    wordGroupArr.push(b1);
    b2 = wordGroup.b;
    wordGroupArr.push(b2);
    b3 = wordGroup.c;
    wordGroupArr.push(b3);
    b4 = wordGroup.d;
    wordGroupArr.push(b4);

    for(let i = 0; i < 4; i++)
    {
        let rand = Math.floor(Math.random() * wordGroupArr.length);
        if(!selectedWords.includes(wordGroupArr[rand]))
        {
           spokenWord = wordGroupArr[rand];
           selectedWords.push(wordGroupArr[rand]);
           break;
        }
        else
        {
            wordGroupArr.splice(rand, 1);
        }
    }
}

/**
 * Returns the url of a file with a given name. Randomly choose male or female voice
 * @param name The name
 * @returns {string} The url
 */
function getUrl(name)
{
    let rand = Math.floor(Math.random() * 2) + 1;
    if(rand === 1)
    {
        return "/Implant Testing Program/SpeechTesting/_desmond/" + name + ".wav";
    }
    else if(rand === 2)
    {
        return "/Implant Testing Program/SpeechTesting/_emma/" + name + ".wav";
    }
}

/**
 * Sets up audio connections and then calls playSound
 */
function playSpeech()
{
    spokenWordSource = audioCTX.createMediaElementSource(spokenWordBuffer);
    spokenWordSource.connect(overallGain);

    noise = audioCTX.createMediaElementSource(noiseBuffer);
    noise.connect(noiseGain);
    noiseGain.connect(overallGain);

    overallGain.connect(dac);

    playSound();
}

/**
 * Plays the sounds and turns on led
 */
function playSound()
{
    ledOn();
    noiseBuffer.play();
    setTimeout(function () {
        spokenWordBuffer.play();
        setTimeout(function () {
            ledOff();
        }, 1000);
    }, 1000);
}

/**
 * Assigns each button its value
 */
function fillButtons()
{
    document.getElementById("c1").value = b1;
    document.getElementById("c2").value = b2;
    document.getElementById("c3").value = b3;
    document.getElementById("c4").value = b4;
    document.getElementById("wordselect").style.display = "flex";

    showTime = new Date();
}

/**
 * Handles a button click
 * @param b The button number
 */
function buttonClick(b)
{
    clickTime = new Date();

    let userWord;
    if(b === 1)
    {
        userWord = b1;
    }
    else if(b === 2)
    {
        userWord = b2;
    }
    else if(b === 3)
    {
        userWord = b3;
    }
    else if(b === 4)
    {
        userWord = b4;
    }

    if(spokenWord === userWord)
    {
        numCorrect++;
    }
    else
    {
        numIncorrect++;
    }
    let outcome = "\nS: " + spokenWord + " U: " + userWord + " T: " + Math.abs(clickTime.getHours() - showTime.getHours()) + ":" +
    Math.abs(clickTime.getMinutes() - showTime.getMinutes()) + ":" +
    Math.abs(clickTime.getSeconds() - showTime.getSeconds()) + ":" +
    String(Math.abs(clickTime.getMilliseconds() - showTime.getMilliseconds())).padStart(3, '0');

    trialOutcomes[trial - 1] = outcome;

    document.getElementById("wordselect").style.display = "none";
    main();
}

/**
 * Turns the led on
 */
function ledOn()
{
    let led = document.getElementById("led-red");
    led.style.webkitAnimation = "turnRed .5s";
    led.style.mozAnimation = "turnRed .5s";
    led.style.msAnimation = "turnRed .5s";
    led.style.animation = "turnRed .5s";
    led.style.oAnimation = "turnRed .5s";
    setTimeout(function () {
        led.style.webkitAnimationPlayState = "paused";
        led.style.mozAnimationPlayState = "paused";
        led.style.msAnimationPlayState = "paused";
        led.style.animationPlayState = "paused";
        led.style.oAnimationPlayState = "paused";
    }, 475);
}

/**
 * Turns the led off
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
