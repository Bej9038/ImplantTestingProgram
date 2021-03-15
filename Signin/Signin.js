let isAdminShowing = 0;
let isSINShowing = 0;
let isTrainingShowing = 0;

function pageSetup()
{
    if(sessionStorage.getItem("name"))
    {
        showModules();
    }
    else
    {
        let d = new Date();
        document.getElementById("currenttime").value = d.getHours() + ":" + d.getMinutes() + ":" + d.getSeconds();
    }

    //selected current training mode
    if(!sessionStorage.getItem('trainingmode'))
    {
        sessionStorage.setItem('trainingmode', 'E');
    }
    else
    {
        if(sessionStorage.getItem('trainingmode') === 'E')
        {
            switchTrainingMode('E');
        }
        else
        {
            switchTrainingMode('H');
        }
    }

    //select current sin mode
    if(!sessionStorage.getItem('sinmode'))
    {
        sessionStorage.setItem('sinmode', 'S');
    }
    else
    {
        if(sessionStorage.getItem('sinmode') === 'S')
        {
            switchSINMode('S');
        }
        else if(sessionStorage.getItem('sinmode') === 'P')
        {
            switchSINMode('P');
        }
        if(sessionStorage.getItem('sinmode') === 'R')
        {
            switchSINMode('R');
        }
    }
}

function showModules()
{
    if(!sessionStorage.getItem("name"))
    {
        setTimeout(function ()
        {
            window.alert("Invalid Username");
        }, 1000);
    }
    else {
        if("<?php echo '$isadmin'?>" && "<?php echo '$isadmin'?>" === "1")
        {
            document.getElementById('pd').style.display = "flex";
        }
        if(sessionStorage.getItem("isFromSignin") === null)
        {
            document.getElementById("signin").style.animation = "fadeout ease .3s";
            setTimeout(function ()
            {
                document.getElementById("signin").style.display = "none";
                document.getElementById("menu").style.display = "flex";
                document.getElementById("settingsmenu").style.display = "flex";
                document.getElementById("welcome").innerHTML = "Welcome " + sessionStorage.getItem("name");
                sessionStorage.setItem("isFromSignin", "1");
            }, 100);
        }
        else
        {
            document.getElementById("signin").style.display = "none";
            document.getElementById("menu").style.display = "flex";
            document.getElementById("settingsmenu").style.display = "flex";
            document.getElementById("welcome").innerHTML = "Welcome " + sessionStorage.getItem("name");
        }
    }
}

function storeVariable()
{
    sessionStorage.setItem("name", document.getElementById('name').value);
}

function siclick()
{
    storeVariable();
    setTimeout(function () {
        showModules();
    }, 1000);
}

function toggleSettings()
{
    if(getComputedStyle(document.getElementById('dropdown')).getPropertyValue('display') === "none")
    {
        document.getElementById('dropdown').style.display = "flex";
        document.getElementById('dropdown').style.animation = "slideleft .8s forwards";
        document.getElementById('blurbody').style.animation = "filter .8s ease-in forwards";
        document.getElementById('menu').style.pointerEvents = "none";
        setTimeout(function () {
            document.getElementById('blurbody').onclick = toggleSettings;
        }, 10);
    }
    else if(getComputedStyle(document.getElementById('dropdown')).getPropertyValue('display') === "flex")
    {
        if(isAdminShowing)
        {
            adminPrompt();
        }
        else if(isSINShowing)
        {
            sinmodePrompt();
        }
        else if(isTrainingShowing)
        {
            trainingPrompt();
        }

        document.getElementById('dropdown').style.animation = "slideright .8s forwards";
        document.getElementById('blurbody').style.animation = "unfilter .8s ease-out forwards";
        setTimeout(function (){
            document.getElementById('menu').style.pointerEvents = "all";
            document.getElementById('dropdown').style.display = "none";
            document.getElementById('blurbody').onclick = null;
            }, 800);
    }
}

