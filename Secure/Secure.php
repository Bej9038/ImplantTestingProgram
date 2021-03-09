<?php

$user = "admin";
$pword = $_POST['pword'];

if($user == "admin" && $pword == "hcitraining")
{
    header('Location: /Implant Testing Program/Secure/Secure.html.php');
    exit;
}
else {
    header('Location: /Implant Testing Program/Signin/SigninPage.html');
    exit;
}
?>