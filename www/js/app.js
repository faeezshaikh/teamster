angular.module(
  'starter', ['ionic', 'starter.controllers', 'auth0', 'angular-storage',
     'ngCordova', 'firebase','angularMoment','ngtweet','angular-storage'
  ])
  
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
	    

	  console.log('In the ready mode...');
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

	   console.log('iosConfig = ', iosConfig);
	   $cordovaPush.register(iosConfig).then(function(result) {
	      // Success -- send deviceToken to server, and store for future use
	      console.log('iOS Device Token: ' + result)
	      registerDeviceTokenWithIonicApi(result);
	      //$http.post('http://server.co/', {user: 'Bob', tokenID: result.deviceToken})
	    }, function(err) {
	      console.log('Registration error: ' + err)
	    });

	   console.log('Done registering');
	
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