<?php
	$inData = getRequestInfo();
 
 $id = 0;
 $fName = $inData["firstName"];
 $lName = $inData["lastName"];
 $login = $inData["login"];
 $password = $inData["password"];

	$conn = new mysqli("localhost", "TheBeast", "WeLoveCOP4331", "COP4331");
	if ($conn->connect_error) 
	{
		returnWithError( $conn->connect_error );
	} 
	else
	{
		$stmt = $conn->prepare("INSERT into Users (FirstName, LastName, Login, Password) VALUES(?,?,?,?)");
		$stmt->bind_param("ssss", $fName, $lName, $login, $password);
		$stmt->execute();
    $stmt = $conn->prepare("SELECT ID FROM Users WHERE Login=? AND Password =?");
    $stmt->bind_param("ss", $inData["login"], $inData["password"]);
    $stmt->execute();
    $result = $stmt->get_result();

		if( $row = $result->fetch_assoc()  )
		{
			returnWithInfo( $row['ID'] );
		}
		$stmt->close();
		$conn->close();
	}

	function getRequestInfo()
	{
		return json_decode(file_get_contents('php://input'), true);
	}

	function sendResultInfoAsJson( $obj )
	{
		header('Content-type: application/json');
		echo $obj;
	}
	
	function returnWithError( $err )
	{
		$retValue = '{"error":"' . $err . '"}';
		sendResultInfoAsJson( $retValue );
	}
 function returnWithInfo( $id )
  {
		$retValue = '{"id":' . $id . '}';
		sendResultInfoAsJson( $retValue );
	}
	
?>
