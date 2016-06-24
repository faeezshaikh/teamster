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
  $scope.playlists = [{
    title: 'Reggae11',
    id: 1
  }, {
    title: 'Chill',
    id: 2
  }, {
    title: 'Dubstep',
    id: 3
  }, {
    title: 'Indie',
    id: 4
  }, {
    title: 'Rap',
    id: 5
  }, {
    title: 'Cowbell',
    id: 6
  }];




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

  CheckNewItems();
  
  $scope.liked = function(feedId) {
	  console.log('Liked' , feedId);
	  
  }
})

.controller('FeedCtrl', function($scope, auth, store, $state, $timeout, PersonService) {
  $scope.logout = function() {
    console.log('logout');
    auth.signout();
    store.remove('token');
    store.remove('profile');
    store.remove('refreshToken');
    $state.go('login', {}, {
      reload: true
    });
  };

})


.controller('chatController', function($scope, auth, $state, $window, $firebaseAuth) {

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
    chatRef.unauth();
    $scope.msg = "Signing out of chat..";
    $scope.loggedIn = false;
    $scope.loginProgress = true;
    $state.go('app.playlists'); // adding this for device.. location.href doesnt work on device
    $window.location.reload();

  }
  auth.$onAuth(function(authData) {
    // Once authenticated, instantiate Firechat with our user id and user name
    if (authData) {
      $scope.loginProgress = false;
      $scope.loggedIn = true;
      if (authData.provider == 'facebook') {
        $scope.userName = authData.facebook.displayName;
        $scope.userImg = authData.facebook.profileImageURL;
        $scope.userEmail = authData.facebook.email; // Email works only if user has exposed.
      }
      if (authData.provider == 'twitter') {
        $scope.userName = authData.twitter.displayName;
        $scope.userImg = authData.twitter.profileImageURL;
        $scope.userEmail = authData.twitter.email;
      }
      if (authData.provider == 'google') {
        $scope.userName = authData.google.displayName;
        $scope.userImg = authData.google.profileImageURL;
        $scope.userEmail = authData.google.email;
      }
      var chat = new FirechatUI(chatRef, angular.element(document.querySelector('#firechat-wrapper')));
      chat.setUser(authData.uid, authData[authData.provider].displayName);
    }
  });

});