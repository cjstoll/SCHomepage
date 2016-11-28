/**
 * schomepage.js v1.0.0
 * Author: Christopher J Stoll
 *
 * Purpose: 
 *
 * Date: November 2016
 * *****************************
 */

var scApp  =  angular.module('scApp', []);

scApp.controller('scController', ['$scope', '$http', '$q', function($scope, $http, $q) { 
    $scope.master = {};
	$scope.nlform;
	//<select> Variables
	$scope.selSolution = 'solution';
	$scope.selIndustry = 'any industry';
	$scope.selProduct = 'any product';
	$scope.nlFieldOpen = {
		solutions: false,
		industry: false,
		products: false
	};
	
	//Arrays for holding the results that will populate the selects and/or results
	$scope.industry = [];
	$scope.products = [];
	$scope.solutions = [];
	$scope.resultData = [];	
	
	//Dataset for the first dropdown 'selSolution'
	$scope.solutionTypes = [{ id:"solutions", name:"solution"},{ id:"wins", name:"winning solution"}];
	
	
	$scope.showFieldOpen = function(field) {
		$scope.nlFieldOpen[field] = !$scope.nlFieldOpen[field];
	}
	//Update the <select> for chosing the Industry based on the options available in the appropriate dataset
	//The dataset must be reduced to a unique collection so that the user only sees one choice in the dropdown 
    $scope.updateIndustry = function(id) {
		
		if(id=='wins'){
			$scope.selSolution = 'winning solution';
		}else{
			$scope.selSolution = 'solution';
		}
		//Hide the results div
		$('#resultsLine').hide();
		$('#resultsData').hide();
		
		//Reset the Industry and Product dropdowns since the user has selected a new dataset
		$scope.selIndustry = 'any industry';
		$scope.selProduct = 'any product';
		
		//Get the working dataset based on the selection and populate the industry <select>
		$http.get('assets/json/'+id+'.json').success(function(data){ 
			$scope.resultData = $scope.solutions = data;
			$scope.industry = $scope.unique($scope.resultData,'industry'); 
		});
		$scope.nlFieldOpen.solutions = false;
	};
	
	//Update the <select> for chosing the Products based on the Industry selected from the appropriate solution dataset
    //The dataset must be reduced to a unique collection so that the user only sees one choice in the dropdown 
    $scope.updateProducts = function(id) {
		
		$scope.selIndustry = id;
		
		//Hide the results div
		$('#resultsLine').hide();
		$('#resultsData').hide();
		
		//Reset the Product dropdown because the user has selected a new Industry
		$scope.selProduct = 'any product';
		
		if($scope.selIndustry == null){
			//If the user selected the 'any industry' option, then we need to reset the dataset to the full dataset for the selected solution.
			$scope.updateIndustry();
		}else{
			//Filter (reduce) the current dataset to only those entries matching the selected industry
			$scope.resultData = $scope.solutions = $scope.filter($scope.solutions,'industry',$scope.selIndustry);
			$scope.products = $scope.unique($scope.resultData,'product'); 
		}
		$scope.nlFieldOpen.industry = false;
	};
	$scope.updateResults = function(id) {
		
		$scope.selProduct = id;
		
		//Hide the results div
		$('#resultsLine').hide();
		$('#resultsData').hide();
		
		if($scope.selProduct == null){
			//If the user selected the 'any product' option, then we need to reset the dataset to the collection based on the selected industry.
			$scope.updateProducts();
		}else{
			//Filter (reduce) the current dataset to only those entries matching the selected product.
			$scope.resultData = $scope.filter($scope.solutions,'product',$scope.selProduct);
		}
		$scope.nlFieldOpen.products = false;
	};

	//When the user clicks the 'Find It!' button, show the resulting table
    $scope.findIt = function() {
		$('#resultsLine').show();
		$('#resultsData').show();
    };
	
	//Function for creating a dataset of unique values
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
	
	//Function for filtering the dataset based on the selected value in the dropdowns
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
		$scope.updateIndustry('solutions');
		$scope.nlSolutionOpen = false;
	});
}]);