angular.module('starter.controllers')

.controller('chatController', function($scope, auth, $state, $window, $firebase, $firebaseAuth,$rootScope,PersonService) {

  var chatRef = new Firebase('https://teamsterapp.firebaseio.com/');
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
      $("#loginPage").effect("shake", {
        times: 4
      }, 1000);
    });
  }
  
  $scope.submitForm = function() {
	    $("#loginPage").effect("shake", {
	        times: 4
	      }, 1000);
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
        console.log("Succes in Logging in...Logged in as:", authData.uid);
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
        PersonService.SetUserDetails($scope.userName,$scope.userImg,$scope.userEmail,authData.facebook.displayName);
      }
      if (authData.provider == 'twitter') {
        $scope.userName = authData.twitter.displayName;
        $scope.userImg = authData.twitter.profileImageURL;
        $scope.userEmail = authData.twitter.email;
        PersonService.SetAvatar(authData.twitter.profileImageURL);
        PersonService.SetUserDetails($scope.userName,$scope.userImg,$scope.userEmail,authData.twitter.displayName);
      }
      if (authData.provider == 'google') {
        $scope.userName = authData.google.displayName;
        $scope.userImg = authData.google.profileImageURL;
        $scope.userEmail = authData.google.email;
        PersonService.SetAvatar(authData.google.profileImageURL);
        PersonService.SetUserDetails($scope.userName,$scope.userImg,$scope.userEmail,authData.google.displayName);
      }
      if (authData.provider == 'github') {
          $scope.userName = authData.github.displayName;
          $scope.userImg = authData.github.profileImageURL;
          $scope.userEmail = authData.github.email;
          PersonService.SetAvatar(authData.github.profileImageURL);
          PersonService.SetUserDetails($scope.userName,$scope.userImg,$scope.userEmail,authData.github.displayName);
        }
      
  
      
      
      var chat = new FirechatUI(chatRef, angular.element(document.querySelector('#firechat-wrapper')));
      chat.setUser(authData.uid, authData[authData.provider].displayName);
    }
  });
  

});