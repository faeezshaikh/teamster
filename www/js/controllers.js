angular.module('starter.controllers', [])

.controller('LoginCtrl', function($scope, auth, $state, store) {
	  function doAuth() {
	    auth.signin({
	      closable: false,
	      // This asks for the refresh token
	      // So that the user never has to log in again
	      authParams: {
	        scope: 'openid offline_access'
	      }
	    }, function(profile, idToken, accessToken, state, refreshToken) {
	      store.set('profile', profile);
	      store.set('token', idToken);
	      store.set('refreshToken', refreshToken);
	      $state.go('app.browse');
	    }, function(error) {
	      console.log("There was an error logging in", error);
	    });
	  }

	  $scope.$on('$ionic.reconnectScope', function() {
	    doAuth();
	  });

	  doAuth();
	  
	  
	})
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

.controller('PlaylistsCtrl', function($scope,auth,store,$state,$timeout, PersonService,$cordovaToast) {
	$scope.auth = auth;
  $scope.playlists = [
    { title: 'Reggae11', id: 1 },
    { title: 'Chill', id: 2 },
    { title: 'Dubstep', id: 3 },
    { title: 'Indie', id: 4 },
    { title: 'Rap', id: 5 },
    { title: 'Cowbell', id: 6 }
  ];
  
  
	  
	  
	  $scope.items = [];
	  $scope.newItems = [];
	  
	  PersonService.GetFeed().then(function(items){
		$scope.items = items;
	  });
	  
	  $scope.doRefresh = function() {
		  var addedNumber = 0;
			if($scope.newItems.length > 0){
				$scope.items = $scope.newItems.concat($scope.items);
				addedNumber = 	$scope.newItems.length;
				//Stop the ion-refresher from spinning
				$scope.$broadcast('scroll.refreshComplete');
				
				$scope.newItems = [];
			} else {
				PersonService.GetNewUsers().then(function(items){
					$scope.items = items.concat($scope.items);
					addedNumber = items.length;
					//Stop the ion-refresher from spinning
					$scope.$broadcast('scroll.refreshComplete');
				});
			}
			var msg = addedNumber==0 ? 'Nothing new yet.' : 'Loaded ' + addedNumber + ' new posts.';
			$cordovaToast.showShortBottom(msg)
	        .then(function(success) {
	            // Do something on success
	        }, function(error) {
	            // Handle error
	        });
	  };
	  
	  $scope.loadMore = function(){
	    PersonService.GetOldUsers().then(function(items) {
	      $scope.items = $scope.items.concat(items);
		  
	      $scope.$broadcast('scroll.infiniteScrollComplete');
	    });
	  };
	  
	   var CheckNewItems = function(){
			$timeout(function(){
				PersonService.GetNewUsers().then(function(items){
					$scope.newItems = items.concat($scope.newItems);
				
					CheckNewItems();
				});
			},10000);
	   }
	  
	  CheckNewItems();
})

.controller('PlaylistCtrl', function($scope,auth,store,$state,$timeout, PersonService) {
	$scope.logout = function() {
		  console.log('logout');
		    auth.signout();
		    store.remove('token');
		    store.remove('profile');
		    store.remove('refreshToken');
		    $state.go('login', {}, {reload: true});
		  };
	
})


.controller('chatController',function($scope,Message,auth){
 
		$scope.user= auth.profile.nickname;
 
		$scope.messages= Message.all;
 
		$scope.addMessage = function(message){
			Message.create(message);
			$scope.message = "";
		};
		
		
		
		////
		
		var chatRef = new Firebase('https://daughertyapp.firebaseio.com/');

		$scope.login = function() {
		  chatRef.authWithOAuthPopup("twitter", function(error, authData) {
		    if (error) {
		      console.log(error);
		    }
		  });
		}

		chatRef.onAuth(function(authData) {
		  // Once authenticated, instantiate Firechat with our user id and user name
		  if (authData) {
//		    initChat(authData);
			  var chat = new FirechatUI(chatRef, angular.element(document.querySelector('#firechat-wrapper')));
			  chat.setUser(authData.uid, authData[authData.provider].displayName);
		  }
		});
		
		
		
		
		////
});


;