/**
 * schomepage.js v1.0.0
 * Author: Christopher J Stoll
 *
 * Purpose: 
 *
 * Date: November 2016
 * *****************************
 */
 //Angular Stuff
var scApp  =  angular.module('scApp', []);

scApp.controller('scController', ['$scope', '$http', function($scope, $http) { 
    $scope.master = {};
	$scope.nlform;
	$scope.selSolution = 'solutions';
	$scope.selIndustry = '';
	$scope.selProduct = '';
	
	$scope.industry = [];
	$scope.products = [];
	$scope.solutions = [];
	$scope.resultData = [];	
	
	$scope.solutionTypes = [{ id:"solutions", name:"solution"},{ id:"wins", name:"winning solution"}];
	
    $scope.updateIndustry = function() {
		$('#resultsLine').hide();
		$('#resultsData').hide();
		$scope.selIndustry = 'any industry';
		$scope.selProduct = 'any product';
		
		$http.get('assets/json/'+$scope.selSolution+'.json').success(function(data){ 
			$scope.resultData = $scope.solutions = data;
			$scope.industry = $scope.unique($scope.resultData,'industry'); 
		});
	};
    $scope.updateProducts = function() {
		$('#resultsLine').hide();
		$('#resultsData').hide();
		$scope.selProduct = 'any product';
		if($scope.selIndustry == null){
			$scope.updateIndustry();
		}else{
			$scope.resultData = $scope.filter($scope.solutions,'industry',$scope.selIndustry);
			$scope.products = $scope.unique($scope.resultData,'product'); 
		}
	};
	$scope.updateResults = function() {
		$('#resultsLine').hide();
		$('#resultsData').hide();
		if($scope.selProduct == null){
			$scope.updateProducts();
		}else{
			$scope.resultData = $scope.filter($scope.resultData,'product',$scope.selProduct);
		}
	};
    $scope.findIt = function() {
		$('#resultsLine').show();
		$('#resultsData').show();
		console.log($scope.resultData);
    };
	
	$scope.unique = function(data,key){
		var temp = [];
		var uniqData = [];

		for(var x=0; x<data.length;x++){
			if(temp.indexOf(data[x][key]) == -1) {
				temp.push(data[x][key]);
				uniqData.push(data[x]);
			}
		}
		return uniqData;
	};
	$scope.filter = function(data,fKey,fVal){
		var temp = [];
		var filtered = [];

		for(var x=0; x<data.length;x++){
			if(data[x][fKey] == fVal){
				filtered.push(data[x]);
			}
		}
		return filtered;
	};
	
	angular.element(document).ready(function(){
		//Since the first dropdown loads with 'solutions' make the industry dropdown populated with the right data
		$scope.updateIndustry();
		
		//$scope.nlform = new NLForm( document.getElementById( 'nl-form' ) );
	});
}]);
