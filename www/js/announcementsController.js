angular.module('starter.controllers')


.controller('AnnouncementsCtrl', function($scope,localStorage,$firebaseArray,$http) {
	var scrollRef;
	var favsShowing;
	function init() {
		favsShowing = false;
		 var baseRef = new Firebase('https://teamsterapp.firebaseio.com/announcements');

		  $scope.announcementsLoading = true;
		   scrollRef = new Firebase.util.Scroll(baseRef, 'order');
		  $scope.announcements = $firebaseArray(scrollRef);
		  scrollRef.scroll.next(8);
		  
		  
		  $scope.announcements.$loaded().then(function (data) {
			  $scope.announcementsLoading  = false;
			  
			});
	}
	 init();
	  
	 
	  
	
	 //// Adding announcements to Firebase while maintaing the order logic 
	  var lastAnnouncementRef = new Firebase('https://teamsterapp.firebaseio.com/lastAnnouncement');
	  var lastAnnouncementId,lastAnnouncementOrder;
	  
	  lastAnnouncementRef.on("value", function(snapshot) {
		  console.log('Last Idea objec',snapshot.val());
		  lastAnnouncementId =  snapshot.val().lastAnnouncementId;
		  lastAnnouncementOrder = snapshot.val().lastAnnouncementOrder;
		}, function (errorObject) {
		  console.log("The read of lastIdea Object failed: " + errorObject.code);
		});
	  
	  
	  /// Push Notifications //////////
	  
//	  http://chariotsolutions.com/blog/post/angularjs-corner-using-promises-q-handle-asynchronous-calls/
		  
	  function addNewAnnouncement(msg) {
		  var obj = {
				  id:lastAnnouncementId+1,
				  order: lastAnnouncementOrder-1,
				  text: msg,
				  dateTime: new Date().getTime().toString()
		  };
		  $scope.announcements.$add(obj);
		  var newLastAnnouncementRef = new Firebase('https://teamsterapp.firebaseio.com/lastAnnouncement');
		  newLastAnnouncementRef.update({ lastAnnouncementId: lastAnnouncementId+1, lastAnnouncementOrder: lastAnnouncementOrder-1 });
	  }
	  
	  function getRegisteredDeviceTokens() {
		  return $http.get('https://api.ionic.io/push/tokens', {
			    headers: {
			    	"Content-Type" : 'application/json',
			        "Authorization": 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiJhMDNjYjgwZi0yMmVmLTRmMDQtOTJhZi1kNDNiMWFlM2E3NDIifQ.FwRyg6N3Kr_9lU2sxvfHyLwOHWbHX4_rv_dUIGkknHw'
			    }
			  });
	  }
	  
	  $scope.sendPushNotification = function(title,msg) {
//		  var title = 'New Msg to Jaan'
//		  var msg = "Why dont you sleep?!";
		  
		  //addNewAnnouncement(title + ': ' + msg );
		  getRegisteredDeviceTokens().then(
				  function(response){
					  	console.log('Response',response);
					  	var deviceTokens = [];
					    var array = response.data.data;
					    angular.forEach(array, function(tokenObject, key) {
					    	  if(tokenObject.valid) {
					    		  deviceTokens.push(tokenObject.token);
					    	  }
					    	});
					    console.log(deviceTokens);
					    
					    var postData = {
							    "tokens": deviceTokens,
							    "profile": "production",
							    "notification": {
							        "title": title,
							        "message": msg,
							        "ios": {
							          "message": msg,
							          "badge": 1
							        },
							        "template_defaults": {
							          "name": "Tim"
							        }
							    }
							};
					    $http({
				            url: 'https://api.ionic.io/push/notifications',
				            method: "POST",
				            data: postData,
				            headers: {'Content-Type': 'application/json','Authorization':'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiJhMDNjYjgwZi0yMmVmLTRmMDQtOTJhZi1kNDNiMWFlM2E3NDIifQ.FwRyg6N3Kr_9lU2sxvfHyLwOHWbHX4_rv_dUIGkknHw'}
				        }).success(function (data, status, headers, config) {
				                console.log('Success pushing notification'); 
				                addNewAnnouncement(title + ': ' + msg );
				                alert('Notification successfully sent.');
				            }).error(function (data, status, headers, config) {
				            	console.log('Error pushing notification');
				            });
					  
				  },
				  function(error){
					  console.log('Error getting device tokens');
				  });  
		
	  }
	  
	  ////// Push Notifications End ////////
	  
	  // This function is called whenever the user reaches the bottom
	  $scope.loadMoreAnnouncements = function() {
		  console.log('loadmore announcements fired');
		    // load the next item
		    scrollRef.scroll.next(2);
		  $scope.$broadcast('scroll.infiniteScrollComplete');
	  };
	$scope.updateFavorites = function(announcement) {

		  var favAnnouncements = loadAnnouncementsFromCache();
		  if($scope.checkIfFavorite(announcement))  {
			  if(getIndexInArray(announcement,favAnnouncements) != -1) {
				  favAnnouncements.splice(getIndexInArray(announcement,favAnnouncements),1);
				  localStorage.set("announcements",JSON.stringify(favAnnouncements));
				  $scope.showFavoritesOnly();
			  }
		  }
		  else { // not liked yet, so go ahead and like it
			  favAnnouncements.push(announcement);
		  }
		  localStorage.set("announcements",JSON.stringify(favAnnouncements));
		  
		  if(!$scope.areFavoritesPreset) {
			  init();
		  }
	}
	
	function loadAnnouncementsFromCache() {
		var favoriteAnnouncements = JSON.parse(localStorage.get("announcements"));
		if(favoriteAnnouncements) {
			return favoriteAnnouncements
		} else {
			return [];
		}
	
		
	}
	
	$scope.areFavoritesPreset = function(){
		if(loadAnnouncementsFromCache().length!=0){
			return true;
		}
		return false;
	}
	
	$scope.areFavoritesShowing = function() {
		return favsShowing;
	}
	
	$scope.showAllButton = function() {
		init();
	}
	
	$scope.showFavoritesOnly = function() {
		favsShowing = true;
		var favs = loadAnnouncementsFromCache();
		 if(favs.length == 0) {
			  init();
		  } 
		 else {
			 $scope.announcements = favs;
		 }

	}
	function containsObject(obj, list) {
	    var i;
	    for (i = 0; i < list.length; i++) {
	        if (list[i].id === obj.id) {
	            return true;
	        }
	    }

	    return false;
	}
	
	function getIndexInArray(obj, list) {
	    var i;
	    for (i = 0; i < list.length; i++) {
	        if (list[i].id === obj.id) {
	            return i;
	        }
	    }

	    return -1;
	}
	
	$scope.checkIfFavorite = function(announcement) {
		var favoriteAnnouncements = loadAnnouncementsFromCache();
		 if(containsObject(announcement,favoriteAnnouncements)) {
			  	return true;
		  } else {
			  return false;
		  }
	}
});