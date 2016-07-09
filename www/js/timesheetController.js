angular.module('starter.controllers')
.controller('TimesheetCtrl', function($scope,$firebaseArray,$firebase,PersonService,localStorage) { 
	
	  $scope.signupForTimesheetAlerts = function() {
		  var recepientsRef = new Firebase('https://teamsterapp.firebaseio.com/alertRecepients');

		  var displayName = PersonService.GetUserDetails().displayName;
		  console.log('displayName is..',displayName);
		  if(displayName) {} else displayName = 'faeez.shaikh@gmail.com';
		  
		  console.log('Signing up..',displayName);
		  recepientsRef.push({'displayName':displayName});
		  localStorage.set('timesheetRegistered',JSON.stringify('true'));
		  
		  
		  // Query not working .. Checking if user is registered in Firbase.. kinda redundant since user wont see the register button based on localStorage
//		  var query = recepientsRef
//						.orderByChild("displayName")
//						.equalTo(displayName);
//		  
//		  var arr = $firebaseArray(query);
//		  if(arr && arr.length>0) {
//			  console.log('email already exists..not registering')
//		  } else {
//			  recepientsRef.push({'displayName':displayName});
//			  localStorage.set('timesheetRegistered',JSON.stringify('true'));
//		  }
	}
	  
	  $scope.isRegistered = function() {
		  if(JSON.parse(localStorage.get('timesheetRegistered')) == 'true') {
			  return true;
		  }
		  return false;
	  }
});