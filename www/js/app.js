angular.module(
  'starter', ['ionic', 'starter.controllers', 'auth0', 'angular-storage',
    'angular-jwt', 'ngCordova', 'firebase'
  ])

.run(function($ionicPlatform, auth, $rootScope, store, jwtHelper) {
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

})

.factory('PersonService', function($http) {
  var BASE_URL = "http://api.randomuser.me/";
  var items = [];

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
    function($stateProvider, $urlRouterProvider, authProvider,
      jwtInterceptorProvider, $httpProvider) {

      $stateProvider


      .state('app', {
        url: '/app',
        abstract: true,
        templateUrl: 'templates/menu.html',
        controller: 'AppCtrl',
        data: {
          requiresLogin: true
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
          state.go('app.feeds');
        } else {
          state.go('app.chat');
        }
        return $location.path();
      });


    })
  //.run(function($rootScope, auth, store) {})

;