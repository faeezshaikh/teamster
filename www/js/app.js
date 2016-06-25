angular.module(
  'starter', ['ionic', 'starter.controllers', 'auth0', 'angular-storage',
     'ngCordova', 'firebase','angularMoment'
  ])

.run(function($ionicPlatform, auth, $rootScope, store,$ionicModal) {
	
	
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

// This is for one on one chat..
//.factory('Message', 
//	function($firebase,auth) {
//		var ref = new Firebase('https://daughertyapp.firebaseio.com/');
//		var messages = $firebase(ref.child('messages')).$asArray();
// 
//		var Message = {
//			all: messages,
//			create: function (message) {
//				messages.$add({user: auth.profile.nickname, text: message, timestamp: Firebase.ServerValue.TIMESTAMP});
//			},
//			get: function (messageId) {
//				return $firebase(ref.child('messages').child(messageId)).$asObject();
//			},
//			delete: function (message) {
//				return messages.$remove(message);
//			}
//		};
// 
//		return Message;
//})

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

      .state('app.single', {
        url: '/feeds/:feedId',
        views: {
          'menuContent': {
            templateUrl: 'templates/feed.html',
            controller: 'FeedCtrl'
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
//        } else {
//          state.go('app.feeds');
//        }
        return $location.path();
      });


    })
  //.run(function($rootScope, auth, store) {})

;