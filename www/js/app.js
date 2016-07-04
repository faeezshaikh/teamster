angular.module(
  'starter', ['ionic', 'starter.controllers', 'auth0', 'angular-storage',
     'ngCordova', 'firebase','angularMoment','ngtweet'
  ])
  
// TODO:
//  1. Likes - preserve state. Bug on load sometimes its on by default but doesnt hightlight
  //  8. Push Notification
  //  4. Implement Share
  // 11. Twitter page scrolling
  // 12. Twitter back from twitter buttons goes back to Chat
  // 13. Settings page
  // 14. Splash screen and logo - Test with Push Notifications
  // 15. Social Sharing
  // 16. Demo Practice .Bitcoin article
  

  //  7. Implement Adding new Article
 //  5. Article Date
  //  3. Article Content.

//  9. Ideas Tab?
//  10. Login page Test?

  
  // 11. Page Title   ********
  //  6. Hotness in article detail - show  ******
  //  2. Load chat performance. Create indexes on FB ****
  

//  Google API Key
//  AIzaSyD5r8X2j7QoWemIiQizNN5EjJqzsgHYU48
		  
.run(function($ionicPlatform, auth, $rootScope, store,$ionicModal,$window,$http) {
	
	
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
//    if (window.cordova && window.cordova.plugins.Keyboard) {
//      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
//      cordova.plugins.Keyboard.disableScroll(true);
//
//    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
    

 var push = new Ionic.Push({
      "debug": false
    });

    push.register(function(token) {
      console.log("Device token:",token.token);
      
      // Only works on actual device
      // apps.ionic.io --> App --> Settings --> API Keys --> token
      var data = {};
      var config = {
          headers : {
              'Content-Type': 'application/json',
              'Authorization' : 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiJhMDNjYjgwZi0yMmVmLTRmMDQtOTJhZi1kNDNiMWFlM2E3NDIifQ.FwRyg6N3Kr_9lU2sxvfHyLwOHWbHX4_rv_dUIGkknHw'
          }
      }
      var url = "https://api.ionic.io/push/tokens?token=" + token.token;
      $http.post(url, data, config)
      .success(function (data, status, headers, config) {
      	console.log('SUCCESS', data);
      })
      .error(function (data, status, header, config) {
      	console.log('FAIL', data);
      });
      
      
     push.saveToken(token,{'ignore_user': true});  // persist the token in the Ionic Platform 
    });
 
 
 
    
    
 
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
            templateUrl: 'templates/chat.html'
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
            controller: 'FeedsCtrl'
          }
        }
      })

       .state('app.logout', {
    	   url: '/logout',
    	   views: {
    	          'menuContent': {
    	            templateUrl: 'templates/logout.html',
    	            controller: 'FeedsCtrl'
    	          }
    	        }
      })
      .state('app.groups', {
        url: '/groups',
        views: {
          'menuContent': {
            templateUrl: 'templates/groups.html'
          }
        }
      })
         .state('app.tweets', {
        url: '/tweets',
        views: {
          'menuContent': {
            templateUrl: 'templates/tweets.html'
          }
        }
      })
         .state('app.timesheet', {
        url: '/timesheet',
        views: {
          'menuContent': {
            templateUrl: 'templates/timesheet.html',
            controller: ''
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
        if (state.current.name == '') {
          state.go('app.chat');
        } 
//        else {
//          state.go('app.feeds');
//        }
        return $location.path();
      });


    })
  //.run(function($rootScope, auth, store) {})

;