(function (angular) {
	'use strict';
	angular
		.module('mySearch',[])
		.directive('githubSearch', function($http){
			return {
				restrict: 'E',
				templateUrl: 'searchtemplate.html',
					   
				scope: {
					searchText: '=',
					language: '=',
					stars: '=',
					searchTextIssue: '='
				},
				
				link: function(scope, elem, attrs) {

				    scope.searchClicked = function() {
				      	var searchquery = _.isEmpty(scope.searchText)? "" : scope.searchText;
				      	searchquery += _.isEmpty(scope.language)? "" : "language:" + scope.language;
				      	searchquery += _.isEmpty(scope.stars)? "" : "stars:=>" + (scope.stars - 1);
				      	$http({
						    method: 'GET',
						    url: 'https://api.github.com/search/repositories', 
						    params: {
						      q: searchquery
						    }
						 })
						 .success(function(data, status, headers, config) {
						 	scope.dataLoaded = true;
						 	scope.dataFailed = false;
						 	scope.items = data.items
						 })
						 .error(function(data, status, headers, config) {
    						scope.dataLoaded = false;
    						scope.dataFailed = true;
						 	scope.items = {};
 						 });
				    };
				    
				    
				    
				    scope.searchClickedIssue = function() {
				      	var searchquery = _.isEmpty(scope.searchTextIssue)? "" : scope.searchTextIssue + "+in:title+type:issue";
				      	$http({
						    method: 'GET',
						    url: 'https://api.github.com/search/issues', 
						    params: {
						      q: searchquery
						    }
						 })
						 .success(function(data, status, headers, config) {
						 	scope.dataLoadedIssue = true;
						 	scope.dataFailedIssue = false;
						 	scope.items = [];
						 	//Abfrage über simple Github API requests
						 	/*for (var index = 0; index < data.items.length && index < 2; ++index) {
						 	 
						 			var rep_url = data.items[index].url.split("/issues",1);
						 			$http.get(rep_url[0])
						 				.success(function(datax, statusx, headersx, configx) {
										    scope.items.push(datax);
										    console.log(scope.items[index]);
										 })
										 .error(function(datax, statusx, headersx, configx) {
										 });
							}*/
							
							
							// das ist mein Versuch die get-request limitierung der Github API zu umgehen, 
								//indem ich einfach erneut auf einen Search-Request zugreife und jeweils das erste 
								//Ergebnis der jeweiligen Repository Search (nach lower case name aus url) übergebe
							for (var index = 0; index < data.items.length && index < 10; ++index) { 
								
							 			var rep_url = data.items[index].url.split("/issues");
							 			console.log("index : " + index);
							 			console.log(data.items[index]);
							 			var rep_name = rep_url[0].replace("https://api.github.com/repos/","");
							 			rep_name = rep_name.split("/"); //the extracted repository name
							 			console.log(rep_name);
									 
									      	$http({
											    method: 'GET',
											    url: 'https://api.github.com/search/repositories', 
											    params: {
											      q: rep_name[1]
											    }
											 })
											 .success(function(datax, statusx, headersx, configx) {
											    scope.items.push(datax.items[0]);
											    
											 })
											 .error(function(datax, statusx, headersx, configx) {
											 });
											 
								}
						
						 })
						 .error(function(data, status, headers, config) {
    						scope.dataLoadedIssue = false;
    						scope.dataFailedIssue = true;
						 	scope.items = [];
 						 });
				   };
				   
				   //hide search results when switching tabs
				   scope.switchTabIss = function () { 
				    	scope.dataLoaded = false;
				    };
				    
				    scope.switchTab = function () {
				    	scope.dataLoadedIssue = false;
				    };
     			}}
		})
	
})(angular);