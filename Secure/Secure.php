<?php

$user = "admin";
$pword = $_POST['pword'];

if($user == "admin" && $pword == "hcitraining")
{

    $host = "localhost";
    $user = "auditot7_bej9038";
    $password = "jordan";
    $db = "auditot7_UserData";
    $conn = new mysqli($host, $user, $password, $db);
    if ($conn->connect_error) {
        die("Connection failed: " . $conn->connect_error);
    }

    $result = mysqli_query($conn, "SELECT Username, TrialID from Users");
    $arr = mysqli_fetch_all($result);
    echo json_encode($arr);
    mysqli_free_result($result);

    header('Location: /Implant Testing Program/Secure/Secure.html');
    exit;
}
else {
    header('Location: /Implant Testing Program/Signin/SigninPage.html');
    exit;
}
?>