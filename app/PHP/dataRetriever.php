<?php
	
	/* Functions for the database */
	include_once 'databaseConnector.php';
	//require_once("../config.php");
	$dbConnection;	
	// Checks for a command action being passed to this file
	if(isset($_POST['action']) && !empty($_POST['action'])) {	
	    $action = $_POST['action'];
	    commandRouter($action);
	}
	else{
		echo json_encode("Action Failed");
	}

	// passes control and any needed data to the desired function
	function commandRouter($action){
		switch($action) {
			case 'login' : loginUser(); break;
			case 'createUser': createUser(); break;
			case 'getUser': getUser(); break;			
			case 'deleteUser': deleteUser(); break;
			case 'updateUser': updateUser(); break;
			case 'getDecks' : getDecks(); break;
			case 'createDeck' : createDeck(); break;
			case 'updateDeck' : updateDeck(); break;
			case 'deleteDeck' : deleteDeck(); break;
			default: break;
		}
	}

	// Creates a DatabaseConnection object
	function getConnection(){
		global $dbConnection;
		$dbConnector = new DatabaseConnector();
		$dbConnection = $dbConnector->connect();
		if($dbConnection == "Failed to connect"){
			return json_encode("Connection to the database has failed");
		}
		else{
			return json_encode("Connection successful");
		}
	}
	// Determines if the dbConnection variable has been set yet 
	function connectionExists(){
		global $dbConnection;
		if($dbConnection == null){
			return false;
		}
		else{
			return true;
		}
	}

	function loginUser(){
		global $dbConnection;
		if(!connectionExists()){
			getConnection();
		}
		$errorObject = array();
		$userEmail = $_POST['userEmail'];
		$stmt = $dbConnection->prepare("SELECT * FROM users WHERE email = '$userEmail'");
		$stmt->execute();
		if($stmt->rowCount() > 0){
			$result = $stmt->fetch(PDO::FETCH_ASSOC);
			if(verifyPassword($_POST['userPassword'], $result['passwordHash'])){
				$userData = array();
				$userData['id'] = $result['id'];
				$userData['userName'] = $result['userName'];
				$userData['userEmail'] = $result['userEmail'];
				$userData['dateJoined'] = $result['dateJoined'];
				echo json_encode($userData);
			}
			else{			
				$errorObject['message'] = 'Incorrect password';
				$errorObject['passHash'] = $result['passwordHash'];
				$errorObject['userPass'] = getSecurePassword($_POST['userPassword']);
				echo json_encode($errorObject);
			}
		}
		else{
			$errorObject['message'] = 'Email does not exist';
			echo json_encode($errorObject);
		}
	}


	function createUser(){
		global $dbConnection;
		if(!connectionExists()){
			getConnection();
		}
		$passwordHash = getSecurePassword($_POST['userPassword']);
		$date = date('Y-m-d H:i:s');
		$userEmail = $_POST['userEmail'];
		$userName = $_POST['userName'];
		$stmt = $dbConnection->prepare("INSERT INTO users (email, userName, passwordHash, dateJoined) VALUES ('$userEmail', '$userName', '$passwordHash', '$date')");
		$stmt->execute();
		if($stmt == TRUE){
			$userData = array();
			$userData['userName'] = $_POST['userName'];
			$userData['id'] = $dbConnection->lastInsertId();
			echo json_encode($userData);
		}
		else{
			echo json_encode("Failure");
		}
	}

	// Internal functions

	function getSecurePassword($password){
		return password_hash($password, PASSWORD_DEFAULT);
	}

	function verifyPassword($password, $hash){
		return password_verify($password, $hash);
	}
	

?>