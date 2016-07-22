angular.module('starter.controllers', [])

.constant("FIREBASE_URL", 'https://teamsterapp.firebaseio.com/')

  .controller('AppCtrl', function($scope, $ionicModal, $timeout, auth, $state, $window, $firebase, $firebaseAuth,$rootScope,PersonService) {

    // With the new view caching in Ionic, Controllers are only called
    // when they are recreated or on app start, instead of every page change.
    // To listen for when this page is active (for example, to refresh data),
    // listen for the $ionicView.enter event:
    //$scope.$on('$ionicView.enter', function(e) {
    //});

	  /* $scope.loginData = {};

    $ionicModal.fromTemplateUrl('templates/login.html', {
      scope: $scope
    }).then(function(modal) {
      $scope.modal = modal;
    });

    $scope.closeLogin = function() {
      $scope.modal.hide();
    };

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
    };*/
    
    
    ////
    
	 $scope.date = new Date(); // for the chat page
    var chatRef = new Firebase('https://teamsterapp.firebaseio.com/');
    var auth = $firebaseAuth(chatRef);

    
    $scope.ameren = {'username':'','password':''};
    $scope.isFormValid = function() {
  	  if($scope.ameren.username &&  $scope.ameren.password  )  {
  		  return true;
  	  }
  	  return false;
    }
    
    
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
        $scope.loginProgress = false;
        $scope.loggedIn = true;
        $rootScope.currentUser = "user";
        $scope.explModal.hide();
//        $window.location.href = "#/app/chat/";
        console.log('Chat controller. State name = ',$state.current.name);
        if($state.current.name == 'app.chat') {
      	  $state.go('app.chat');
//      	  $window.location.href = "#/app/chat/";
        } else {
      	  $state.go('app.feeds');
      	 // $window.location.href = "#/app/feeds";
        }
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
    
    
    
    ////
    
    $scope.isUserAdmin = function() {
    	if($scope.userName && $scope.userName.indexOf('Faeez')==-1) {
    		return false;
    	}
    	return true;
    }
    
  })







.controller('MyController', function($scope){

  $scope.items = [{
    title: "Tech Planning",
    date: "Active 1 day ago",
    people: "The Think Tank",
    image: "https://userscontent2.emaze.com/images/cd1652c2-bc1d-40c2-a760-82ff94bb52ed/75107abe29444936da0ef96482d8be24.png"
  }, {
    title: "Cyber",
    date: "Active 3 days ago",
    people: "Security First",
    image: "https://www.healthit.gov/sites/default/files/Security_Shield_Lock.png"
  }, {
    title: "Innovation",
    date: "Active 1 wk ago",
    people: "The Einsteins",
    image: "data:image/jpeg;base64,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"
  }, {
    title: "Random Rants",
    date: "Very Very Active",
    people: "Brock, Tan, Sunny",
    image: "http://writerway.files.wordpress.com/2009/04/ranting-color-istock.jpg"
  }, {
    title: "Leadership",
    date: "Active 4 wks ago",
    people: "Lead Today",
    image: "data:image/jpeg;base64,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"
  }, {
    title: "Stuff",
    date: "Active 3 days ago",
    people: "No Fluff, Just Stuff",
    image: "http://www.loringdodge.com/files/images/fb/image7.jpg"
  }]

})


;