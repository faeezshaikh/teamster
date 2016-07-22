angular.module(
  'starter', ['ionic', 'starter.controllers', 'auth0', 'angular-storage',
     'ngCordova', 'firebase','angularMoment','ngtweet','angular-storage'
  ])
  
// TODO:

  
  // 19. Bug - Get Feed Details - Show spinner
  //  8. Push Notification - iOS - Production
  		// 8a. Write to app when msg is pushed.
  		// 8b. Utility that takes in msg, reads current registered tokens and pushes msg to all devices automatically.+ writes to firebase
  
  // 20. PPT & Talking points:
//  			Show Social Chorus
//  			3 of 6 True Norths
//  			Sprinkler whole startups behind that one idea
  // 15. Social Sharing
  // 11. Twitter page scrolling
  // 12. Twitter back from twitter buttons goes back to Chat

  
  // 13. Settings page  - Limit numner of Favorites, Push Not, Tags 
  // 14. Splash screen and logo - Test with Push Notifications
  // 16. Demo Practice .Bitcoin article
  // 17. Firechat showing multiple msgs
  

 

//  9. Ideas Tab?
//  10. Login page Test?
  
  
  
// 18. Bug - On updatinglikes Hotness will go away .. try with min 1 chatter  ***** 
  // 18a. Likes on toggle doesnt highlight..Have to refresh. *****
    //  3. Article Content. ****
   //  7. Implement Adding new Article *****
 //  5. Article Date ****
  //  1. Likes - preserve state. Bug on load sometimes its on by default but doesnt hightlight  **** 
  // 18. Hotness factor  **
  // 18. Settings page - Checkbox not toggable ****
  // 11. Page Title   ********
  //  6. Hotness in article detail - show  ******
  //  2. Load chat performance. Create indexes on FB ****
   //  4. Implement Share ********
  

//  Google API Key
//  AIzaSyD5r8X2j7QoWemIiQizNN5EjJqzsgHYU48
		  
.constant('FIREBASE_BASE_URL','https://teamsterapp.firebaseio.com/')
.run(function($ionicPlatform, auth, $rootScope, store,$ionicModal,$window,$http,$cordovaPush) {
	
	
  $ionicPlatform.ready(function() {
	    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
	    // for form inputs)
	  
	  // Do not un-comment . This doesnt work on actual device because of which push notification doesnt work.
	/*    if (window.cordova && window.cordova.plugins.Keyboard) {
	      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
	      cordova.plugins.Keyboard.disableScroll(true);
	
	    }
	    if (window.StatusBar) {
	      // org.apache.cordova.statusbar required
	      StatusBar.styleDefault();
	    }*/
	    

		 var push = new Ionic.Push({
		      "debug": false
		    });

	    push.register(function(token) {
	      console.log("Device token:",token.token);
	      // Only works on actual device
	      // apps.ionic.io --> App --> Settings --> API Keys --> token
	      push.saveToken(token,{'ignore_user': true});  // persist the token in the Ionic Platform
	      registerDeviceTokenWithIonicApi(token.token);
	    });
 
  

	    var iosConfig = {
	        'badge': true,
	        'sound': true,
	        'alert': true,
	      };

	    $cordovaPush.register(iosConfig).then(function(result) {
	      // Success -- send deviceToken to server, and store for future use
	      console.log('iOS Device Token: ' + result)
	      registerDeviceTokenWithIonicApi(result);
	      //$http.post('http://server.co/', {user: 'Bob', tokenID: result.deviceToken})
	    }, function(err) {
	      console.log('Registration error: ' + err)
	    });


	    $rootScope.$on('$cordovaPush:notificationReceived', function(event, notification) {
	      if (notification.alert) {
	        navigator.notification.alert(notification.alert);
	      }
	
	      if (notification.sound) {
	        var snd = new Media(event.sound);
	        snd.play();
	      }
	
	      if (notification.badge) {
	        $cordovaPush.setBadgeNumber(notification.badge).then(function(result) {
	          // Success!
	        }, function(err) {
	          // An error occurred. Show a message to the user
	        });
	      }
	    });
 
    
    function registerDeviceTokenWithIonicApi(token) {
   	 var data = {};
        var config = {
            headers : {
                'Content-Type': 'application/json',
                'Authorization' : 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiJhMDNjYjgwZi0yMmVmLTRmMDQtOTJhZi1kNDNiMWFlM2E3NDIifQ.FwRyg6N3Kr_9lU2sxvfHyLwOHWbHX4_rv_dUIGkknHw'
            }
        }
        var url = "https://api.ionic.io/push/tokens?token=" + token;
        $http.post(url, data, config)
        .success(function (data, status, headers, config) {
        	console.log('SUCCESS', data);
        })
        .error(function (data, status, header, config) {
        	console.log('FAIL', data);
        });
    }
    
    
 
  });
  
  
  $rootScope.$on('$stateChangeStart', function (event, toState, toParams,$location) {
	    var requireLogin = toState.data.requireLogin;

	    if (requireLogin && typeof $rootScope.currentUser === 'undefined') {
	      event.preventDefault();
	      // get me a login modal!
	      $ionicModal.fromTemplateUrl('templates/login.html', {
				scope : $rootScope
			}).then(function(modal) {
				$rootScope.explModal = modal;
				$rootScope.explModal.show();
			});
	    }
	  });

})


