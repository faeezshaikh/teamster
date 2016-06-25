angular.module('starter.controllers', [])

  
  .controller('AppCtrl', function($scope, $ionicModal, $timeout) {

    // With the new view caching in Ionic, Controllers are only called
    // when they are recreated or on app start, instead of every page change.
    // To listen for when this page is active (for example, to refresh data),
    // listen for the $ionicView.enter event:
    //$scope.$on('$ionicView.enter', function(e) {
    //});

    // Form data for the login modal
    $scope.loginData = {};

    // Create the login modal that we will use later
    $ionicModal.fromTemplateUrl('templates/login.html', {
      scope: $scope
    }).then(function(modal) {
      $scope.modal = modal;
    });

    // Triggered in the login modal to close it
    $scope.closeLogin = function() {
      $scope.modal.hide();
    };

    // Open the login modal
    $scope.login = function() {
      $scope.modal.show();
    };

    // Perform the login action when the user submits the login form
    $scope.doLogin = function() {
      console.log('Doing login', $scope.loginData);

      // Simulate a login delay. Remove this and replace with your login
      // code if using a login system
      $timeout(function() {
        $scope.closeLogin();
      }, 1000);
    };
  })

.controller('FeedsCtrl', function($scope, auth, store, $state, $timeout, PersonService, $cordovaToast) {
  $scope.auth = auth;
  
  $scope.items = [];
  $scope.newItems = [];

  PersonService.GetFeed().then(function(items) {
    $scope.items = items;
  });

  $scope.doRefresh = function() {
    var addedNumber = 0;
    if ($scope.newItems.length > 0) {
      $scope.items = $scope.newItems.concat($scope.items);
      addedNumber = $scope.newItems.length;
      //Stop the ion-refresher from spinning
      $scope.$broadcast('scroll.refreshComplete');

      $scope.newItems = [];
    } else {
      PersonService.GetNewUsers().then(function(items) {
        $scope.items = items.concat($scope.items);
        addedNumber = items.length;
        //Stop the ion-refresher from spinning
        $scope.$broadcast('scroll.refreshComplete');
      });
    }
    var msg = addedNumber == 0 ? 'Nothing new yet.' : 'Loaded ' + addedNumber + ' new posts.';
    $cordovaToast.showShortBottom(msg)
      .then(function(success) {
        // Do something on success
      }, function(error) {
        // Handle error
      });
  };

  $scope.loadMore = function() {
    PersonService.GetOldUsers().then(function(items) {
      $scope.items = $scope.items.concat(items);

      $scope.$broadcast('scroll.infiniteScrollComplete');
    });
  };

  var CheckNewItems = function() {
    $timeout(function() {
      PersonService.GetNewUsers().then(function(items) {
        $scope.newItems = items.concat($scope.newItems);

        CheckNewItems();
      });
    }, 10000);
  }

 // CheckNewItems();
  
})

//.controller('FeedCtrl', function($scope, auth, store, $state, $timeout, PersonService) {
//  $scope.logout = function() {
//    console.log('logout');
//    auth.signout();
//    store.remove('token');
//    store.remove('profile');
//    store.remove('refreshToken');
//    $state.go('login', {}, {
//      reload: true
//    });
//    
//    
//    $scope.data.messages = [{'text': 'hello','username': 'Faeez','profilePic':''},
//                            {'text': 'hello22','username': 'FSz','profilePic':''},
//    						{'text': 'hello33','username': 'sdfs','profilePic':''}];
//  };
//
//})
//


.controller('GrpsCtrl', function($scope, 
		 store, $state,$stateParams,
         $ionicScrollDelegate,$firebaseArray,$firebase, 
         FIREBASE_URL,PersonService) {
	
	$scope.items = [
	                { 'image' : 'https://randomuser.me/api/portraits/med/men/43.jpg',
	                	'title': 'Tech Planning',
	                		'date': 'May 01,2018',
	                			'people' : 'Tom, Rob, Paul, Mike'
	                	
	                },
	                { 'image' : 'https://randomuser.me/api/portraits/med/men/43.jpg',
	                	'title': 'Tech Planning',
	                		'date': 'May 01,2018',
	                			'people' : 'Tom, Rob, Paul, Mike'
	                	
	                }
	                ];
})

