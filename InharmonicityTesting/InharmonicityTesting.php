<?php
/**
 * ITP Inharmonicity Testing Module
 *
 * @author Ben Jordan
 */

session_start();
$results = $_POST["results"];
$subj = $_POST["subj"];
$starttime = $_POST["starttime"];
$endtime = $_POST["endtime"];
$trialid = $_SESSION["trialid"];

$host = "localhost";
$user = "auditot7_bej9038";
$password = "jordan";
$db = "auditot7_UserData";

$conn = new mysqli($host,$user,$password,$db);
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

$sql = "INSERT INTO InharmonicityTesting (TrialID, NumCorrect, StartTime, EndTime)
VALUES ($trialid, '$results', '$starttime', '$endtime')";

if ($conn->query($sql) !== TRUE) {
    echo "Error: " . $sql . "<br>" . $conn->error;
}

$conn->close();

header('Location: /Implant Testing Program/Training/TrainingStart.html');
exit;
?>
