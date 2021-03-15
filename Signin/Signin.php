<?php
/**
 * ITP Signin Page
 *
 * @author Ben Jordan
 */

//session_start();
//$subj = $_POST["name"];
//$currenttime = $_POST["currenttime"];
//$_SESSION["subj"] = $subj;
//
////UserData
//
//$path = "/home2/auditot7/public_html/Implant Testing Program/UserData/" . $subj;
//
//if ($subj)
//{
//    if (!file_exists($path)) {
//        mkdir($path, 0777, true);
//    }
//}
//
////DB
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
////find trial id
//$trialid = null;
//$result = mysqli_query($conn, "SELECT MAX(TrialID) as 'max' FROM Users");
//if($result)
//{
//    $row = mysqli_fetch_array($result);
//    $trialid = $row['max'] + 1;
//    $_SESSION["trialid"] = $trialid;
//}
//
//$sql = "INSERT INTO Users (Username, TrialID, SignInTime)
//VALUES ('$subj', $trialid, '$currenttime')";
//
//if ($conn->query($sql) !== TRUE) {
//    echo "Error: " . $sql . "<br>" . $conn->error;
//}
//
//mysqli_free_result($result);
//$conn->close();

header('Location: /Implant Testing Program/Signin/SigninPage.html');
exit;
?>