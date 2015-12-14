angular.module('magicCards')

.controller('applicationController', applicationController);

applicationController.$inject = ['$scope', 'USER_ROLES', 'AuthService'];

function applicationController($scope, USER_ROLES, AuthService)
{
	$scope.currentUser = null;
	$scope.userRoles = USER_ROLES;
	$scope.isAuthorized = AuthService.isAuthorized;
	$scope.userStatus = "none";
	$scope.loggedIn = false;
	$scope.setCurrentUser = function(user){
		$scope.currentUser = user;		
	};
	$scope.setLogin = function(){
		$scope.userStatus = "login";
	};
	$scope.setRegister = function(){
		$scope.userStatus = "register";
	};
	$scope.setLoggedIn = function(){
		$scope.userStatus = "loggedIn";
		$scope.loggedIn = true;
	};
	$scope.setNone = function(){
		$scope.userStatus = "none";
	};
}