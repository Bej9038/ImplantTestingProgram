<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="author" content="Ben Jordan">

    <title>Admin Mode</title>
    <link rel="stylesheet" href="../Style.css">
    <link rel="stylesheet" href="../ExtraUI.css">
    <link rel="stylesheet" href="../Secure/Secure.css">
    <link href="https://fonts.googleapis.com/icon?family=Material+Icons"
          rel="stylesheet">
</head>
<body>
    <h1>User Data</h1>

    <input id = exit type = button value = 'EXIT' onclick = "location.href =
    '/Implant%20Testing%20Program/Signin/SigninPage.html'">

    <?php
        echo "<table id = dataTable>";
        $host = "localhost";
        $user = "auditot7_bej9038";
        $password = "jordan";
        $db = "auditot7_UserData";
        $conn = new mysqli($host,$user,$password,$db);
        if ($conn->connect_error) {
            die("Connection failed: " . $conn->connect_error);
        }

        $sql = "SELECT Username, TrialID from Users";
        $result = $conn -> query($sql);

        if($result-> num_rows > 0)
        {
            while($row = $result -> fetch_assoc())
            {
                echo "<tr id='sqlData'><td>". $row["Username"] . "<td><td>" . $row["TrialID"] . "</td></tr>";
            }
        }
        else {
            echo "0 result";
        }
        echo "</table>";
        ?>

    <button type = button class="mdc-icon-button material-icons" id = actionButton>delete</button>

    <div id = dataSets>
        <input type = button class = dataSetSelector value = 'Threshold Testing' onclick = displayUserData(1)>
        <input type = button class = dataSetSelector value = 'Loudness Matching' onclick= displayUserData(2)>
        <input type = button class = dataSetSelector value = 'Inharmonicity Testing' onclick = displayUserData(3)>
        <input type = button class = dataSetSelector value = 'Speech-In-Noise' onclick = displayUserData(4)>
        <input type = button class = dataSetSelector value = 'Inharmonicity Training' onclick = displayUserData(5)>
    </div>
</body>
</html>

<script>
    function displayUserData(dataset)
    {

    }

</script>