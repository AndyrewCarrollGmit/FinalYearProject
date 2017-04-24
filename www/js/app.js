// db variable set to null
var db = null;
var app = angular.module('starter', ['ionic', 'ngCordova']);

app.run(function ($ionicPlatform, $cordovaSQLite) {
    'use strict';
	$ionicPlatform.ready(function () {
        if (window.cordova && window.cordova.plugins.Keyboard) {
			// Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
      		// for form inputs)
            cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      
			cordova.plugins.Keyboard.disableScroll(true);
		}
		if(window.StatusBar) {
		  StatusBar.styleDefault();
		}
		// Create Database & Table 
		if (window.cordova) {
			  db = $cordovaSQLite.openDB({ name: "my.db", location: "default" });
        	  $cordovaSQLite.execute(db, "CREATE TABLE IF NOT EXISTS Language_Stats (Id integer primary key, Language_used text, Date_used date)");	
			}else{
			  db = window.openDatabase("my.db", '1', 'my', 1024 * 1024 * 100); // browser
			  $cordovaSQLite.execute(db, "CREATE TABLE IF NOT EXISTS Language_Stats (Id integer primary key, Language_used text, Date_used date)");		
			  
			}	
  });

});


//controls the data  
app.controller('smsController', ['$scope','$cordovaSms', '$cordovaSQLite', '$http', function($scope,$cordovaSms, $cordovaSQLite, $http){
  	
 $scope.sms={};
      var options = {
      replaceLineBreaks: false, // true to replace \n by a new line, false by default
      android: {
       intent: ''        // send SMS without open any other app
      }
    };

	// variable 	
   var returnValue; 
	
	// GET Request API from transltr.org 
	function getRequest(text,to,from){
	$http({
		  method: 'GET',
		  url: 'http://www.transltr.org/api/translate?text=' + text + '&to=' +to +'&from=' + from
		}).then(function successCallback(response) {
				returnValue = response.data;
			console.log(returnValue.translationText);
		  }, function errorCallback(response) {
		console.log("Fail");
		  });
		};
	// Add Records to the database
	  function saveStats(lang){
	  //Save stats to DB
	  $scope.insert = function() {
			var query = "INSERT INTO Language_Stats (Language_Used, Date_Used) VALUES (?,?)";
			$cordovaSQLite.execute(db, query, [lang, '01/01/1999']).then(function(res) {
				console.log("INSERT ID -> " + res.insertId);
			}, function (err) {
				console.error(err);
			});
		}
	  };
	
// Function to Send the SMS
  $scope.sendSms=function(){
	  	 // Test on the console 
	//console.log($scope.sms.number);
   	//console.log($scope.sms.message);
	
	  
	getRequest($scope.sms.message,$scope.sms.language,'en');
	   //Get the translated text 
	saveStats($scope.sms.language); 
	   
	  
	$cordovaSms
		.send($scope.sms.number,returnValue.translationText, options)
		  .then(function() {
			   //SMS was sent
			  console.log('Success');
		  }, function(error) {
		  // Error
			  console.log(error);
		});//then
	 
	  //Message Alert
	alert("SMS has been sent: " + returnValue.translationText);  
  }//sendSms
  
  
	
	  

  

 
  
  
}])