angular.module('starter.controllers')

.controller('FeedChatCtrl', function($scope, 
		 store, $state,$stateParams,
         $ionicScrollDelegate,$firebaseArray,$firebase, 
         FIREBASE_URL,PersonService,$timeout) {
	
//	http://istarter.io/ionic-starter-messenger/#/room/room_f
  $scope.logout = function() {
    console.log('logout');
    store.remove('token');
    store.remove('profile');
    store.remove('refreshToken');
    $state.go('login', {}, {
      reload: true
    });
  };

  $scope.feedId = $stateParams.feedId;
  
  // TBD: From FeedId call service to get FeedName (Details etc).
  console.log('feedId -->',$scope.feedId);
	$scope.data = {
		messages: [],
		message: '',
		loading: true,
		showInfo: false
	};
	var messagesRef = new Firebase('https://teamsterapp.firebaseio.com/messages');
	
	$scope.loadMessages = function () {

		console.log("Loading data for show ", $scope.feedId);

		var query = messagesRef
//			.child("messages")
			.orderByChild("feedId")
			.equalTo($scope.feedId)
			.limitToLast(200);

		$scope.data.messages = $firebaseArray(query);
		$scope.data.messages.$loaded().then(function (data) {
			console.log("AngularFire $loaded");
			$scope.data.loading = false;
			$ionicScrollDelegate.$getByHandle('show-page').scrollBottom(true);
		});
	};
	
	
	// Added below line because view is not scrolling to the bottom on the recepient side when a new msg arrives
	messagesRef.on('child_added', function(childSnapshot, prevChildKey) {
		  // code to handle new child.
		console.log('Fired..',childSnapshot)
			$timeout(function() {
				$ionicScrollDelegate.scrollBottom(true);
			},1000);
		});

	$scope.sendMessage = function () {

		if ($scope.data.message) {
			$scope.data.messages.$add({
				feedId: $scope.feedId,
				text: $scope.data.message,
				username: $scope.getName(),
				profilePic: $scope.getImg(),
				timestamp: new Date().getTime()
			});
			
			$scope.data.message = '';
			$ionicScrollDelegate.$getByHandle('show-page').scrollBottom(true);
		}

	};

	$scope.loadMessages();
	
	$scope.getName = function() {
//		console.log('name:' ,PersonService.GetUserDetails().name);
		return PersonService.GetUserDetails().name;
	};
	
	$scope.getImg = function() {
		console.log(PersonService.GetAvatar());
		return PersonService.GetAvatar();
	};
 
})

