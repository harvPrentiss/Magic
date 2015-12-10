<?php
	class DatabaseConnector{
		//MySQL Database connection variables
		const SERVER = "localhost";
		const USER = "harvpren_master";
		const PASSWORD = "Magneto3!";
		const DATABASE = "harvpren_magicCards";
		//Returns an active connection to the database
		function connect(){
			try{
			    //$connection = new PDO( "sqlsrv:Server=". self::SERVER . " ; Database =". self::DATABASE , self::USER, self::PASSWORD);
			    $connection = new PDO( "mysql:localhost;dbname=harvpren_magicCards;charset=utf8" , self::USER, self::PASSWORD);
			    $connection->setAttribute( PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION );
			    return $connection;
			}
			catch(Exception $e){
				ChromePhp::log($e);
			    return $e->getMessage();
			}	
		}
	}
?>