// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
angular.module(
		'starter',
		[ 'ionic', 'starter.controllers', 'auth0', 'angular-storage',
				'angular-jwt' ])

.run(function($ionicPlatform,auth,$rootScope,store,jwtHelper) {
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
	
	//This hooks all auth avents
	  auth.hookEvents();
	  //This event gets triggered on URL change
	  var refreshingToken = null;
	  $rootScope.$on('$locationChangeStart', function() {
	    var token = store.get('token');
	    var refreshToken = store.get('refreshToken');
	    if (token) {
	      if (!jwtHelper.isTokenExpired(token)) {
	        if (!auth.isAuthenticated) {
	          auth.authenticate(store.get('profile'), token);
	        }
	      } else {
	        if (refreshToken) {
	          if (refreshingToken === null) {
	            refreshingToken = auth.refreshIdToken(refreshToken).then(function(idToken) {
	              store.set('token', idToken);
	              auth.authenticate(store.get('profile'), idToken);
	            }).finally(function() {
	              refreshingToken = null;
	            });
	          }
	          return refreshingToken;
	        } else {
	          $location.path('/login');// Notice: this url must be the one defined 
	        }                          // in your login state. Refer to step 5.
	      }
	    }
	  });
})

.config(
		function($stateProvider, $urlRouterProvider, authProvider,
				jwtInterceptorProvider, $httpProvider) {
			$stateProvider

			.state('login', {
				url : "/login",
				templateUrl : "templates/login.html",
				controller : 'LoginCtrl'
			})

			.state('app', {
				url : '/app',
				abstract : true,
				templateUrl : 'templates/menu.html',
				controller : 'AppCtrl',
				data : {
					requiresLogin : true
				}
			})

			.state('app.search', {
				url : '/search',
				views : {
					'menuContent' : {
						templateUrl : 'templates/search.html'
					}
				}
			})

			.state('app.browse', {
				url : '/browse',
				views : {
					'menuContent' : {
						templateUrl : 'templates/browse.html',
						controller : 'PlaylistsCtrl'
					}
				}
			}).state('app.playlists', {
				url : '/playlists',
				views : {
					'menuContent' : {
						templateUrl : 'templates/playlists.html',
						controller : 'PlaylistsCtrl'
					}
				}
			})

			.state('app.single', {
				url : '/playlists/:playlistId',
				views : {
					'menuContent' : {
						templateUrl : 'templates/playlist.html',
						controller : 'PlaylistCtrl'
					}
				}
			});
			// if none of the above states are matched, use this as the fallback
			$urlRouterProvider.otherwise('/app/playlists');

			// Configure Auth0
			authProvider.init({
				domain : 'faeez.auth0.com',
				clientID : 'Cna9qHgpmvlcoAMZMhJFPoTGbNigvrmh',
				loginState : 'login'
			});

			jwtInterceptorProvider.tokenGetter = function(store, jwtHelper,
					auth) {
				var idToken = store.get('token');
				var refreshToken = store.get('refreshToken');
				if (!idToken || !refreshToken) {
					return null;
				}
				if (jwtHelper.isTokenExpired(idToken)) {
					return auth.refreshIdToken(refreshToken).then(
							function(idToken) {
								store.set('token', idToken);
								return idToken;
							});
				} else {
					return idToken;
				}
			}

			$httpProvider.interceptors.push('jwtInterceptor');

		}).run(function($rootScope, auth, store) {
	$rootScope.$on('$locationChangeStart', function() {
		if (!auth.isAuthenticated) {
			var token = store.get('token');
			if (token) {
				auth.authenticate(store.get('profile'), token);
			}
		}

	});
});
