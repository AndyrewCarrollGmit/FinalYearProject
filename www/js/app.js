var app = angular.module('starter', ['ionic', 'ngCordova']);

app.run(function ($ionicPlatform) {
    'use strict';
	$ionicPlatform.ready(function () {
        if (window.cordova && window.cordova.plugins.Keyboard) {
      // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
      // for form inputs)
            cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);

      // Don't remove this line unless you know what you are doing. It stops the viewport
      // from snapping when text inputs are focused. Ionic handles this internally for
      // a much nicer keyboard experience.
      cordova.plugins.Keyboard.disableScroll(true);
    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }
  });

});

app.controller('smsController', ['$scope','$cordovaSms','$http', function($scope,$cordovaSms,$http){
  
	
 $scope.sms={};
      var options = {
      replaceLineBreaks: false, // true to replace \n by a new line, false by default
      android: {
       // intent: 'INTENT'  // send SMS with the default SMS app
       intent: ''        // send SMS without open any other app
      }
    };
	
	
	var returnValue;
	
	function getRequest(text,to,from){
	$http({
  method: 'GET',
  url: 'http://www.transltr.org/api/translate?text=' + text + '&to=' +to +'&from=' + from
}).then(function successCallback(response) {
		returnValue = response.data;
   	console.log(returnValue.translationText);
  }, function errorCallback(response) {
      
  });
};
	
  
  $scope.sendSms=function(){
   console.log($scope.sms.number);
   console.log($scope.sms.message);
	
	  alert("SMS has been sent");
	  
	  
	getRequest($scope.sms.message,$scope.sms.language,'en');

    $cordovaSms
        .send($scope.sms.number,returnValue.translationText, options)
          .then(function() {
              // Success! SMS was sent
              console.log('Success');
          }, function(error) {
          // An error occurred
              console.log(error);
        });//then
  }//sendSms


}])