function switchSINMode(mode)
{
    if(mode === 'S')
    {
        sessionStorage.setItem('sinmode', 'S');
        document.getElementById('beg').onclick = function () {
            location.href = '/Implant%20Testing%20Program/SpeechTesting/SpeechTestingStart.html';
        };
        //document.getElementById("beg").value = "Speech-In-Noise";

        document.getElementById('s').classList.add('modebuttonSelected');
        document.getElementById('s').classList.remove('modebutton');
        document.getElementById('p').classList.add('modebutton');
        document.getElementById('p').classList.remove('modebuttonSelected');
        document.getElementById('r').classList.add('modebutton');
        document.getElementById('r').classList.remove('modebuttonSelected');
    }
    else if(mode === 'P')
    {
        sessionStorage.setItem('sinmode', 'P');
        document.getElementById('beg').onclick = function () {
            location.href = '/Implant%20Testing%20Program/SpeechTestingPractice/SpeechTestingPracticeStart.html';
        };
        //document.getElementById("beg").value = "Speech-In-Noise Practice";

        document.getElementById('s').classList.add('modebutton');
        document.getElementById('s').classList.remove('modebuttonSelected');
        document.getElementById('p').classList.add('modebuttonSelected');
        document.getElementById('p').classList.remove('modebutton');
        document.getElementById('r').classList.add('modebutton');
        document.getElementById('r').classList.remove('modebuttonSelected');
    }
    else if(mode === 'R')
    {
        sessionStorage.setItem('sinmode', 'R');
        document.getElementById('beg').onclick = function () {
            location.href = '/Implant%20Testing%20Program/SpeechTestingSNR/SpeechTestingSNRStart.html';
        };
        //document.getElementById("beg").value = "Speech-In-Noise SNR";

        document.getElementById('s').classList.add('modebutton');
        document.getElementById('s').classList.remove('modebuttonSelected');
        document.getElementById('p').classList.add('modebutton');
        document.getElementById('p').classList.remove('modebuttonSelected');
        document.getElementById('r').classList.add('modebuttonSelected');
        document.getElementById('r').classList.remove('modebutton');
    }
}

function switchTrainingMode(mode)
{
    if(mode === 'E')
    {
        sessionStorage.setItem('trainingmode', 'E');
        document.getElementById('ts').classList.add('modebuttonSelected');
        document.getElementById('ts').classList.remove('modebutton');
        document.getElementById('tr').classList.add('modebutton');
        document.getElementById('tr').classList.remove('modebuttonSelected');
    }
    else if(mode === 'H')
    {
        sessionStorage.setItem('trainingmode', 'H');
        document.getElementById('tr').classList.add('modebuttonSelected');
        document.getElementById('tr').classList.remove('modebutton');
        document.getElementById('ts').classList.add('modebutton');
        document.getElementById('ts').classList.remove('modebuttonSelected');
    }
}

function adminPrompt()
{
    if(!isAdminShowing)
    {
        document.getElementById('admindialog').style.animation = 'fadein ease .8s forwards';
        document.getElementById("admindialog").style.display = "flex";
        isAdminShowing = 1;

        if(isSINShowing)
        {
            sinmodePrompt();
        }
        else if(isTrainingShowing)
        {
            trainingPrompt();
        }
    }
    else
    {
        document.getElementById('admindialog').style.animation = 'fadeout ease .8s forwards';
        setTimeout(function () {
            document.getElementById("admindialog").style.display = "none";
            isAdminShowing = 0;
        }, 800);
    }
}

function sinmodePrompt() {
    if(!isSINShowing)
    {
        document.getElementById('sindialog').style.animation = 'fadein ease .8s forwards';
        document.getElementById("sindialog").style.display = "flex";
        isSINShowing = 1;

        if(isAdminShowing)
        {
            adminPrompt();
        }
        else if(isTrainingShowing)
        {
            trainingPrompt();
        }
    }
    else
    {
        document.getElementById('sindialog').style.animation = 'fadeout ease .8s forwards';
        setTimeout(function () {
            document.getElementById("sindialog").style.display = "none";
            isSINShowing = 0;
        }, 800);
    }
}

function trainingPrompt() {
    if(!isTrainingShowing)
    {
        document.getElementById('trainingdialog').style.animation = 'fadein ease .8s forwards';
        document.getElementById("trainingdialog").style.display = "flex";
        isTrainingShowing = 1;

        if(isAdminShowing)
        {
            adminPrompt();
        }
        else if(isSINShowing)
        {
            sinmodePrompt();
        }
    }
    else
    {
        document.getElementById('trainingdialog').style.animation = 'fadeout ease .8s forwards';
        setTimeout(function () {
            document.getElementById("trainingdialog").style.display = "none";
            isTrainingShowing = 0;
        }, 800);
    }
}