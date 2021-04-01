<?php
/**
 * ITP Training Module
 *
 * @author Ben Jordan
 */

session_start();
$subj = $_POST["subj"];
$starttime = $_POST["starttime"];
$endtime = $_POST["endtime"];
$trialid = $_SESSION["trialid"];
$mousepos = $_POST["mousepos"];
$mousePosString = serialize($mousepos);

//$path = "/home2/auditot7/public_html/Implant Testing Program/UserData/" . $subj . "/Training" . $trialid . ".txt";
$path = "C:/Users/bej71/Desktop/" . $trialid . ".txt";
//$path = "C:/Users/706audio/Desktop/" . $trialid . ".txt";
$fp = fopen($path, 'w');
fwrite($fp, $mousepos . "\n");
fclose($fp);
//
//
//$T1 = $_POST["t1"];
//$T2 = $_POST["t2"];
//$T3 = $_POST["t3"];
//$T4 = $_POST["t4"];
//$T5 = $_POST["t5"];
//$T6 = $_POST["t6"];
//$T7 = $_POST["t7"];
//$T8 = $_POST["t8"];
//$T9 = $_POST["t9"];
//$T10 = $_POST["t10"];
//$T11 = $_POST["t11"];
//$T12 = $_POST["t12"];
//$T13 = $_POST["t13"];
//$T14 = $_POST["t14"];
//$T15 = $_POST["t15"];
//$T16 = $_POST["t16"];
//$T17 = $_POST["t17"];
//$T18 = $_POST["t18"];
//$T19 = $_POST["t19"];
//$T20 = $_POST["t20"];
//
//$host = "localhost";
//$user = "auditot7_bej9038";
//$password = "jordan";
//$db = "auditot7_UserData";
//
//$conn = new mysqli($host,$user,$password,$db);
//if ($conn->connect_error) {
//    die("Connection failed: " . $conn->connect_error);
//}
//
//$sql = "INSERT INTO InharmonicityTraining(TrialID, StartTime, EndTime, T1, T2, T3, T4, T5, T6, T7, T8, T9, T10, T11, T12, T13, T14, T15, T16, T17, T18, T19, T20)
//VALUES ($trialid, '$starttime', '$endtime', $T1, $T2, $T3, $T4, $T5, $T6, $T7, $T8, $T9, $T10, $T11, $T12, $T13, $T14, $T15, $T16, $T17, $T18, $T19, $T20)";
//
//if ($conn->query($sql) !== TRUE) {
//    echo "Error: " . $sql . "<br>" . $conn->error;
//}
//
//$conn->close();

header('Location: /Implant Testing Program/Signin/Signin.html');
exit();
?>

