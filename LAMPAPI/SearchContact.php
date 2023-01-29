<?php
	$inData = getRequestInfo();

	$search = $inData["search"];
	$userID = $inData["userID"];

	$conn = new mysqli("localhost", "TheBeast", "WeLoveCOP4331", "COP4331"); 	
	if ($conn->connect_error) {
		returnWithError($conn->connect_error);
	}
	else {
		$stmt = $conn->prepare("SELECT Name, Phone, Email FROM Contacts WHERE UserID = ? AND (Name = ? OR Phone = ? OR Email = ?)");
		$stmt->bind_param("isss", $userID, $search, $search, $search);
		$stmt->execute();
		$result = $stmt->get_result();

		if ($row = $result->fetch_assoc()) {
			returnWithInfo($row['Name'], $row['Phone'], $row['Email']);
		}
		else {
			returnWithError("No Records Found");
		}

		$stmt->close();
		$conn->close();
	}

	function getRequestInfo() {
		return json_decode(file_get_contents('php://input'), true);
	}

	function sendResultInfoAsJson($obj) {
		header('Content-type: application/json');
		echo $obj;
	}

	function returnWithError($err) {
		$retValue = '{"error": "' . $err . '"}';
		sendResultInfoAsJson($retValue);
	}

	function returnWithInfo($name, $phone, $email) {
		$retValue = '{"Name": "' . $name . '", "Phone": "' . $phone . '", "email": "' . $email . '", "error": ""}';
		sendResultInfoAsJson($retValue);
	}
?>