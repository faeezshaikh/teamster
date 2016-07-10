angular.module('starter.controllers')

.controller('FeedChatCtrl', function($scope, 
		 store, $state,$stateParams,
         $ionicScrollDelegate,$firebaseArray,$firebase, 
         FIREBASE_URL,PersonService,$timeout,CtrlService) {
	
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
  
  console.log('feedId -->',$scope.feedId);
	$scope.data = {
		messages: [],
		message: '',
		loading: true,
		showInfo: false
	};
	
	var feedsRef = new Firebase('https://teamsterapp.firebaseio.com/feeds');
	var feedQuery = feedsRef
					.orderByChild("id")
					.equalTo(parseInt($scope.feedId));  // String to Int. since id is 'int'
	var feed = $firebaseArray(feedQuery);
	
	
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
//			console.log("AngularFire $loaded");
			$scope.data.loading = false;
			if($scope.data.messages.length && $scope.data.messages.length>1) {
				CtrlService.addHotTopic($scope.feedId);
			}
			$ionicScrollDelegate.$getByHandle('show-page').scrollBottom(true);
		});
	};
	
	
	// Added below line because view is not scrolling to the bottom on the recepient side when a new msg arrives
	messagesRef.on('child_added', function(childSnapshot, prevChildKey) {
		  // code to handle new child.
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
			

			if(feed[0].commenters) {
				if(feed[0].commenters.indexOf($scope.getName() + '_' +$scope.getImg()) == -1) {
					// Not found so add commenter
					feed[0].commenters.push($scope.getName() + '_' +$scope.getImg());
					feed.$save(feed[0]);
				}
			} else {
				feed[0].commenters = [];
				feed[0].commenters.push($scope.getName() + '_' +$scope.getImg());
				feed.$save(feed[0]);
			}
		
		
			$ionicScrollDelegate.$getByHandle('show-page').scrollBottom(true);
		}

	};

	$scope.loadMessages();
	
	$scope.getName = function() {
		return PersonService.GetUserDetails().name;
	};
	
	$scope.isThisMe = function(name,profilePic) {
		if(PersonService.GetUserDetails().name == name && PersonService.GetUserDetails().img == profilePic) {
			return true;
		}
		return false;
	}
	
	$scope.getImg = function() {
		console.log(PersonService.GetAvatar());
		return PersonService.GetAvatar();
	};
	
 
})

