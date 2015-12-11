angular.module('magicCards')

.controller('applicationController', applicationController);

applicationController.$inject = ['$scope', 'USER_ROLES', 'AuthService'];

function applicationController($scope, USER_ROLES, AuthService)
{
	$scope.currentUser = null;
	$scope.userRoles = USER_ROLES;
	$scope.isAuthorized = AuthService.isAuthorized;
	$scope.register = false;
	$scope.login = false;
	$scope.welcome = false;
	$scope.setCurrentUser = function(user){
		$scope.currentUser = user;
	};
	$scope.setLoggedIn = function(user){
		$scope.register = false;
		$scope.login = false;
		$scope.welcome = true;
	};
	$scope.setLogin = function(){
		$scope.login = true;
		$scope.register = false;
	};
	$scope.setRegister = function(){
		$scope.register = true;
		$scope.login = false;
	};
	$scope.setNone = function(){
		$scope.register = false;
		$scope.login = false;
	};
}