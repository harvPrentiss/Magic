angular.module('magicCards')

.controller('registrationController', registrationController);

registrationController.$inject = ['$scope', '$rootScope', 'AUTH_EVENTS', 'RegService'];

function registrationController($scope, $rootScope, AUTH_EVENTS, RegService)
{
	$scope.registrationData = {
		userEmail: '',
		userName: '',
		userPassword: '',
		action: 'createUser'
	};

	$scope.register= function(registrationData){
		RegService.register(registrationData).then(function (user){
			$rootScope.$broadcast(AUTH_EVENTS.registrationSuccess);
			$scope.setCurrentUser(user);
			$scope.setLoggedIn(user);
		}, function() {
			$rootScope.$broadcast(AUTH_EVENTS.registrationFailed);
		});
	}
}