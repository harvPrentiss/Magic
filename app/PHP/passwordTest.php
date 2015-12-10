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

	// passes control and any needed data to the desired function
	function commandRouter($action){
		switch($action) {
			case 'login' : loginUser(); break;
			case 'getUsers': getUsers(); break;
			case 'createUser': createUser(); break;
			case 'deleteUser': deleteUser(); break;
			case 'updateUser': updateUser(); break;
			case 'getDecks' : getDecks(); break;
			case 'createDeck' : createDeck(); break;
			case 'updateDeck' : updateDeck(); break;
			case 'deleteDeck' : deleteDeck(); break;
			default: break;
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