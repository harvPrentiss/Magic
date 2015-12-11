var app = angular.module('magicCards', [], function($httpProvider){
	// Use x-www-form-urlencoded Content-Type
	  $httpProvider.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=utf-8';
	 
	  /**
	   * The workhorse; converts an object to x-www-form-urlencoded serialization.
	   * @param {Object} obj
	   * @return {String}
	   */ 
	  var param = function(obj) {
	    var query = '', name, value, fullSubName, subName, subValue, innerObj, i;
	      
	    for(name in obj) {
	      value = obj[name];
	        
	      if(value instanceof Array) {
	        for(i=0; i<value.length; ++i) {
	          subValue = value[i];
	          fullSubName = name + '[' + i + ']';
	          innerObj = {};
	          innerObj[fullSubName] = subValue;
	          query += param(innerObj) + '&';
	        }
	      }
	      else if(value instanceof Object) {
	        for(subName in value) {
	          subValue = value[subName];
	          fullSubName = name + '[' + subName + ']';
	          innerObj = {};
	          innerObj[fullSubName] = subValue;
	          query += param(innerObj) + '&';
	        }
	      }
	      else if(value !== undefined && value !== null)
	        query += encodeURIComponent(name) + '=' + encodeURIComponent(value) + '&';
	    }
	      
	    return query.length ? query.substr(0, query.length - 1) : query;
	  };
	 
	  // Override $http service's default transformRequest
	  $httpProvider.defaults.transformRequest = [function(data) {
	    return angular.isObject(data) && String(data) !== '[object File]' ? param(data) : data;
	  }];
});

app.constant('AUTH_EVENTS', {
	loginSuccess: 'auth-login-success',
	loginFailed: 'auth-login-failed',
	sessionTimeout: 'auth-session-timeout',
	notAuthenticated: 'auth-not-authenticated',
	notAuthorized: 'auth-not-authorized',
	registrationSuccess: 'auth-registration-success',
	registrationFailed: 'auth-registration-failed'
});

app.constant('USER_ROLES', {
	all : '*',
	admin: 'admin',
	user: 'user',
	guest: 'guest'
});

app.factory("CardRequester", function($http, $q){
	var CardRequester = {};
	var baseURL = 'https://api.deckbrew.com/mtg/';
	var _finalURL = '';

	var makeURL = function(options){
		_finalURL = baseURL + options;
	};


	CardRequester.makeRequest = function(options){
		makeURL(options);
		var deffered = $q.defer();
		$http({
			method: 'GET',
			url: _finalURL
		}).success(function(data){
			deffered.resolve(data);
		}).error(function(){
			deffered.reject('There was an error');
		});
		return deffered.promise;
	};

	return CardRequester;
});

app.factory('AuthService', function($http, Session){
	var authService = {};

	authService.login = function(credentials){
		return $http({
			method: 'POST',
			url:'app/PHP/dataRetriever.php',
			data: credentials
		})
		.then(function(res){
			console.log(res);
			/*Session.create(res.data.id, res.data.userName, "User");
			return res.data.userName;*/
		});
	};

	authService.isAuthenticated = function(){
		return !!Session.userId;
	};

	authService.isAuthorized = function(authorizedRoles){
		if(!angular.isArray(authorizedRoles)){
			authorizedRoles = [authorizedRoles];
		}
		return (authService.isAuthenticated() && authorizedRoles.indexOf(Session.userRole) !== -1);
	};

	return authService;
});

app.factory('RegService', function($http, Session){
	var regService = {};

	regService.register = function(userData){
		return $http({
			method: 'POST',
			url:'app/PHP/dataRetriever.php',
			data: userData
		})
		.then(function(res){
			Session.create(res.data.id, res.data.userName, "User");
			return res.data.userName;
		});
	};

	return regService;
});

app.service('Session', function(){
	this.create = function(sessionId, userName, userRole){
		this.id = sessionId + userName;
		this.userName = userName;
		this.userRole = userRole;
	};
	this.destroy = function(){
		this.id = null;
		this.userId = null;
		this.userRole = null;
	};
})