.controller('FeedCtrl', function($scope, 
		 store, $state,$stateParams,
         $ionicScrollDelegate,$firebaseArray,$firebase, 
         FIREBASE_URL,PersonService) {
	
	
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
	var messagesRef = new Firebase('https://daughertyapp.firebaseio.com/');
	
	$scope.loadMessages = function () {

		console.log("Loading data for show ", $scope.feedId);

		var query = messagesRef
			.child("messages")
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


.constant("FIREBASE_URL", 'https://daughertyapp.firebaseio.com/')
.factory('PersonService', function($http) {
  var BASE_URL = "http://api.randomuser.me/";
  var items = [];
  var avatar,loginState;
  var loggedinUser = {};

  function shuffle(array) {
    var currentIndex = array.length,
      temporaryValue, randomIndex;

    // While there remain elements to shuffle...
    while (0 !== currentIndex) {

      // Pick a remaining element...
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;

      // And swap it with the current element.
      temporaryValue = array[currentIndex];
      array[currentIndex] = array[randomIndex];
      array[randomIndex] = temporaryValue;
    }

    return array;
  }

  return {
	
	  SetLoginState: function(val) {
		  loginState = val;
	  },
	  GetLoginState: function() {
		  return loginState;
	  },
	  SetUserDetails: function(name,img,email) {
		  loggedinUser.name = name;
		  loggedinUser.img = img;
		  loggedinUser.email = email;
	  },
	  GetUserDetails: function() {
		  return loggedinUser;
	  },
	  GetAvatar : function() {
		  return avatar;
	  },
	  SetAvatar: function(url) {
		  avatar = url;
	  },
    GetFeed: function() {

      return $http({
        //			    url: BASE_URL+'?results=10',
        url: 'data/data.json',
        method: "GET",

        headers: {
          'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
        }
      }).then(function(response) {
        items = response.data.results;
        return shuffle(items);
      });
      //			return $http.get(BASE_URL+'?results=10').then(function(response){
      //				items = response.data.results;
      //				return items;
      //			});
    },
    GetNewUsers: function() {
      //			return $http.get(BASE_URL+'?results=2').then(function(response){
      //				items = response.data.results;
      //				return items;
      //			});
      return $http({
        url: 'data/data.json',
        method: "GET",

        headers: {
          'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
        }
      }).then(function(response) {
        items = response.data.results;
        return shuffle(items);
      });
    },
    GetOldUsers: function() {
      //			return $http.get(BASE_URL+'?results=10').then(function(response){
      //				items = response.data.results;
      //				return items;
      //			});
      return $http({
        //			    url: BASE_URL+'?results10',
        url: 'data/data.json',
        method: "GET",

        headers: {
          'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
        }
      }).then(function(response) {
        items = response.data.results;
        return shuffle(items);
      });
    }
  }
})

.controller('chatController', function($scope, auth, $state, $window, $firebase, $firebaseAuth,$rootScope,PersonService) {

  var chatRef = new Firebase('https://daughertyapp.firebaseio.com/');
  var auth = $firebaseAuth(chatRef);
  $scope.msg = "Initializing chat..";
  $scope.date = new Date();

  $scope.login = function(socialPlatform) {
    $scope.loginProgress = true;
    auth.$authWithOAuthPopup(socialPlatform).then(function(authData) {
      console.log("Logged in as:", authData.uid);
      $scope.loggedIn = true;
      $scope.loginProgress = false;
      PersonService.SetLoginState(true);
    }).catch(function(error) {
      console.log("Authentication failed:", error);
      $scope.loginProgress = false;
      console.log(error);
      $scope.msg = "";
      $("#firechat-wrapper").effect("shake", {
        times: 4
      }, 1000);
    });
  }

  $scope.logout = function() {
	  PersonService.SetLoginState(false);
    chatRef.unauth();
    $scope.msg = "Signing out of chat..";
    $scope.loggedIn = false;
    $scope.loginProgress = true;
    $state.go('app.feeds'); // adding this for device.. location.href doesnt work on device
    $window.location.reload();

  }
  auth.$onAuth(function(authData) {
    // Once authenticated, instantiate Firechat with our user id and user name
    if (authData) {
      $scope.loginProgress = false;
      $scope.loggedIn = true;
      $rootScope.currentUser = "user";
      $scope.explModal.hide();
      $window.location.href = "#/app/chat/";
      if (authData.provider == 'facebook') {
        $scope.userName = authData.facebook.displayName;
        $scope.userImg = authData.facebook.profileImageURL;
        $scope.userEmail = authData.facebook.email; // Email works only if user has exposed.
        PersonService.SetAvatar(authData.facebook.profileImageURL);
        PersonService.SetUserDetails($scope.userName,$scope.userImg,$scope.userEmail);
      }
      if (authData.provider == 'twitter') {
        $scope.userName = authData.twitter.displayName;
        $scope.userImg = authData.twitter.profileImageURL;
        $scope.userEmail = authData.twitter.email;
        PersonService.SetAvatar(authData.twitter.profileImageURL);
        PersonService.SetUserDetails($scope.userName,$scope.userImg,$scope.userEmail);
      }
      if (authData.provider == 'google') {
        $scope.userName = authData.google.displayName;
        $scope.userImg = authData.google.profileImageURL;
        $scope.userEmail = authData.google.email;
        PersonService.SetAvatar(authData.google.profileImageURL);
        PersonService.SetUserDetails($scope.userName,$scope.userImg,$scope.userEmail);
      }
      var chat = new FirechatUI(chatRef, angular.element(document.querySelector('#firechat-wrapper')));
      chat.setUser(authData.uid, authData[authData.provider].displayName);
    }
  });
  

});