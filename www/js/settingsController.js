angular.module('starter.controllers')

.controller('SettingsCtrl', function($scope,PersonService,$state,$window,CtrlService,localStorage){
	$scope.checkboxes = [
	                  { text: "#Ameren", checked: true },
	                  { text: "@AmerenMissouri", checked: true },
	                  { text: "@AmerenIllinois", checked: false },
	                  { text: "@AmerenCorporation", checked: true }
	                ];
	
	 $scope.logout = function() {
		  PersonService.SetLoginState(false);
		  var chatRef = new Firebase('https://teamsterapp.firebaseio.com/');
	    chatRef.unauth();
//	    $scope.msg = "Signing out of chat..";
//	    $scope.loggedIn = false;
//	    $scope.loginProgress = true;
	    $state.go('app.feeds'); // adding this for device.. location.href doesnt work on device
	    $window.location.reload();

	  }
	  $scope.user= {
		        min:0,
		        max:10,
		        value:JSON.parse(localStorage.get("hotnessNumber"))
		    }
	  
	  $scope.onRangeChange = function() {
		  JSON.stringify(localStorage.set("hotnessNumber", $scope.user.value));
	  }
	
});