.filter('getById', function() {
  return function(input, id) {
    var i=0, len=input.length;
    for (; i<len; i++) {
      if (+input[i].id == +id) {
        return input[i];
      }
    }
    return null;
  }
})
.config(
    function($stateProvider, $urlRouterProvider) {

      $stateProvider
      

      .state('app', {
        url: '/app',
        abstract: true,
        templateUrl: 'templates/menu.html',
        controller: 'AppCtrl',
        data: {
          requireLogin: true
        }
      })

      .state('app.chat', {
        url: '/chat',
        views: {
          'menuContent': {
            templateUrl: 'templates/chat.html',
            controller: 'AppCtrl'
          }
        }
      })
     

      .state('app.feeds', {
        url: '/feeds',
        views: {
          'menuContent': {
            templateUrl: 'templates/feeds.html',
            controller: 'FeedsCtrl'
          }
        }
      })
      
      .state('app.login', {
        url: '/login',
        views: {
          'menuContent': {
            templateUrl: 'templates/login.html',
            controller: ''
          }
        }
      })

       .state('app.settings', {
    	   url: '/settings',
    	   views: {
    	          'menuContent': {
    	            templateUrl: 'templates/settings.html',
    	            controller: 'SettingsCtrl'
    	          }
    	        }
      })
     .state('app.admin', {
    	   url: '/admin',
    	   views: {
    	          'menuContent': {
    	            templateUrl: 'templates/admin.html',
    	            controller: 'AnnouncementsCtrl'   // admin is only for push notifications so tied to announcements ctrl 
    	          }
    	        }
      })
      .state('app.announcements', {
        url: '/announcements',
        views: {
          'menuContent': {
            templateUrl: 'templates/announcements.html',
            controller : 'AnnouncementsCtrl'
          }
        }
      })
         .state('app.tweets', {
        url: '/tweets',
        views: {
          'menuContent': {
            templateUrl: 'templates/tweets.html',
            controller: 'TwitterCtrl'
          }
        }
      })
         .state('app.timesheet', {
        url: '/timesheet',
        views: {
          'menuContent': {
            templateUrl: 'templates/timesheet.html',
            controller: 'TimesheetCtrl'
          }
        }
      })
      .state('app.single', {
        url: '/feeds/:feedId',
        views: {
          'menuContent': {
            templateUrl: 'templates/feedChat.html',
            controller: 'FeedChatCtrl'
          }
        }
      })
      .state('app.share', {
        url: '/share',
        views: {
          'menuContent': {
            templateUrl: 'templates/share.html',
            controller: 'SocialShareCtrl'
          }
        }
      })
       .state('app.feed', {
        url: '/feeds/detail/:feedId',
        views: {
          'menuContent': {
            templateUrl: 'templates/feed.html',
            controller: 'FeedDetailsCtrl'
          }
        }
      });
      // if none of the above states are matched, use this as the fallback
      //			$urlRouterProvider.otherwise('/app/chat');

      // this is due to the chatUI widget with hyperlinks, so if anytime other than the first login a link is clicked go to chat.
      $urlRouterProvider.otherwise(function($injector, $location) {
        var state = $injector.get('$state');
        console.log('State name = ',state.current.name);
        if (state.current.name == '' || state.current.name == 'app.chat') {
        	
          state.go('app.chat');
        } 
        else {
          state.go('app.feeds');
        }
        return $location.path();
      });


    })
  //.run(function($rootScope, auth, store) {})

;