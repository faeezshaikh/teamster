angular.module(
  'starter', ['ionic', 'starter.controllers', 'auth0', 'angular-storage',
     'ngCordova', 'firebase','angularMoment','ngtweet'
  ])
  

.run(function($ionicPlatform, auth, $rootScope, store,$ionicModal,$window) {
	
	
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);

    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
    

//    var push = new Ionic.Push({
//      "debug": true
//    });
//
//    push.register(function(token) {
//      console.log("Device token:",token.token);
//      push.saveToken(token);  // persist the token in the Ionic Platform
//    });
 
	
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