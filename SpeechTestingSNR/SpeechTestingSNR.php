<?php
/**
 * ITP Speech Testing Module
 *
 * @author Ben Jordan
 */

session_start();
$subj = $_POST["subj"];
$starttime = $_POST["starttime"];
$endtime = $_POST["endtime"];
$trialid = $_SESSION["trialid"];
$outcome = $_POST["outcome"];
$numc = $_POST["numc"];
$arr = explode(',', $outcome);

$host = "localhost";
$user = "auditot7_bej9038";
$password = "jordan";
$db = "auditot7_UserData";
$conn = new mysqli($host,$user,$password,$db);
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

$sql = "INSERT INTO SpeechTesting(TrialID, StartTime, EndTime, NumCorrect, I1, I2, 
I3, I4, I5, I6, I7, I8, I9, I10, I11, I12, I13, I14, I15, I16, I17, I18, I19, I20, I21, I22, I23, I24, I25, I26, I27, 
I28, I29, I30, I31, I32, I33, I34, I35, I36, I37, I38, I39, I40, I41, I42, I43, I44, I45, I46, I47, I48, I49, I50, I51, 
I52, I53, I54, I55, I56, I57, I58, I59, I60, I61, I62, I63, I64, I65, I66, I67, I68, I69, I70, I71, I72, I73, I74, I75, 
I76, I77, I78, I79, I80, I81, I82, I83, I84, I85, I86, I87, I88, I89, I90, I91, I92, I93, I94, I95, I96, I97, I98, I99,
I100, I101, I102, I103, I104, I105, I106, I107, I108, I109, I110, I111, I112, I113, I114, I115, I116, I117, I118, I119, 
I120)
VALUES ($trialid, '$starttime', '$endtime', '$numc', '$arr[0]', '$arr[1]', '$arr[2]', '$arr[3]', '$arr[4]', '$arr[5]', 
'$arr[6]', '$arr[7]', '$arr[8]', '$arr[9]', '$arr[10]', '$arr[11]', '$arr[12]', '$arr[13]', '$arr[14]', '$arr[15]', 
'$arr[16]', '$arr[17]', '$arr[18]', '$arr[19]', '$arr[20]', '$arr[21]', '$arr[22]', '$arr[23]', '$arr[24]', '$arr[25]', 
'$arr[26]', '$arr[27]', '$arr[28]', '$arr[29]', '$arr[30]', '$arr[31]', '$arr[32]', '$arr[33]', '$arr[34]', '$arr[35]',
'$arr[36]', '$arr[37]', '$arr[38]', '$arr[39]', '$arr[40]', '$arr[41]', '$arr[42]', '$arr[43]', '$arr[44]', '$arr[45]', 
'$arr[46]', '$arr[47]', '$arr[48]', '$arr[49]', '$arr[50]', '$arr[51]', '$arr[52]', '$arr[53]', '$arr[54]', '$arr[55]', 
'$arr[56]', '$arr[57]', '$arr[58]', '$arr[59]', '$arr[60]', '$arr[61]', '$arr[62]', '$arr[63]', '$arr[64]', '$arr[65]', 
'$arr[66]', '$arr[67]', '$arr[68]', '$arr[69]', '$arr[70]', '$arr[71]', '$arr[72]', '$arr[73]', '$arr[74]', '$arr[75]', 
'$arr[76]', '$arr[77]', '$arr[78]', '$arr[79]', '$arr[80]', '$arr[81]', '$arr[82]', '$arr[83]', '$arr[84]', '$arr[85]', 
'$arr[86]', '$arr[87]', '$arr[88]', '$arr[89]', '$arr[90]', '$arr[91]', '$arr[92]', '$arr[93]', '$arr[94]', '$arr[95]', 
'$arr[96]', '$arr[97]', '$arr[98]', '$arr[99]', '$arr[100]', '$arr[101]', '$arr[102]', '$arr[103]', '$arr[104]', 
'$arr[105]', '$arr[106]', '$arr[107]', '$arr[108]', '$arr[109]', '$arr[110]', '$arr[111]', '$arr[112]', '$arr[113]', 
'$arr[114]', '$arr[115]', '$arr[116]', '$arr[117]', '$arr[118]', '$arr[119]')";

if ($conn->query($sql) !== TRUE) {
    echo "Error: " . $sql . "<br>" . $conn->error;
}
header('Location: /Implant Testing Program/Signin/Signin.html');
exit;
?>
