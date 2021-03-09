<?php
/**
 * ITP Threshold Testing Module
 *
 * @author Ben Jordan
 */
session_start();

$freq = $_POST["freq"];
$amp = $_POST["amp"];
$subj = $_POST["subj"];
$starttime = $_POST["starttime"];
$endtime = $_POST["endtime"];
$trialid = $_SESSION["trialid"];

if($freq === '125')
{
    $_SESSION['F125'] = $amp;
}
else if($freq === '250')
{
    $_SESSION['F250'] = $amp;
}
else if($freq === '500')
{
    $_SESSION['F500'] = $amp;
}
else if($freq === '1000')
{
    $_SESSION['F1000'] = $amp;
}
else if($freq === '2000')
{
    $_SESSION['F2000'] = $amp;
}
else if($freq === '4000')
{
    $_SESSION['F4000'] = $amp;
}
else if($freq === '8000')
{
    $host = "localhost";
    $user = "auditot7_bej9038";
    $password = "jordan";
    $db = "auditot7_UserData";

    $F125 = $_SESSION['F125'];
    $F250 = $_SESSION['F250'];
    $F500 = $_SESSION['F500'];
    $F1000 = $_SESSION['F1000'];
    $F2000 = $_SESSION['F2000'];
    $F4000 = $_SESSION['F4000'];
    $F8000 = $amp;

    $conn = new mysqli($host,$user,$password,$db);
    if ($conn->connect_error) {
        die("Connection failed: " . $conn->connect_error);
    }

    $sql = "INSERT INTO ThresholdTesting (TrialID, StartTime, EndTime, F125, F250, F500, F1000, F2000, F4000, F8000)
    VALUES ($trialid, '$starttime', '$endtime', $F125, $F250, $F500, $F1000, $F2000, $F4000, $F8000)";

    if ($conn->query($sql) !== TRUE) {
        echo "Error: " . $sql . "<br>" . $conn->error;
    }

    $conn->close();
}

header('Location: /Implant Testing Program/ThresholdTesting/ThresholdTesting.html');
exit;
?>
