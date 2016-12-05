angular.module('magicCards')

.controller('searchController', searchController);

searchController.$inject = ['$scope', 'CardRequester'];

function searchController($scope, CardRequester)
{
	var itemID = 0;
	$scope.title = "Magic";
	$scope.sets = {};
	$scope.searchResults = {};
	$scope.subTypeFilter = '';
	$scope.superTypeFilter = '';
	$scope.nameFilter = '';
	$scope.colorFilter = [{name:'White', selected:false}, {name:'Black', selected:false}, {name:'Blue', selected:false}, {name:'Red', selected:false}, {name:'Green', selected:false}];
	$scope.typeFilter = [{name:'Creature', selected:false}, {name:'Instant', selected:false}, {name:'Sorcery', selected:false}, {name:'Enchantment', selected:false}, {name:'Artifact', selected:false}, {name:'Land', selected:false}];
	$scope.rarityFilter = [{name:'Mythic', selected:false}, {name:'Rare', selected:false}, {name:'Uncommon', selected:false}, {name:'Common', selected:false}];
	$scope.legalityFilter = [{name:"Legal", selected:false}, {name:"Banned", selected:false}, {name:"Restricted", selected:false}];
	$scope.formatFilter = [{name:"Standard", selected:false}, {name:"Modern", selected:false}, {name:"Commander", selected:false}, {name:"Legacy", selected:false}, {name:"Vintage", selected:false}];

	$scope.getSets = function(){
		CardRequester.makeRequest("sets").then(function(data){
			$scope.sets = data;
		});
	}

	function optionsBuilder(){
		var optionString = "cards?";
		//Name
		if($scope.nameFilter != ""){
			optionString += "name=" + $scope.nameFilter + "&";
		}		
		//Color
		for(var i = 0; i < $scope.colorFilter.length; i++){
			if($scope.colorFilter[i].selected){
				optionString += "color=" + angular.lowercase($scope.colorFilter[i].name) + "&";
			}
		}
		//Type
		for(i = 0; i < $scope.typeFilter.length; i++){
			if($scope.typeFilter[i].selected){
				optionString += "type=" + angular.lowercase($scope.typeFilter[i].name) + "&";
			}
		}
		//Rarity
		for(i = 0; i < $scope.rarityFilter.length; i++){
			if($scope.rarityFilter[i].selected){
				optionString += "rarity=" + angular.lowercase($scope.rarityFilter[i].name) + "&";
			}
		}
		//Legality
		for(i = 0; i < $scope.legalityFilter.length; i++){
			if($scope.legalityFilter[i].selected){
				optionString += "status=" + angular.lowercase($scope.legalityFilter[i].name) + "&";
			}
		}
		//format
		for(i = 0; i < $scope.formatFilter.length; i++){
			if($scope.formatFilter[i].selected){
				optionString += "format=" + angular.lowercase($scope.formatFilter[i].name) +  "&";
			}
		}
		//Subtype
		if($scope.subTypeFilter != ""){
			optionString += "subtype=" + angular.lowercase($scope.subTypeFilter) + "&";
		}
		//Supertype
		if($scope.superTypeFilter != ""){
			optionString += "supertype=" + angular.lowercase($scope.superTypeFilter);
		}
		return optionString;
	}

	$scope.cardSearch = function(){
		var options = optionsBuilder();
		CardRequester.makeRequest(options).then(function(data){
			$scope.searchResults = data;
		});
	};

	$scope.getImageSource = function(editions){
		for(var i = 0; i < editions.length; i++){
			if(editions[i].image_url != "https://image.deckbrew.com/mtg/multiverseid/0.jpg"){
				return editions[i].image_url;
			}
		}

		return "https://image.deckbrew.com/mtg/multiverseid/0.jpg";
	}

	$scope.getCardID = function(editions){
		return editions[0].multiverse_id;
	};

	$scope.getSets();
}